import type { EventItem, Leader, MemberSubmission, ClubAnnouncement, ArchiveItem } from '../types';
import { EVENTS as DEFAULT_EVENTS, LEADERS as DEFAULT_LEADERS, ARCHIVE_ITEMS as DEFAULT_ACTIVITIES } from '../data/cipherData';
import { normalizeUrl } from './url';

export type { MemberSubmission, ClubAnnouncement, ArchiveItem };

const STORAGE_KEYS = {
  EVENTS: 'cipher_events_v2',
  LEADERS: 'cipher_leaders_v2',
  MEMBERS: 'cipher_members_v2',
  ANNOUNCEMENT: 'cipher_announcement_v2',
  ACTIVITIES: 'cipher_activities_v2',
  ADMIN_AUTH: 'cipher_admin_auth_v2',
};

// Zero pre-seeded members - clean repository for genuine student submissions
const SEED_MEMBERS: MemberSubmission[] = [];

const DEFAULT_ANNOUNCEMENT: ClubAnnouncement = {
  enabled: true,
  text: 'PROMPT OPS-2K26 Winners announced! Join CIPHER recruiting drive open for 2026 cohort.',
  badge: 'ANNOUNCEMENT',
  linkText: 'Join Now',
  linkUrl: '#join',
};

// Dispatch event across windows/tabs and local component listeners
export const notifyDataUpdated = (type: 'events' | 'members' | 'leaders' | 'announcement' | 'activities') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cipher_data_updated', { detail: { type } }));
  }
};

/* ---------------- EVENTS ---------------- */
export const getStoredEvents = (): EventItem[] => {
  if (typeof window === 'undefined') return DEFAULT_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse events from storage', err);
    return DEFAULT_EVENTS;
  }
};

export const saveStoredEvents = (events: EventItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  notifyDataUpdated('events');
};

export const addStoredEvent = (event: EventItem) => {
  const current = getStoredEvents();
  // Insert at top of array
  const updated = [event, ...current];
  saveStoredEvents(updated);
  return updated;
};

export const updateStoredEvent = (event: EventItem) => {
  const current = getStoredEvents();
  const updated = current.map((e) => (e.id === event.id ? event : e));
  saveStoredEvents(updated);
  return updated;
};

export const deleteStoredEvent = (id: string) => {
  const current = getStoredEvents();
  const updated = current.filter((e) => e.id !== id);
  saveStoredEvents(updated);
  return updated;
};

export const resetStoredEvents = () => {
  saveStoredEvents(DEFAULT_EVENTS);
  return DEFAULT_EVENTS;
};

/* ---------------- MEMBERS ---------------- */
export const getStoredMembers = (): MemberSubmission[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
      return [];
    }
    const parsed: MemberSubmission[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out any legacy dummy/seed applicant data
    const legacySeedIds = ['mem-001', 'mem-002', 'mem-003', 'mem-004', 'mem-005', 'mem-006'];
    const legacyNames = ['Ananya Rao', 'Karthik Bhandary', 'Rohan Shenoy', 'Sneha Kumari', 'Aditya Pai', 'Pooja Nayak'];
    const cleaned = parsed.filter(
      (m) => !legacySeedIds.includes(m.id) && !legacyNames.includes(m.name)
    );

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.error('Failed to parse members from storage', err);
    return [];
  }
};

export const saveStoredMembers = (members: MemberSubmission[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  notifyDataUpdated('members');
};

export const clearAllStoredMembers = (): MemberSubmission[] => {
  saveStoredMembers([]);
  return [];
};

export const addStoredMember = (member: Omit<MemberSubmission, 'id' | 'submittedAt'>): MemberSubmission => {
  const current = getStoredMembers();
  const newRecord: MemberSubmission = {
    ...member,
    id: `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    submittedAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...current];
  saveStoredMembers(updated);
  return newRecord;
};

export const updateMemberStatus = (id: string, status: MemberSubmission['status']) => {
  const current = getStoredMembers();
  const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
  saveStoredMembers(updated);
  return updated;
};

export const deleteStoredMember = (id: string) => {
  const current = getStoredMembers();
  const updated = current.filter((m) => m.id !== id);
  saveStoredMembers(updated);
  return updated;
};

export const resetStoredMembers = () => {
  saveStoredMembers(SEED_MEMBERS);
  return SEED_MEMBERS;
};

/* ---------------- LEADERS ---------------- */
export const getStoredLeaders = (): Leader[] => {
  if (typeof window === 'undefined') return DEFAULT_LEADERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(DEFAULT_LEADERS));
      return DEFAULT_LEADERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse leaders from storage', err);
    return DEFAULT_LEADERS;
  }
};

export const saveStoredLeaders = (leaders: Leader[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LEADERS, JSON.stringify(leaders));
  notifyDataUpdated('leaders');
};

export const updateStoredLeader = (leader: Leader) => {
  const current = getStoredLeaders();
  const updated = current.map((l) => (l.id === leader.id ? leader : l));
  saveStoredLeaders(updated);
  return updated;
};

export const addStoredLeader = (leader: Leader) => {
  const current = getStoredLeaders();
  const updated = [...current, leader];
  saveStoredLeaders(updated);
  return updated;
};

export const deleteStoredLeader = (id: string) => {
  const current = getStoredLeaders();
  const updated = current.filter((l) => l.id !== id);
  saveStoredLeaders(updated);
  return updated;
};

export const resetStoredLeaders = () => {
  saveStoredLeaders(DEFAULT_LEADERS);
  return DEFAULT_LEADERS;
};

/* ---------------- ANNOUNCEMENT ---------------- */
export const getStoredAnnouncement = (): ClubAnnouncement => {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(DEFAULT_ANNOUNCEMENT));
      return DEFAULT_ANNOUNCEMENT;
    }
    const parsed = JSON.parse(raw);
    // If the announcement was stored with enabled: false from the previous removal turn,
    // re-enable it so the public broadcast banner is active as requested
    if (parsed && parsed.enabled === false && (!parsed.text || parsed.text.includes('PROMPT OPS') || parsed.text.includes('CIPHER') || parsed.text.includes('Winners') || parsed.text.includes('Cohort'))) {
      parsed.enabled = true;
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
};

export const saveStoredAnnouncement = (announcement: ClubAnnouncement) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
  notifyDataUpdated('announcement');
};

/* ---------------- ACTIVITIES / ARCHIVE ITEMS ---------------- */
export const getStoredActivities = (): ArchiveItem[] => {
  if (typeof window === 'undefined') return DEFAULT_ACTIVITIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ACTIVITIES;
  } catch (err) {
    console.error('Failed to parse activities from storage', err);
    return DEFAULT_ACTIVITIES;
  }
};

export const saveStoredActivities = (activities: ArchiveItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  notifyDataUpdated('activities');
};

export const addStoredActivity = (activity: { title: string; url?: string; category?: ArchiveItem['category']; description?: string; tags?: string[] }) => {
  const current = getStoredActivities();
  const nextNum = String(current.length + 1).padStart(2, '0');
  const newActivity: ArchiveItem = {
    id: `activity-${Date.now()}`,
    num: nextNum,
    title: activity.title.trim(),
    url: activity.url ? normalizeUrl(activity.url) : '',
    category: activity.category || 'Development',
    year: String(new Date().getFullYear()),
    description: activity.description?.trim() || 'Technical activity session hosted by CIPHER.',
    tags: activity.tags && activity.tags.length > 0 ? activity.tags : ['CIPHER', 'Technical', 'Workshop'],
    leadSpeaker: 'CIPHER Team',
  };
  const updated = [newActivity, ...current];
  saveStoredActivities(updated);
  return updated;
};

export const updateStoredActivity = (id: string, updates: { title: string; url?: string }) => {
  const current = getStoredActivities();
  const updated = current.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        title: updates.title.trim(),
        url: updates.url ? normalizeUrl(updates.url) : '',
      };
    }
    return item;
  });
  saveStoredActivities(updated);
  return updated;
};

export const deleteStoredActivity = (id: string) => {
  const current = getStoredActivities();
  const updated = current.filter((item) => item.id !== id);
  saveStoredActivities(updated);
  return updated;
};

export const resetStoredActivities = () => {
  saveStoredActivities(DEFAULT_ACTIVITIES);
  return DEFAULT_ACTIVITIES;
};

/* ---------------- ADMIN AUTH ---------------- */
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
};

export const setAdminAuthenticated = (auth: boolean) => {
  if (typeof window === 'undefined') return;
  if (auth) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};
