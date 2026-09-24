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
  ChevronRight,
  Trash2,
} from 'lucide-react';

import type { MemberSubmission } from '../types';

import {
  getStoredMembers,
  updateMemberStatus,
  deleteStoredMember,
  clearAllStoredMembers,
} from '../utils/storage';

import { playCyberClick } from '../utils/audio';

const GithubLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.696.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.604 0 4.267 2.37 4.267 5.455v6.287zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM7.119 20.452H3.554V8.999h3.565v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 23.227 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const MembersTab: React.FC = () => {
  const [members, setMembers] = useState<MemberSubmission[]>(() =>
    getStoredMembers()
  );

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'contacted' | 'rejected'
  >('all');

  const [selectedMember, setSelectedMember] =
    useState<MemberSubmission | null>(null);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ type?: string }>;

      if (
        !customEvent.detail ||
        customEvent.detail.type === 'members'
      ) {
        setMembers(getStoredMembers());
      }
    };

    window.addEventListener('cipher_data_updated', handleSync);

    return () => {
      window.removeEventListener('cipher_data_updated', handleSync);
    };
  }, []);

  const refreshMembers = () => {
    playCyberClick();
    setMembers(getStoredMembers());
  };

  const handleStatusChange = (
    id: string,
    newStatus: MemberSubmission['status']
  ) => {
    playCyberClick();

    const updated = updateMemberStatus(id, newStatus);

    setMembers(updated);

    if (selectedMember && selectedMember.id === id) {
      setSelectedMember({
        ...selectedMember,
        status: newStatus,
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${name}'s registration record?`
      )
    ) {
      playCyberClick();

      const updated = deleteStoredMember(id);

      setMembers(updated);

      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all applicant records?'
      )
    ) {
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
      `"${(m.message || '')
        .replace(/"/g, '""')
        .replace(/\n/g, ' ')}"`,
      `"${m.github || 'N/A'}"`,
      `"${m.linkedin || 'N/A'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join(
        '\n'
      );

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CIPHER_Members_Export_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = members.filter((member) => {
    const q = search.toLowerCase();

    const matchesSearch =
      member.name.toLowerCase().includes(q) ||
      member.email.toLowerCase().includes(q) ||
      (member.usn &&
        member.usn.toLowerCase().includes(q)) ||
      (member.applicantId &&
        member.applicantId.toLowerCase().includes(q)) ||
      member.domain.toLowerCase().includes(q);

    const matchesYear =
      yearFilter === 'all' ||
      member.year
        .toLowerCase()
        .includes(yearFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      member.status === statusFilter;

    return matchesSearch && matchesYear && matchesStatus;
  });

  const totalCount = members.length;

  const approvedCount = members.filter(
    (member) => member.status === 'approved'
  ).length;

  const pendingCount = members.filter(
    (member) => member.status === 'pending'
  ).length;

  const contactedCount = members.filter(
    (member) => member.status === 'contacted'
  ).length;

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
              All student registrations submitted through the
              &quot;Join CIPHER&quot; portal and verified club members.
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
        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="text-[11px] text-emerald-400/80 font-bold uppercase tracking-wider">
            TOTAL APPLICANTS
          </div>

          <div className="text-3xl font-extrabold text-white mt-1.5">
            {totalCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>APPROVED</span>
          </div>

          <div className="text-3xl font-extrabold text-emerald-400 mt-1.5">
            {approvedCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>PENDING REVIEW</span>
          </div>

          <div className="text-3xl font-extrabold text-amber-400 mt-1.5">
            {pendingCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#061109] border border-emerald-950/90 shadow-sm">
          <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
            CONTACTED
          </div>

          <div className="text-3xl font-extrabold text-cyan-400 mt-1.5">
            {contactedCount}
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
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

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | 'all'
                  | 'pending'
                  | 'approved'
                  | 'contacted'
                  | 'rejected'
              )
            }
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

                      <div className="font-bold text-sm text-emerald-400 tracking-wider">
                        NO APPLICANTS REGISTERED
                      </div>

                      <p className="text-xs text-emerald-600 font-sans max-w-sm">
                        No member applications have been pre-seeded. Live
                        student submissions from the &quot;Join CIPHER&quot;
                        portal will automatically populate here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-emerald-600 font-mono"
                  >
                    NO APPLICANT RECORDS MATCH CURRENT SEARCH OR FILTERS
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-emerald-950/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {member.applicantId || member.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-xs sm:text-sm">
                        {member.name}
                      </div>

                      <div className="text-[11px] text-emerald-400/80 font-mono mt-0.5">
                        USN: {member.usn || 'PENDING'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{member.year}</span>
                      </div>

                      <div className="text-[11px] text-emerald-400/90 font-sans mt-0.5">
                        {member.domain}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={member.status}
                        onChange={(e) =>
                          handleStatusChange(
                            member.id,
                            e.target.value as MemberSubmission['status']
                          )
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
                          backgroundImage:
                            `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2334d399'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        }}
                      >
                        <option
                          value="approved"
                          className="bg-[#050e08] text-emerald-300"
                        >
                          ✓ Approved
                        </option>

                        <option
                          value="pending"
                          className="bg-[#050e08] text-amber-300"
                        >
                          ⏳ Pending
                        </option>

                        <option
                          value="contacted"
                          className="bg-[#050e08] text-cyan-300"
                        >
                          🔵 Contacted
                        </option>

                        <option
                          value="rejected"
                          className="bg-[#050e08] text-rose-300"
                        >
                          ✕ Rejected
                        </option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-sans truncate max-w-[200px]">
                        <Mail className="w-3 h-3 text-emerald-500 shrink-0" />

                        <span className="truncate">
                          {member.email}
                        </span>
                      </div>

                      {member.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/80 font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>

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
                          onClick={() =>
                            handleDelete(member.id, member.name)
                          }
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
                  APPLICANT DOSSIER //{' '}
                  {selectedMember.applicantId || selectedMember.id}
                </div>

                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedMember.name}
                </h3>

                <div className="text-xs text-emerald-400 font-mono mt-0.5">
                  USN: {selectedMember.usn || 'N/A'} •{' '}
                  {selectedMember.year} • {selectedMember.domain}
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
                  {selectedMember.message ||
                    'No specific statement provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-950">
                  <div className="text-[10px] text-emerald-500 uppercase font-bold">
                    College Email
                  </div>

                  <div className="text-white truncate mt-0.5 font-sans">
                    {selectedMember.email}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-950">
                  <div className="text-[10px] text-emerald-500 uppercase font-bold">
                    Contact Phone
                  </div>

                  <div className="text-white mt-0.5 font-sans">
                    {selectedMember.phone || 'N/A'}
                  </div>
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
                    <GithubLogo className="w-3.5 h-3.5" />
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
                    <LinkedinLogo className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-emerald-900/80 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleStatusChange(
                      selectedMember.id,
                      'approved'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                >
                  Approve Member
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(
                      selectedMember.id,
                      'contacted'
                    )
                  }
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