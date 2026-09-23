import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { EventItem, EventGalleryImage } from '../../types';
import { playCyberClick, playAccessGranted } from '../../utils/audio';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAdminToken = () =>
  sessionStorage.getItem('cipher_admin_token') ||
  localStorage.getItem('cipher_admin_token');

export const EventsTab: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('FLAGSHIP');
  const [dateStr, setDateStr] = useState('March 20, 2026');
  const [isoDate, setIsoDate] = useState('2026-03-20');
  const [venue, setVenue] = useState(
    'Ground Floor Seminar Hall, Academic Block-3'
  );
  const [theme, setTheme] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [narrativeText, setNarrativeText] = useState('');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [highlightsText, setHighlightsText] = useState('');

  const fetchEvents = async () => {
    const token = getAdminToken();

    if (!token) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/admin/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    playCyberClick();

    setEditingEventId(null);
    setTitle('');
    setBadge('FLAGSHIP');
    setDateStr('April 15, 2026');
    setIsoDate('2026-04-15');
    setVenue('Campus Computer Center / Lab 4');
    setTheme('Intelligent Agents & Distributed Systems');
    setShortSummary(
      'Hands-on technical sprint on autonomous systems, distributed state, and modern software design.'
    );
    setNarrativeText(
      'Participants engaged in deep architectural challenges, deploying real-time services and competing across multiple rounds.\n\nTeams presented robust prototypes evaluated by industry engineers and faculty coordinators.'
    );
    setGalleryUrls(
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200, Opening Keynote\nhttps://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200, Sprint Huddle'
    );
    setHighlightsText(
      '50+ Participating Teams\nRs. 15,000 Total Prize Pool\nIndustry Mentors from Top Tech Firms'
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    playCyberClick();

    setEditingEventId(evt.id);
    setTitle(evt.title);
    setBadge(evt.badge);
    setDateStr(evt.dateStr);
    setIsoDate(evt.isoDate);
    setVenue(evt.venue);
    setTheme(evt.theme || '');
    setShortSummary(evt.shortSummary);

    setNarrativeText((evt.fullNarrative || []).join('\n\n'));

    setGalleryUrls(
      (evt.galleryImages || [])
        .map((img) => `${img.url}, ${img.caption}`)
        .join('\n')
    );

    setHighlightsText((evt.highlights || []).join('\n'));

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, eventTitle: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete event "${eventTitle}"?`
      )
    ) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      window.alert('Admin authentication required.');
      return;
    }

    try {
      playCyberClick();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/events/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || 'Failed to delete event'
        );
      }

      await fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);

      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete event'
      );
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !shortSummary.trim()) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      window.alert('Admin authentication required.');
      return;
    }

    playAccessGranted();

    // Parse narrative into paragraphs
    const fullNarrative = narrativeText
      .split(/\n\s*\n|\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Parse highlights
    const highlights = highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    // Parse gallery URLs and captions
    const galleryImages: EventGalleryImage[] = galleryUrls
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => {
        const commaIndex = line.indexOf(',');

        if (commaIndex === -1) {
          return {
            url: line,
            caption: `Event Highlight ${idx + 1}`,
          };
        }

        const url = line.slice(0, commaIndex).trim();
        const caption =
          line.slice(commaIndex + 1).trim() ||
          `Event Highlight ${idx + 1}`;

        return {
          url,
          caption,
        };
      });

    const existing = editingEventId
      ? events.find((event) => event.id === editingEventId)
      : undefined;

    const payload = {
      badge: badge.trim().toUpperCase(),
      dateStr: dateStr.trim(),
      isoDate: isoDate.trim(),
      venue: venue.trim(),
      title: title.trim(),
      theme: theme.trim() || undefined,
      shortSummary: shortSummary.trim(),
      fullNarrative,
      galleryImages:
        galleryImages.length > 0
          ? galleryImages
          : existing?.galleryImages || [
              {
                url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
                caption: 'Event Keynote Session',
              },
            ],
      highlights,
      tracks: existing?.tracks || [],
    };

    try {
      const url = editingEventId
        ? `${API_BASE_URL}/api/admin/events/${editingEventId}`
        : `${API_BASE_URL}/api/admin/events`;

      const response = await fetch(url, {
        method: editingEventId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || 'Failed to save event'
        );
      }

      setIsModalOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);

      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to save event'
      );
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Bar */}
      <div className="rounded-xl border border-emerald-900/90 bg-[#061109]/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#041d0e] border border-emerald-500/80 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              EVENTS &amp; SUMMITS ARCHIVE
            </h2>

            <p className="text-xs text-emerald-500/90 font-sans mt-0.5">
              Manage hackathons, symposiums, branch galas, and technical
              workshops displayed on the public site.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ ADD EVENT</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="rounded-xl border border-emerald-900/80 bg-[#050c07] p-8 text-center text-sm text-emerald-400">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border border-emerald-900/80 bg-[#050c07] p-8 text-center">
          <p className="text-sm text-emerald-400">
            No events found.
          </p>

          <p className="text-xs text-emerald-600 mt-2">
            Add your first event using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => {
            const mainImage =
              evt.galleryImages?.[0]?.url ||
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200';

            return (
              <div
                key={evt.id}
                className="rounded-xl border border-emerald-900/80 bg-[#050c07] overflow-hidden flex flex-col justify-between shadow-md hover:border-emerald-600/80 transition-all group"
              >
                {/* Event Top Banner Image */}
                <div className="relative h-44 w-full bg-[#030604] overflow-hidden">
                  <img
                    src={mainImage}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050c07] via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/85 border border-emerald-500/80 text-[10px] font-bold uppercase tracking-wider text-emerald-300 shadow">
                      {evt.badge}
                    </span>

                    {evt.galleryImages?.length > 0 && (
                      <span className="px-2 py-1 rounded-md bg-black/75 border border-emerald-900 text-[10px] text-emerald-400 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{evt.galleryImages.length} photos</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-xs text-emerald-300 font-mono flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{evt.dateStr}</span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {evt.title}
                    </h3>

                    {evt.theme && (
                      <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                        Theme: {evt.theme}
                      </div>
                    )}

                    <div className="mt-2 text-xs text-emerald-500 font-sans flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    <p className="mt-2.5 text-xs text-emerald-300/80 font-sans line-clamp-2 leading-relaxed">
                      {evt.shortSummary}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between">
                    <div className="text-[11px] text-emerald-600 font-mono">
                      ID: {evt.id}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 hover:text-white hover:border-emerald-500 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(evt.id, evt.title)
                        }
                        className="p-1.5 rounded bg-red-950/40 border border-red-900/60 text-red-400 hover:text-red-200 hover:border-red-500 transition-all cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-[#060e08] border-2 border-emerald-500/80 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)] font-mono text-emerald-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-500 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-emerald-900/80 pb-3 mb-4">
              <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">
                // EVENT ARCHITECT
              </div>

              <h3 className="text-xl font-bold text-white mt-1">
                {editingEventId
                  ? 'Edit Event Details'
                  : 'Create New CIPHER Event'}
              </h3>
            </div>

            <form
              onSubmit={handleSaveSubmit}
              className="space-y-4 text-xs font-mono"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                    EVENT TITLE *
                  </label>

                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Prompt Ops-2K26"
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                    CATEGORY BADGE
                  </label>

                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="FLAGSHIP / CTF / WORKSHOP"
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                    DISPLAY DATE *
                  </label>

                  <input
                    type="text"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    placeholder="e.g. March 20, 2026"
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                    ISO DATE (FOR SORTING)
                  </label>

                  <input
                    type="date"
                    value={isoDate}
                    onChange={(e) => setIsoDate(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                    CAMPUS VENUE *
                  </label>

                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Ground Floor Seminar Hall, Academic Block-3"
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                    THEME (OPTIONAL)
                  </label>

                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Agentic Systems & Neural Reasoning"
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                  SHORT SUMMARY (CARD PREVIEW) *
                </label>

                <textarea
                  rows={2}
                  required
                  value={shortSummary}
                  onChange={(e) => setShortSummary(e.target.value)}
                  placeholder="One or two punchy sentences describing what the event is about..."
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                  FULL EVENT NARRATIVE (SEPARATE PARAGRAPHS WITH DOUBLE NEWLINE)
                </label>

                <textarea
                  rows={4}
                  value={narrativeText}
                  onChange={(e) => setNarrativeText(e.target.value)}
                  placeholder="Detailed report of the competition rounds, student enthusiasm, faculty presence, keynote talks..."
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                  GALLERY IMAGES (ONE PER LINE: JPEG, SVG, OR PNG URL, CAPTION)
                </label>

                <textarea
                  rows={3}
                  value={galleryUrls}
                  onChange={(e) => setGalleryUrls(e.target.value)}
                  placeholder={`https://.../photo.jpeg, Keynote Address
https://.../photo.png, Coding Sprint
https://.../badge.svg, Trophy Ceremony`}
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 font-bold mb-1">
                  HIGHLIGHT BULLETS (ONE PER LINE)
                </label>

                <textarea
                  rows={2}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder={`50+ Participating Teams
Rs. 15,000 Prize Pool
Hands-on Cloud Infrastructure`}
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-emerald-100 font-sans"
                />
              </div>

              <div className="pt-3 border-t border-emerald-900/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-emerald-900 text-emerald-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};