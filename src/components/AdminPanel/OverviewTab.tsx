import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Users,
  Calendar,
  Shield,
  Download,
  Upload,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import {
  getStoredMembers,
  getStoredEvents,
  getStoredLeaders,
  getStoredAnnouncement,
  updateMemberStatus,
} from '../../utils/storage';
import { playCyberClick, playAccessGranted } from '../../utils/audio';

interface OverviewTabProps {
  onNavigateToTab: (tab: 'members' | 'events' | 'leaders' | 'announcements') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToTab }) => {
  const [members, setMembers] = useState(() => getStoredMembers());
  const [events, setEvents] = useState(() => getStoredEvents());
  const [leaders, setLeaders] = useState(() => getStoredLeaders());
  const [announcement, setAnnouncement] = useState(() => getStoredAnnouncement());
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSync = () => {
      setMembers(getStoredMembers());
      setEvents(getStoredEvents());
      setLeaders(getStoredLeaders());
      setAnnouncement(getStoredAnnouncement());
    };
    window.addEventListener('cipher_data_updated', handleSync);
    return () => window.removeEventListener('cipher_data_updated', handleSync);
  }, []);

  const pendingMembers = members.filter((m) => m.status === 'pending');
  const recentMembers = members.slice(0, 5);

  const handleApprove = (id: string) => {
    playCyberClick();
    const updated = updateMemberStatus(id, 'approved');
    setMembers(updated);
  };

  const handleExportBackup = () => {
    playCyberClick();
    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      events: getStoredEvents(),
      members: getStoredMembers(),
      leaders: getStoredLeaders(),
      announcement: getStoredAnnouncement(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CIPHER_DB_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage('Database backup successfully generated and downloaded.');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.events) localStorage.setItem('cipher_events_v2', JSON.stringify(parsed.events));
        if (parsed.members) localStorage.setItem('cipher_members_v2', JSON.stringify(parsed.members));
        if (parsed.leaders) localStorage.setItem('cipher_leaders_v2', JSON.stringify(parsed.leaders));
        if (parsed.announcement) localStorage.setItem('cipher_announcement_v2', JSON.stringify(parsed.announcement));

        playAccessGranted();
        setMembers(getStoredMembers());
        setEvents(getStoredEvents());
        setLeaders(getStoredLeaders());
        setStatusMessage('Backup file imported and restored successfully!');
        setTimeout(() => setStatusMessage(''), 4000);
      } catch {
        setStatusMessage('Invalid JSON backup file structure.');
        setTimeout(() => setStatusMessage(''), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Welcome Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#06140b] via-[#051009] to-[#030805] border border-emerald-500/40 relative overflow-hidden shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 uppercase font-bold tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CIPHER CORE // SYSTEM CONTROL ACTIVE</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Welcome to CIPHER Admin Console</h1>
            <p className="text-xs text-emerald-300/80 font-sans mt-1 max-w-xl leading-relaxed">
              Full administrative authority over events, registered member submissions, officer rosters, and college broadcast banners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('members')}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Review Members ({pendingMembers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Members */}
        <div
          onClick={() => onNavigateToTab('members')}
          className="p-4 rounded-xl bg-[#050c07] border border-emerald-900/80 hover:border-emerald-500/70 transition-all cursor-pointer group shadow"
        >
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">// MEMBERS JOINED</span>
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{members.length}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-semibold">{pendingMembers.length} pending approval</span>
            <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Events */}
        <div
          onClick={() => onNavigateToTab('events')}
          className="p-4 rounded-xl bg-[#050c07] border border-emerald-900/80 hover:border-emerald-500/70 transition-all cursor-pointer group shadow"
        >
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">// PUBLISHED EVENTS</span>
            <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{events.length}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-sans">Active in archive</span>
            <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Officers */}
        <div
          onClick={() => onNavigateToTab('leaders')}
          className="p-4 rounded-xl bg-[#050c07] border border-emerald-900/80 hover:border-emerald-500/70 transition-all cursor-pointer group shadow"
        >
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">// LEADERSHIP ROSTER</span>
            <Shield className="w-4 h-4 group-hover:scale-110 transition-transform text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{leaders.length}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-sans">Executive &amp; faculty</span>
            <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Broadcast */}
        <div
          onClick={() => onNavigateToTab('announcements')}
          className="p-4 rounded-xl bg-[#050c07] border border-emerald-900/80 hover:border-emerald-500/70 transition-all cursor-pointer group shadow"
        >
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">// SITE BROADCAST</span>
            <Activity className="w-4 h-4 group-hover:scale-110 transition-transform text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {announcement.enabled ? 'ACTIVE' : 'OFFLINE'}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className={announcement.enabled ? 'text-emerald-400 font-sans' : 'text-emerald-600 font-sans'}>
              {announcement.enabled ? 'Visible to visitors' : 'Hidden from public'}
            </span>
            <ArrowRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Member Submissions + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Member Applications */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-xl border border-emerald-900/80 bg-[#050c07]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">// RECENT MEMBER REGISTRATIONS</div>
              <h2 className="text-base font-bold text-white">Students Who Joined CIPHER</h2>
            </div>
            <button
              onClick={() => onNavigateToTab('members')}
              className="text-xs text-emerald-400 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All ({members.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentMembers.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-600/90 font-mono border border-dashed border-emerald-950/80 rounded-lg">
                NO APPLICANTS REGISTERED YET. NEW SUBMISSIONS WILL APPEAR HERE.
              </div>
            ) : (
              recentMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg bg-black/60 border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-800 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      <span className="text-[11px] text-emerald-500 font-mono">({m.year})</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          m.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : m.status === 'pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400/90 font-sans mt-0.5">
                      Domain: <span className="text-white">{m.domain}</span>
                      {m.usn && <span className="text-emerald-600 font-mono ml-2">USN: {m.usn}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {m.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(m.id)}
                        className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] uppercase transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => onNavigateToTab('members')}
                      className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 hover:text-white text-[10px] uppercase cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Database & System Controls */}
        <div className="p-4 sm:p-5 rounded-xl border border-emerald-900/80 bg-[#050c07] flex flex-col justify-between">
          <div>
            <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">// SYSTEM STORAGE &amp; BACKUP</div>
            <h2 className="text-base font-bold text-white mb-2">Data Administration</h2>
            <p className="text-xs text-emerald-400/80 font-sans mb-4 leading-relaxed">
              Export full club state (events, registered members, officers) to JSON for offline backup or migration.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 px-3 rounded-lg border border-emerald-700 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 hover:text-white text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export JSON Database Backup</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-lg border border-emerald-900 hover:border-emerald-700 bg-black/80 hover:bg-emerald-950/50 text-emerald-300 hover:text-white text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Import / Restore Backup File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-emerald-950 text-[11px] text-emerald-600 font-sans">
            <div>Local persistence: LocalStorage Active</div>
            <div className="text-emerald-500 font-mono mt-0.5">Build Target: CIPHER-SJEC-PROD-2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};