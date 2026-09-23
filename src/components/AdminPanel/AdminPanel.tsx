import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  User,
  Megaphone,
  ArrowLeft,
  LogOut,
   BookOpen,
} from 'lucide-react';
import { MembersTab } from './MembersTab';
import { EventsTab } from './EventsTab';
import { LeadersTab } from './LeadersTab';
import { ActivitiesTab } from './ActivitiesTab';
import { AnnouncementTab } from './AnnouncementTab';
import { AdminAuthModal } from './AdminAuthModal';
import { playCyberClick } from '../../utils/audio';
import { getStoredMembers, getStoredEvents, getStoredActivities } from '../../utils/storage';

interface AdminPanelProps {
  onExit: () => void;
  onLogout?: () => void;
}
type TabType = 'events' | 'activities' | 'members' | 'leaders' | 'announcements';


export const AdminPanel: React.FC<AdminPanelProps> = ({ onExit, onLogout }) => {
  // Always require password authentication login screen when accessing admin
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      return (
        sessionStorage.getItem('cipher_admin_session') === 'true' ||
        localStorage.getItem('cipher_admin_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('activities');
  const [membersCount, setMembersCount] = useState<number>(() => getStoredMembers().length);
  const [eventsCount, setEventsCount] = useState<number>(() => getStoredEvents().length);
  const [activitiesCount, setActivitiesCount] = useState<number>(() => getStoredActivities().length);

  // Sync member and event counts
  useEffect(() => {
    const updateCounts = () => {
      const mems = getStoredMembers();
      const evts = getStoredEvents();
      const acts = getStoredActivities();
      setMembersCount(mems.length);
      setEventsCount(evts.length);
      setActivitiesCount(acts.length);
    };

    updateCounts();
    window.addEventListener('cipher_data_updated', updateCounts);
    return () => window.removeEventListener('cipher_data_updated', updateCounts);
  }, []);

  const handleExit = () => {
    playCyberClick();
    if (typeof window !== 'undefined') {
      try {
        if (window.history?.pushState) {
          window.history.pushState({}, '', '/');
        }
        window.location.hash = '';
      } catch {
        // ignore
      }
    }
    onExit();
  };

  const handleLogout = () => {
    playCyberClick();
    try {
      sessionStorage.setItem('cipher_admin_locked', 'true');
      sessionStorage.removeItem('cipher_admin_session');
      localStorage.removeItem('cipher_admin_auth');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    if (onLogout) {
      onLogout();
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminAuthModal
        onSuccess={() => {
          try {
            sessionStorage.removeItem('cipher_admin_locked');
            sessionStorage.setItem('cipher_admin_session', 'true');
          } catch {
            // ignore
          }
          setIsAuthenticated(true);
        }}
        onCancel={handleExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070d09] text-emerald-100 font-mono flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Admin Header matching user's photo */}
      <header className="border-b border-emerald-950/90 bg-[#060c08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Back Arrow + Brand + Level-0 Auth + Node info */}
          <div className="flex items-start gap-3">
            <button
              onClick={handleExit}
              className="mt-0.5 p-1.5 text-emerald-400 hover:text-white rounded hover:bg-emerald-950/60 transition-colors cursor-pointer"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <h1 className="font-bold text-sm sm:text-base text-white tracking-wider">
                  CIPHER // ROOT COMMAND CONSOLE
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  LEVEL-0 AUTH
                </span>
              </div>
            </div>
          </div>

          {/* Right: Public Site button + Lock Console button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="px-3.5 py-1.5 rounded-lg border border-emerald-800/80 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Tab Navigation Bar (exactly like user screenshot) */}
      <nav className="border-b border-emerald-950/80 bg-[#060b07] px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Events & Summits Tab */}
          <button
            onClick={() => {
              playCyberClick();
              setActiveTab('events');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events &amp; Summits</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'events' ? 'bg-black text-emerald-400' : 'text-emerald-400'
              }`}
            >
              {eventsCount}
            </span>
          </button>
     {/* Activities Tab (with external links & edit capabilities) */}
          <button
            onClick={() => {
              playCyberClick();
              setActiveTab('activities');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'activities'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Activities</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'activities' ? 'bg-black text-emerald-400' : 'text-emerald-400'
              }`}
            >
              {activitiesCount}
            </span>
          </button>
          {/* Joined Members Tab (active style matching Image 1) */}
          <button
            onClick={() => {
              playCyberClick();
              setActiveTab('members');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Joined Members</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                activeTab === 'members' ? 'bg-black text-emerald-400' : 'text-emerald-400'
              }`}
            >
              {membersCount}
            </span>
          </button>

          {/* Leadership Roster Tab (active style matching Image 2) */}
          <button
            onClick={() => {
              playCyberClick();
              setActiveTab('leaders');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'leaders'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Leadership Roster</span>
          </button>

          {/* Campus Broadcast Tab */}
          <button
            onClick={() => {
              playCyberClick();
              setActiveTab('announcements');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/50'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Campus Broadcast</span>
          </button>
        </div>
      </nav>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'activities' && <ActivitiesTab />}
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'events' && <EventsTab />}
        {activeTab === 'leaders' && <LeadersTab />}
        {activeTab === 'announcements' && <AnnouncementTab />}
      </main>
    </div>
  );
};

