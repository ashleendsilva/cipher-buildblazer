import React, { useEffect, useState } from 'react';
import { ArrowRight, Megaphone, X } from 'lucide-react';
import { ClubAnnouncement } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_ANNOUNCEMENT: ClubAnnouncement = {
  enabled: true,
  text: 'PROMPT OPS-2K26 Winners announced! Join CIPHER recruiting drive open for 2026 cohort.',
  badge: 'ANNOUNCEMENT',
  linkText: 'Join Now',
  linkUrl: '#join',
};

export const AnnouncementBanner: React.FC = () => {
  const [announcement, setAnnouncement] =
    useState<ClubAnnouncement>(DEFAULT_ANNOUNCEMENT);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/announcement`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch announcement');
        }

        const data = await response.json();

        setAnnouncement({
          enabled: Boolean(data.enabled),
          text: data.text || DEFAULT_ANNOUNCEMENT.text,
          badge: data.badge || DEFAULT_ANNOUNCEMENT.badge,
          linkText: data.linkText || '',
          linkUrl: data.linkUrl || '',
        });
      } catch (error) {
        console.error(
          'Failed to load announcement from backend:',
          error
        );

        // Keep the default announcement if the backend is unavailable.
        setAnnouncement(DEFAULT_ANNOUNCEMENT);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!announcement.enabled || !visible) {
    return null;
  }

  const handleActionClick = () => {
    if (!announcement.linkUrl) return;

    if (
      announcement.linkUrl.startsWith('http://') ||
      announcement.linkUrl.startsWith('https://')
    ) {
      window.open(
        announcement.linkUrl,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (announcement.linkUrl.startsWith('#')) {
      const element = document.querySelector(
        announcement.linkUrl
      );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        window.location.hash = announcement.linkUrl.substring(1);
      }

      return;
    }

    window.location.href = announcement.linkUrl;
  };

  return (
    <div className="relative z-50 border-b border-emerald-500/30 bg-[#020804] text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
          <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />

          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider shrink-0">
            {announcement.badge || 'ANNOUNCEMENT'}
          </span>

          <span className="text-emerald-200 font-sans text-[11px] sm:text-xs md:text-sm">
            {announcement.text}
          </span>

          {announcement.linkText && announcement.linkUrl && (
            <button
              type="button"
              onClick={handleActionClick}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-200 font-semibold underline underline-offset-2 text-[11px] sm:text-xs whitespace-nowrap cursor-pointer transition-colors"
            >
              {announcement.linkText}
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setVisible(false)}
            className="ml-1 p-1 text-emerald-600 hover:text-emerald-300 transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};