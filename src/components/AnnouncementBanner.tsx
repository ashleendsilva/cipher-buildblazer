import React, { useState, useEffect } from 'react';
import { Megaphone, ArrowRight, X } from 'lucide-react';
import { ClubAnnouncement } from '../types';
import { getStoredAnnouncement } from '../utils/storage';
import { playCyberClick } from '../utils/audio';

interface AnnouncementBannerProps {
  onOpenJoin?: () => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ onOpenJoin }) => {
  const [announcement, setAnnouncement] = useState<ClubAnnouncement>(() => getStoredAnnouncement());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleDataUpdate = (e: Event) => {
      const customEvent = e as unknown as { detail?: { type?: string } };
      if (!customEvent?.detail || customEvent.detail.type === 'announcement') {
        setAnnouncement(getStoredAnnouncement());
        setDismissed(false);
      }
    };

    window.addEventListener('cipher_data_updated', handleDataUpdate);
    return () => window.removeEventListener('cipher_data_updated', handleDataUpdate);
  }, []);

  if (!announcement || !announcement.enabled || !announcement.text || !announcement.text.trim() || dismissed) {
    return null;
  }

  const handleLinkClick = (url?: string) => {
    if (!url) return;
    playCyberClick();
    if (url === '#join' && onOpenJoin) {
      onOpenJoin();
      return;
    }
    if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id="campus-broadcast-banner"
      className="w-full bg-[#03150a] border-b border-emerald-500/40 text-emerald-200 text-xs px-3 sm:px-4 py-2 font-mono flex items-center justify-between gap-3 shadow-[0_2px_15px_rgba(16,185,129,0.15)] relative z-50 transition-all"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-center sm:justify-start">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/70 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shrink-0 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <Megaphone className="w-3 h-3 text-emerald-400" />
          <span>{announcement.badge || 'BROADCAST'}</span>
        </span>

        <p className="truncate text-[11px] sm:text-xs text-white/95 font-sans font-medium">
          {announcement.text}
        </p>

        {announcement.linkText && (
          <button
            onClick={() => handleLinkClick(announcement.linkUrl)}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white underline font-bold tracking-wide shrink-0 transition-colors cursor-pointer ml-1"
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <button
        onClick={() => {
          playCyberClick();
          setDismissed(true);
        }}
        className="text-emerald-500 hover:text-white p-1 rounded hover:bg-emerald-950/80 transition-colors shrink-0 cursor-pointer"
        title="Dismiss broadcast for current session"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};