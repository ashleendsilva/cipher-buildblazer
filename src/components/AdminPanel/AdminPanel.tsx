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
import { getStoredMembers } from '../../utils/storage';

interface AdminPanelProps {
  onExit: () => void;
  onLogout?: () => void;
}

type TabType =
  | 'events'
  | 'activities'
  | 'members'
  | 'leaders'
  | 'announcements';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return (
    sessionStorage.getItem('cipher_admin_token') ||
    localStorage.getItem('cipher_admin_token')
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onExit,
  onLogout,
}) => {
  // Always require password authentication when accessing admin
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

  const [membersCount, setMembersCount] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [activitiesCount, setActivitiesCount] = useState<number>(0);

  // ------------------------------------------------------------
  // LOAD COUNTS FROM BACKEND
  // ------------------------------------------------------------

  useEffect(() => {
    const updateCounts = async () => {
      // ----------------------------------------------------------
      // MEMBERS
      // ----------------------------------------------------------

      const token = getAdminToken();

      if (!token) {
        setEventsCount(0);
        setMembersCount(getStoredMembers().length);
        setActivitiesCount(0);
        return;
      }

      // ----------------------------------------------------------
      // EVENTS
      // ----------------------------------------------------------

      try {
        const eventsResponse = await fetch(
          `${API_BASE_URL}/api/admin/events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }

        const events = await eventsResponse.json();

        setEventsCount(Array.isArray(events) ? events.length : 0);
      } catch (error) {
        console.error('Failed to fetch events count:', error);
        setEventsCount(0);
      }

      // ----------------------------------------------------------
      // ACTIVITIES
      // ----------------------------------------------------------

      try {
        const activitiesResponse = await fetch(
          `${API_BASE_URL}/api/activities`
        );

        if (!activitiesResponse.ok) {
          throw new Error('Failed to fetch activities');
        }

        const activities = await activitiesResponse.json();

        setActivitiesCount(
          Array.isArray(activities) ? activities.length : 0
        );
      } catch (error) {
        console.error('Failed to fetch activities count:', error);
        setActivitiesCount(0);
      }

      // ----------------------------------------------------------
      // MEMBERS / APPLICATIONS
      // ----------------------------------------------------------

      try {
        const membersResponse = await fetch(
          `${API_BASE_URL}/api/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!membersResponse.ok) {
          throw new Error('Failed to fetch applications');
        }

        const applications = await membersResponse.json();

        setMembersCount(
          Array.isArray(applications) ? applications.length : 0
        );
      } catch (error) {
        console.error('Failed to fetch members count:', error);
        setMembersCount(0);
      }
    };

    if (isAuthenticated) {
      updateCounts();
    }

    // Listen for updates from admin tabs
    const handleDataUpdated = (event: Event) => {
      const customEvent =
        event as CustomEvent<{ type?: string }>;

      const type = customEvent.detail?.type;

      if (
        !type ||
        type === 'events' ||
        type === 'activities' ||
        type === 'members'
      ) {
        updateCounts();
      }
    };

    window.addEventListener(
      'cipher_data_updated',
      handleDataUpdated
    );

    return () => {
      window.removeEventListener(
        'cipher_data_updated',
        handleDataUpdated
      );
    };
  }, [isAuthenticated, activeTab]);

  // ------------------------------------------------------------
  // EXIT ADMIN PANEL
  // ------------------------------------------------------------

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

  // ------------------------------------------------------------
  // LOGOUT
  // ------------------------------------------------------------

  const handleLogout = () => {
    playCyberClick();

    try {
      sessionStorage.setItem('cipher_admin_locked', 'true');

      sessionStorage.removeItem('cipher_admin_session');
      localStorage.removeItem('cipher_admin_auth');

      sessionStorage.removeItem('cipher_admin_token');
      localStorage.removeItem('cipher_admin_token');
    } catch {
      // ignore
    }

    setIsAuthenticated(false);

    if (onLogout) {
      onLogout();
    }
  };

  // ------------------------------------------------------------
  // AUTH SCREEN
  // ------------------------------------------------------------

  if (!isAuthenticated) {
    return (
      <AdminAuthModal
        onSuccess={() => {
          try {
            sessionStorage.removeItem('cipher_admin_locked');
            sessionStorage.setItem(
              'cipher_admin_session',
              'true'
            );
          } catch {
            // ignore
          }

          setIsAuthenticated(true);
        }}
        onCancel={handleExit}
      />
    );
  }

  // ------------------------------------------------------------
  // ADMIN PANEL
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#070d09] text-emerald-100 font-mono flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* ========================================================
          TOP ADMIN HEADER
      ======================================================== */}

      <header className="border-b border-emerald-950/90 bg-[#060c08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Back Arrow + Brand */}
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

          {/* Right: Public Site + Lock Console */}
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

      {/* ========================================================
          ADMIN TAB NAVIGATION
      ======================================================== */}

      <nav className="border-b border-emerald-950/80 bg-[#060b07] px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">

          {/* EVENTS */}
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
                activeTab === 'events'
                  ? 'bg-black text-emerald-400'
                  : 'text-emerald-400'
              }`}
            >
              {eventsCount}
            </span>
          </button>

          {/* ACTIVITIES */}
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
                activeTab === 'activities'
                  ? 'bg-black text-emerald-400'
                  : 'text-emerald-400'
              }`}
            >
              {activitiesCount}
            </span>
          </button>

          {/* JOINED MEMBERS */}
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
                activeTab === 'members'
                  ? 'bg-black text-emerald-400'
                  : 'text-emerald-400'
              }`}
            >
              {membersCount}
            </span>
          </button>

          {/* LEADERSHIP */}
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

          {/* ANNOUNCEMENTS */}
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

      {/* ========================================================
          MAIN TAB CONTENT
      ======================================================== */}

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