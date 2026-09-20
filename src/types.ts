export interface Leader {
  id: string;
  name: string;
  role: string;
  subtitle?: string;
  category: 'executive' | 'faculty' | 'core';
  image: string;
  bio: string;
  quote?: string;
  contributions?: string[];
  github?: string;
  linkedin?: string;
  email?: string;
}

export interface DomainItem {
  id: string;
  code: string;
  title: string;
  sessionsCount: number;
  description: string;
  icon: string;
  tags: string[];
  recentWorkshops?: string[];
}

export interface EventGalleryImage {
  url: string;
  caption: string;
  tag?: string;
}

export interface EventTrack {
  trackName: string;
  targetYear: string;
  description: string;
  winners: {
    rank: string;
    names: string[];
  }[];
}

export interface EventItem {
  id: string;
  badge: string;
  dateStr: string;
  isoDate: string;
  venue: string;
  title: string;
  theme?: string;
  shortSummary: string;
  fullNarrative: string[];
  tracks?: EventTrack[];
  galleryImages: EventGalleryImage[];
  highlights?: string[];
}

export interface ArchiveItem {
  id: string;
  num: string; // e.g. "01"
  title: string;
  category: 'AI & ML' | 'Development' | 'Industry & Career' | 'Tools & Systems' | 'Academic & Grants';
  year: string;
  description: string;
  tags: string[];
  leadSpeaker?: string;
}

export interface TerminalLog {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'input';
  text: string;
  timestamp?: string;
}
