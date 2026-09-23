import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileSpreadsheet,
  X,
  Mail,
  Phone,
  Github,
  Linkedin,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { MemberSubmission } from '../../types';
import {
  getStoredMembers,
  updateMemberStatus,
  deleteStoredMember,
  clearAllStoredMembers,
} from '../../utils/storage';
import { playCyberClick } from '../../utils/audio';

export const MembersTab: React.FC = () => {
  const [members, setMembers] = useState<MemberSubmission[]>(() => getStoredMembers());
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'contacted' | 'rejected'>('all');
  const [selectedMember, setSelectedMember] = useState<MemberSubmission | null>(null);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as unknown as { detail?: { type?: string } };
      if (!customEvent?.detail || customEvent.detail.type === 'members') {
        setMembers(getStoredMembers());
      }
    };
    window.addEventListener('cipher_data_updated', handleSync);
    return () => window.removeEventListener('cipher_data_updated', handleSync);
  }, []);

  const refreshMembers = () => {
    playCyberClick();
    setMembers(getStoredMembers());
  };

  const handleStatusChange = (id: string, newStatus: MemberSubmission['status']) => {
    playCyberClick();
    const updated = updateMemberStatus(id, newStatus);
    setMembers(updated);
    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({ ...selectedMember, status: newStatus });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}'s registration record?`)) {
      playCyberClick();
      const updated = deleteStoredMember(id);
      setMembers(updated);
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all applicant records?')) {
      playCyberClick();
      const reset = clearAllStoredMembers();
      setMembers(reset);
      setSelectedMember(null);
    }
  };

  const handleExportCSV = () => {
    playCyberClick();
    const headers = [
      'Applicant ID',
      'Name',
      'Email',
      'Phone',
      'USN',
      'Year',
      'Domain',
      'Status',
      'Submitted At',
      'Message',
      'GitHub',
      'LinkedIn',
    ];

    const rows = members.map((m) => [
      `"${m.applicantId || m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.email}"`,
      `"${m.phone || 'N/A'}"`,
      `"${m.usn || 'N/A'}"`,
      `"${m.year}"`,
      `"${m.domain}"`,
      `"${m.status}"`,
      `"${new Date(m.submittedAt).toLocaleString()}"`,
      `"${(m.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${m.github || 'N/A'}"`,
      `"${m.linkedin || 'N/A'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CIPHER_Members_Export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.usn && m.usn.toLowerCase().includes(q)) ||
      (m.applicantId && m.applicantId.toLowerCase().includes(q)) ||
      m.domain.toLowerCase().includes(q);

    const matchesYear =
      yearFilter === 'all' || m.year.toLowerCase().includes(yearFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

    return matchesSearch && matchesYear && matchesStatus;
  });

  const totalCount = members.length;
  const approvedCount = members.filter((m) => m.status === 'approved').length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;
  const contactedCount = members.filter((m) => m.status === 'contacted').length;

  return (
    <div className="space-y-5 font-mono">
      {/* Top Banner Header Card */}
      <div className="rounded-xl border border-emerald-900/90 bg-[#061109]/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#041d0e] border border-emerald-500/80 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              CIPHER MEMBERS &amp; APPLICANTS REPOSITORY
            </h2>
            <p className="text-xs text-emerald-500/90 font-sans mt-0.5">
              All student registrations submitted through the &quot;Join CIPHER&quot; portal and verified club members.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {members.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 rounded-lg border border-rose-900/80 bg-[#160507] hover:bg-rose-950 text-rose-300 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
              title="Clear all applicant records"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            disabled={members.length === 0}
            className={`px-3.5 py-1.5 rounded-lg border border-emerald-800 bg-[#07190d] text-xs flex items-center gap-1.5 transition-all font-sans ${
              members.length === 0
                ? 'opacity-50 cursor-not-allowed text-emerald-700'
                : 'hover:bg-emerald-950 text-emerald-300 hover:text-white cursor-pointer'
            }`}
            title="Export CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={refreshMembers}
            className="p-1.5 rounded-lg border border-emerald-800 bg-[#07190d] hover:bg-emerald-950 text-emerald-400 hover:text-white transition-all cursor-pointer"
            title="Refresh List"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Applicants */}
        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="text-[11px] text-emerald-400/80 font-bold uppercase tracking-wider">
            TOTAL APPLICANTS
          </div>
          <div className="text-3xl font-extrabold text-white mt-1.5">{totalCount}</div>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>APPROVED</span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1.5">{approvedCount}</div>
        </div>

        {/* Pending Review */}
        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>PENDING REVIEW</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1.5">{pendingCount}</div>
        </div>

        {/* Contacted */}
        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
            CONTACTED
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1.5">{contactedCount}</div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, USN, email, or domain..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#040c07] border border-emerald-900/80 focus:border-emerald-400 text-xs text-emerald-100 placeholder-emerald-700/80 font-mono tracking-wide"
          />
        </div>

        {/* Year Filter */}
        <div className="md:col-span-3">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#040c07] border border-emerald-900/80 text-xs text-emerald-200 focus:border-emerald-400 font-sans cursor-pointer"
          >
            <option value="all">All Academic Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-[#040c07] border border-emerald-900/80 text-xs text-emerald-200 focus:border-emerald-400 font-sans cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-emerald-950/90 bg-[#050e08] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-900/60 bg-[#06140b] text-emerald-400/90 font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">APPLICANT ID</th>
                <th className="py-3 px-4">STUDENT DETAILS</th>
                <th className="py-3 px-4">YEAR &amp; DOMAIN</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">CONTACT</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-emerald-600 font-mono">
                      <Users className="w-8 h-8 text-emerald-800/80 mb-1" />
                      <div className="font-bold text-sm text-emerald-400 tracking-wider">NO APPLICANTS REGISTERED</div>
                      <p className="text-xs text-emerald-600 font-sans max-w-sm">
                        No member applications have been pre-seeded. Live student submissions from the &quot;Join CIPHER&quot; portal will automatically populate here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-emerald-600 font-mono">
                    NO APPLICANT RECORDS MATCH CURRENT SEARCH OR FILTERS
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-emerald-950/20 transition-colors"
                  >
                    {/* APPLICANT ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {member.applicantId || member.id}
                    </td>

                    {/* STUDENT DETAILS */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-emerald-400/80 font-mono mt-0.5">
                        USN: {member.usn || 'PENDING'}
                      </div>
                    </td>

                    {/* YEAR & DOMAIN */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{member.year}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400/90 font-sans mt-0.5">
                        {member.domain}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4">
                      <select
                        value={member.status}
                        onChange={(e) =>
                          handleStatusChange(member.id, e.target.value as any)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer font-sans appearance-none pr-6 bg-no-repeat bg-[right_0.4rem_center] bg-[length:0.6rem] ${
                          member.status === 'approved'
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                            : member.status === 'pending'
                            ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                            : member.status === 'contacted'
                            ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                            : 'bg-rose-950/70 border-rose-500 text-rose-300'
                        }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2334d399'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        }}
                      >
                        <option value="approved" className="bg-[#050e08] text-emerald-300">
                          ✓ Approved
                        </option>
                        <option value="pending" className="bg-[#050e08] text-amber-300">
                          ⏳ Pending
                        </option>
                        <option value="contacted" className="bg-[#050e08] text-cyan-300">
                          🔵 Contacted
                        </option>
                        <option value="rejected" className="bg-[#050e08] text-rose-300">
                          ✕ Rejected
                        </option>
                      </select>
                    </td>

                    {/* CONTACT */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-sans truncate max-w-[200px]">
                        <Mail className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/80 font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            playCyberClick();
                            setSelectedMember(member);
                          }}
                          className="p-1.5 text-emerald-400 hover:text-white rounded hover:bg-emerald-900/40 transition-colors cursor-pointer"
                          title="View Full Application Dossier"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-1.5 text-rose-500/80 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Dossier Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#061209] border border-emerald-500 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <div className="flex items-start justify-between border-b border-emerald-900/80 pb-4">
              <div>
                <div className="text-[10px] text-emerald-400 uppercase font-mono tracking-widest">
                  APPLICANT DOSSIER // {selectedMember.applicantId || selectedMember.id}
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{selectedMember.name}</h3>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">
                  USN: {selectedMember.usn || 'N/A'} • {selectedMember.year} • {selectedMember.domain}
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 text-emerald-500 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-black/60 border border-emerald-950">
                <div className="text-[10px] text-emerald-500 uppercase tracking-wider mb-1 font-bold">
                  Statement of Interest &amp; Motivation
                </div>
                <p className="text-emerald-200 font-sans leading-relaxed">
                  {selectedMember.message || 'No specific statement provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-950">
                  <div className="text-[10px] text-emerald-500 uppercase font-bold">College Email</div>
                  <div className="text-white truncate mt-0.5 font-sans">{selectedMember.email}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-950">
                  <div className="text-[10px] text-emerald-500 uppercase font-bold">Contact Phone</div>
                  <div className="text-white mt-0.5 font-sans">{selectedMember.phone || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                {selectedMember.github && (
                  <a
                    href={selectedMember.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:text-white"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {selectedMember.linkedin && (
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:text-white"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-emerald-900/80 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedMember.id, 'approved')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                >
                  Approve Member
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMember.id, 'contacted')}
                  className="px-3 py-1.5 rounded-lg border border-cyan-500 text-cyan-300 hover:bg-cyan-950/50 text-xs cursor-pointer"
                >
                  Mark Contacted
                </button>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-3 py-1.5 rounded-lg border border-emerald-800 text-emerald-400 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};