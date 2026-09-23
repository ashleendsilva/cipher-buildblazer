import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Check, RotateCcw, Eye, ArrowRight } from 'lucide-react';
import { ClubAnnouncement } from '../../types';
import { getStoredAnnouncement, saveStoredAnnouncement } from '../../utils/storage';
import { playAccessGranted, playCyberClick } from '../../utils/audio';

export const AnnouncementTab: React.FC = () => {
  const [announcement, setAnnouncement] = useState<ClubAnnouncement>(() => getStoredAnnouncement());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as unknown as { detail?: { type?: string } };
      if (!customEvent?.detail || customEvent.detail.type === 'announcement') {
        setAnnouncement(getStoredAnnouncement());
      }
    };
    window.addEventListener('cipher_data_updated', handleSync);
    return () => window.removeEventListener('cipher_data_updated', handleSync);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playAccessGranted();
    saveStoredAnnouncement(announcement);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    playCyberClick();
    const defaults: ClubAnnouncement = {
      enabled: true,
      text: 'PROMPT OPS-2K26 Winners announced! Join CIPHER recruiting drive open for 2026 cohort.',
      badge: 'ANNOUNCEMENT',
      linkText: 'Join Now',
      linkUrl: '#join',
    };
    setAnnouncement(defaults);
    saveStoredAnnouncement(defaults);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Bar */}
      <div className="rounded-xl border border-emerald-900/90 bg-[#061109]/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#041d0e] border border-emerald-500/80 flex items-center justify-center text-emerald-400">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              CAMPUS BROADCAST SYSTEM
            </h2>
            <p className="text-xs text-emerald-500/90 font-sans mt-0.5">
              Configure real-time marquee notices, emergency announcements, competition updates, or recruiting alerts across the site.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-lg border border-emerald-800 bg-[#07190d] hover:bg-emerald-950 text-emerald-300 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
            title="Reset announcement back to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Broadcast</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 rounded-xl bg-[#040805] border border-emerald-950">
        <div className="text-[10px] text-emerald-500 uppercase font-bold mb-2 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>CURRENT LIVE BANNER PREVIEW</span>
        </div>

        {announcement.enabled ? (
          <div className="p-3 rounded-lg bg-[#030a05] border border-emerald-500/40 text-emerald-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold text-[10px] uppercase">
                {announcement.badge || 'ANNOUNCEMENT'}
              </span>
              <span className="text-xs font-sans text-emerald-200">{announcement.text}</span>
              {announcement.linkText && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold underline text-xs">
                  {announcement.linkText} <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-500 font-mono">[ ACTIVE ON PUBLIC SITE ]</span>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-black/60 border border-emerald-950 text-center text-xs text-emerald-700 font-sans">
            Announcement banner is currently disabled and hidden from all public visitors.
          </div>
        )}
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="p-5 rounded-xl bg-[#050c07] border border-emerald-900/80 space-y-4 text-xs font-mono">
        {/* Toggle switch */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-black/60 border border-emerald-950">
          <div>
            <div className="text-sm font-bold text-white">Enable Site Announcement Banner</div>
            <div className="text-xs text-emerald-500 font-sans mt-0.5">
              When toggled ON, the notification strip will be rendered above the site navigation for visitors.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playCyberClick();
              setAnnouncement({ ...announcement, enabled: !announcement.enabled });
            }}
            className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer ${
              announcement.enabled ? 'bg-emerald-500' : 'bg-emerald-950/80 border border-emerald-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full transition-transform absolute top-1 ${
                announcement.enabled ? 'left-8 bg-black' : 'left-1 bg-white'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] text-emerald-400 font-bold mb-1">ANNOUNCEMENT TEXT *</label>
            <input
              type="text"
              required
              value={announcement.text}
              onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
              placeholder="e.g. PROMPT OPS-2K26 Winners announced! Join CIPHER recruiting drive open."
              className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-emerald-400 font-bold mb-1">BADGE PILL LABEL</label>
            <input
              type="text"
              value={announcement.badge}
              onChange={(e) => setAnnouncement({ ...announcement, badge: e.target.value })}
              placeholder="ANNOUNCEMENT / URGENT"
              className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-emerald-400 font-bold mb-1">ACTION LINK TEXT (OPTIONAL)</label>
            <input
              type="text"
              value={announcement.linkText || ''}
              onChange={(e) => setAnnouncement({ ...announcement, linkText: e.target.value })}
              placeholder="e.g. View Results / Register Now"
              className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
            />
          </div>
          <div>
            <label className="block text-[11px] text-emerald-400 font-bold mb-1">ACTION LINK URL (OPTIONAL)</label>
            <input
              type="text"
              value={announcement.linkUrl || ''}
              onChange={(e) => setAnnouncement({ ...announcement, linkUrl: e.target.value })}
              placeholder="e.g. #events or #join or https://..."
              className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-emerald-900/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs text-emerald-600 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Announcement</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer active:scale-95"
          >
            {saved ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Broadcast Saved!' : 'Save Broadcast Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};