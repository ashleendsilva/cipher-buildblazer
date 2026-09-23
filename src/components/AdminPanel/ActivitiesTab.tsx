import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Link,
  BookOpen,
} from 'lucide-react';
import { playCyberClick } from '../../utils/audio';

interface Activity {
  id: string;
  name: string;
  url: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  'ALL',
  'AI & ML',
  'Development',
  'Tools & Systems',
  'Industry & Career',
  'Academic & Grants',
];

const getAdminToken = () => {
  if (typeof window === 'undefined') return null;

  return (
    sessionStorage.getItem('cipher_admin_token') ||
    localStorage.getItem('cipher_admin_token')
  );
};

export const ActivitiesTab: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<Activity | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Development');

  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);

    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3000);
  };

  // ------------------------------------------------------------
  // LOAD ACTIVITIES FROM BACKEND
  // ------------------------------------------------------------

  const loadActivities = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/activities`);

      if (!response.ok) {
        throw new Error('Failed to load activities');
      }

      const data = await response.json();

      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
      showToast('Failed to load activities from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  // ------------------------------------------------------------
  // FILTERING
  // ------------------------------------------------------------

  const filteredActivities = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return activities.filter((act) => {
      const matchesCategory =
        categoryFilter === 'ALL' || act.category === categoryFilter;

      const matchesSearch =
        !query ||
        act.name.toLowerCase().includes(query) ||
        act.url.toLowerCase().includes(query) ||
        act.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activities, categoryFilter, searchQuery]);

  // ------------------------------------------------------------
  // OPEN EDIT MODAL
  // ------------------------------------------------------------

  const handleOpenEdit = (item: Activity) => {
    playCyberClick();

    setEditingItem(item);
    setEditTitle(item.name);
    setEditUrl(item.url || '');
  };

  // ------------------------------------------------------------
  // SAVE EDIT
  // ------------------------------------------------------------

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem) return;

    if (!editTitle.trim()) {
      alert('Activity title cannot be empty.');
      return;
    }

    if (!editUrl.trim()) {
      alert('Destination URL cannot be empty.');
      return;
    }

    const token = getAdminToken();

    if (!token) {
      alert('Admin authentication has expired. Please log in again.');
      return;
    }

    try {
      setSaving(true);
      playCyberClick();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/activities/${editingItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editTitle.trim(),
            url: editUrl.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update activity');
      }

      setActivities((current) =>
        current.map((activity) =>
          activity.id === editingItem.id ? data : activity
        )
      );

      setEditingItem(null);
      setEditTitle('');
      setEditUrl('');

      showToast(`Activity "${editTitle.trim()}" updated successfully!`);
    } catch (error) {
      console.error('Failed to update activity:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update activity.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // CREATE ACTIVITY
  // ------------------------------------------------------------

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      alert('Please enter an activity title.');
      return;
    }

    if (!newUrl.trim()) {
      alert('Please enter a destination URL.');
      return;
    }

    const token = getAdminToken();

    if (!token) {
      alert('Admin authentication has expired. Please log in again.');
      return;
    }

    try {
      setSaving(true);
      playCyberClick();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/activities`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newTitle.trim(),
            url: newUrl.trim(),
            category: newCategory,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create activity');
      }

      setActivities((current) => [...current, data]);

      const createdTitle = newTitle.trim();

      setIsAddOpen(false);
      setNewTitle('');
      setNewUrl('');
      setNewCategory('Development');

      showToast(`New activity "${createdTitle}" added successfully!`);
    } catch (error) {
      console.error('Failed to create activity:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create activity.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------------------
  // DELETE ACTIVITY
  // ------------------------------------------------------------

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete activity "${title}"?`)) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      alert('Admin authentication has expired. Please log in again.');
      return;
    }

    try {
      playCyberClick();

      const response = await fetch(
        `${API_BASE_URL}/api/admin/activities/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete activity');
      }

      setActivities((current) =>
        current.filter((activity) => activity.id !== id)
      );

      showToast(`Deleted activity "${title}".`);
    } catch (error) {
      console.error('Failed to delete activity:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete activity.'
      );
    }
  };

  // ------------------------------------------------------------
  // REFRESH ACTIVITIES
  // ------------------------------------------------------------

  const handleRefresh = async () => {
    playCyberClick();
    await loadActivities();
    showToast('Activities refreshed from backend.');
  };

  return (
    <div className="space-y-6 font-mono text-emerald-100">
      {/* Toast notification banner */}
      {notification && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-300 rounded-lg flex items-center justify-between text-xs shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>

          <button
            onClick={() => setNotification(null)}
            className="text-emerald-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-6 bg-[#061009] border border-emerald-900/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-500 uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>ACTIVITIES // CURRICULUM ARCHIVE</span>
          </div>

          <h2 className="text-2xl font-bold text-white mt-1">
            Activities &amp; Workshops
          </h2>

          <p className="text-xs text-emerald-400/80 font-sans mt-0.5 max-w-xl">
            Manage student activities, documentation sessions, and external
            link destinations. Clicking an activity on the public site opens
            its linked webpage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              playCyberClick();
              setIsAddOpen(true);
            }}
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>ADD ACTIVITY</span>
          </button>

          <button
            onClick={handleRefresh}
            title="Refresh activities"
            disabled={loading}
            className="p-2 bg-[#08150c] border border-emerald-900/80 hover:border-emerald-700 text-emerald-500 hover:text-emerald-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities by title, URL, or category..."
            className="w-full pl-10 pr-4 py-2 bg-[#050b07] border border-emerald-900/80 rounded-lg text-emerald-200 placeholder-emerald-700 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playCyberClick();
                setCategoryFilter(cat);
              }}
              className={`px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                  : 'bg-[#061009] text-emerald-400/80 border border-emerald-900/60 hover:text-emerald-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Table / Grid */}
      <div className="bg-[#061009] border border-emerald-900/80 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#040a06] border-b border-emerald-950 flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            PUBLISHED ACTIVITIES ({filteredActivities.length})
          </span>

          <span className="text-[11px] text-emerald-600">
            CLICK &quot;EDIT&quot; TO UPDATE TITLE &amp; TARGET URL
          </span>
        </div>

        <div className="divide-y divide-emerald-950/80">
          {loading ? (
            <div className="p-12 text-center text-emerald-600 font-mono text-xs">
              &gt; LOADING ACTIVITIES FROM BACKEND...
            </div>
          ) : (
            <>
              {filteredActivities.map((act, index) => (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 hover:bg-[#08150c]/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  {/* Left Column */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <span className="px-2 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {act.name}
                        </h3>

                        <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 border border-emerald-900 text-emerald-500 font-mono">
                          {act.category}
                        </span>
                      </div>

                      {/* External URL */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        {act.url ? (
                          <a
                            href={act.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-200 hover:underline max-w-md truncate"
                          >
                            <Link className="w-3 h-3 shrink-0 text-emerald-500" />
                            <span className="truncate">{act.url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-emerald-700 italic text-[11px]">
                            No external link configured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {act.url && (
                      <a
                        href={act.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded bg-emerald-950/60 border border-emerald-900 hover:border-emerald-500 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                        title="Open external webpage in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleOpenEdit(act)}
                      className="px-3 py-1.5 rounded bg-[#0a1b10] border border-emerald-700/80 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>EDIT</span>
                    </button>

                    <button
                      onClick={() => handleDelete(act.id, act.name)}
                      className="p-2 rounded bg-[#0a130c] border border-rose-950/80 hover:border-rose-700 text-rose-500 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredActivities.length === 0 && (
                <div className="p-12 text-center text-emerald-600 font-mono text-xs">
                  &gt; NO ACTIVITIES FOUND MATCHING FILTER CRITERIA
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ============================================================
          EDIT MODAL
      ============================================================ */}
      {editingItem && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingItem(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono"
        >
          <div className="max-w-lg w-full bg-[#06120a] border-2 border-emerald-500 rounded-xl p-6 shadow-2xl text-emerald-100 relative animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />

                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  EDIT ACTIVITY
                </h3>
              </div>

              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-xs text-emerald-400/80 font-sans">
              Update the activity title and target webpage URL.
            </p>

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1.5">
                  Activity Title:
                </label>

                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Masterclass in Quantum Computing"
                  className="w-full px-3.5 py-2.5 bg-[#030805] border border-emerald-800 rounded-lg text-emerald-100 font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1.5">
                  Destination Webpage URL:
                </label>

                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />

                  <input
                    type="url"
                    required
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://example.com/workshop"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#030805] border border-emerald-800 rounded-lg text-emerald-100 font-mono text-xs focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-emerald-950 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-black/60 border border-emerald-900 text-emerald-400 hover:text-white text-xs cursor-pointer font-bold disabled:opacity-50"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black text-xs font-bold tracking-wider cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          ADD MODAL
      ============================================================ */}
      {isAddOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono"
        >
          <div className="max-w-lg w-full bg-[#06120a] border-2 border-emerald-500 rounded-xl p-6 shadow-2xl text-emerald-100 relative animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />

                <h3 className="text-base font-bold text-white uppercase tracking-wider">
                  CREATE NEW ACTIVITY
                </h3>
              </div>

              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="mt-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1.5">
                  Activity Title:
                </label>

                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. NextJS 15 Deep Dive & Edge Functions"
                  className="w-full px-3.5 py-2.5 bg-[#030805] border border-emerald-800 rounded-lg text-emerald-100 font-mono text-sm focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1.5 flex items-center justify-between">
                  <span>Destination Webpage URL:</span>
                  <span className="text-[10px] text-emerald-600 font-normal">
                    OPENS ON CLICK
                  </span>
                </label>

                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />

                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://docs.cipher.sjec.ac.in/workshop"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#030805] border border-emerald-800 rounded-lg text-emerald-100 font-mono text-xs focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1.5">
                  Curriculum Category:
                </label>

                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#030805] border border-emerald-800 rounded-lg text-emerald-100 font-mono text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                >
                  <option value="Development">Development</option>
                  <option value="AI & ML">AI &amp; ML</option>
                  <option value="Tools & Systems">
                    Tools &amp; Systems
                  </option>
                  <option value="Industry & Career">
                    Industry &amp; Career
                  </option>
                  <option value="Academic & Grants">
                    Academic &amp; Grants
                  </option>
                </select>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-emerald-950 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-black/60 border border-emerald-900 text-emerald-400 hover:text-white text-xs cursor-pointer font-bold disabled:opacity-50"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black text-xs font-bold tracking-wider cursor-pointer shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
                >
                  {saving ? 'PUBLISHING...' : 'PUBLISH ACTIVITY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};