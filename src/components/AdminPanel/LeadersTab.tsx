import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  Search,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { Leader } from '../../types';
import { playCyberClick, playAccessGranted } from '../../utils/audio';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAdminToken = () =>
  sessionStorage.getItem('cipher_admin_token') ||
  localStorage.getItem('cipher_admin_token');

export const LeadersTab: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('President');
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] =
    useState<'executive' | 'faculty' | 'core'>('core');

  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeaders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/team`);

      if (!response.ok) {
        throw new Error('Failed to fetch leadership roster');
      }

      const data = await response.json();

      setLeaders(data);
    } catch (error) {
      console.error('Failed to load leadership roster:', error);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleOpenAdd = () => {
    playCyberClick();

    setEditingLeaderId(null);
    setName('');
    setRole('CORE TECHNICAL LEAD');
    setCategory('core');
    setImage('');
    setBio('');
    setGithub('');
    setLinkedin('');
    setEmail('');
    setUploadError(null);
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (leader: Leader) => {
    playCyberClick();

    setEditingLeaderId(leader.id);
    setName(leader.name);
    setRole(leader.role);
    setCategory(
      leader.category === 'executive' ||
        leader.category === 'faculty' ||
        leader.category === 'core'
        ? leader.category
        : 'core'
    );
    setImage(leader.image || '');
    setBio(leader.bio || '');
    setGithub(leader.github || '');
    setLinkedin(leader.linkedin || '');
    setEmail(leader.email || '');
    setUploadError(null);
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, leaderName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${leaderName} from the leadership roster?`
      )
    ) {
      return;
    }

    playCyberClick();

    try {
      const token = getAdminToken();

      if (!token) {
        alert('Admin authentication expired. Please log in again.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/team/${id}`,
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
          data?.error || 'Failed to delete leadership member'
        );
      }

      await fetchLeaders();
    } catch (error) {
      console.error('Failed to delete leader:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete leadership member.'
      );
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Reload the leadership roster from the database?'
      )
    ) {
      return;
    }

    playCyberClick();

    await fetchLeaders();
  };

  // Image format validator
  const isImageFormatValid = (urlOrStr: string): boolean => {
    if (!urlOrStr.trim()) return false;

    const clean = urlOrStr.trim().toLowerCase();

    if (
      clean.startsWith('data:image/jpeg') ||
      clean.startsWith('data:image/jpg') ||
      clean.startsWith('data:image/png') ||
      clean.startsWith('data:image/svg+xml')
    ) {
      return true;
    }

    const path = clean.split('?')[0].split('#')[0];

    return (
      path.endsWith('.jpeg') ||
      path.endsWith('.jpg') ||
      path.endsWith('.svg') ||
      path.endsWith('.png') ||
      clean.includes('format=jpg') ||
      clean.includes('format=jpeg') ||
      clean.includes('format=png') ||
      clean.includes('format=svg')
    );
  };

  // Image file upload
  const handleImageFile = (file: File) => {
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();

    const isAllowed =
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.type === 'image/svg+xml' ||
      ['jpg', 'jpeg', 'png', 'svg'].includes(ext || '');

    if (!isAllowed) {
      setUploadError(
        'Invalid format. Use JPEG (.jpg/.jpeg), SVG (.svg), or PNG (.png).'
      );
      return;
    }

    // Prevent extremely large uploads
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5 MB.');
      return;
    }

    setUploadError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      if (!dataUrl) return;

      // Keep SVG as-is
      if (file.type === 'image/svg+xml' || ext === 'svg') {
        setImage(dataUrl);
        return;
      }

      const img = new Image();

      img.onload = () => {
        const maxWidth = 500;
        const maxHeight = 650;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          const format =
            file.type === 'image/png'
              ? 'image/png'
              : 'image/jpeg';

          const compressedDataUrl = canvas.toDataURL(
            format,
            0.88
          );

          setImage(compressedDataUrl);
        } else {
          setImage(dataUrl);
        }
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !role.trim()) {
      return;
    }

    const trimmedImg = image.trim();

    if (!trimmedImg) {
      setUploadError('Portrait image is required.');
      return;
    }

    if (!isImageFormatValid(trimmedImg)) {
      setUploadError(
        'Image must be JPEG (.jpg/.jpeg), SVG (.svg), or PNG (.png).'
      );
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setUploadError(
        'Admin authentication expired. Please log in again.'
      );
      return;
    }

    playAccessGranted();

    try {
      const leaderData = {
        name: name.trim(),
        role: role.trim().toUpperCase(),
        category,
        image: trimmedImg,
        bio: bio.trim(),
        github: github.trim() || undefined,
        linkedin: linkedin.trim() || undefined,
        email: email.trim() || undefined,
        contributions: [],
      };

      const url = editingLeaderId
        ? `${API_BASE_URL}/api/admin/team/${editingLeaderId}`
        : `${API_BASE_URL}/api/admin/team`;

      const method = editingLeaderId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(leaderData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Failed to ${editingLeaderId ? 'update' : 'create'} leader`
        );
      }

      await fetchLeaders();

      setIsModalOpen(false);

      setEditingLeaderId(null);
      setName('');
      setRole('CORE TECHNICAL LEAD');
      setCategory('core');
      setImage('');
      setBio('');
      setGithub('');
      setLinkedin('');
      setEmail('');
      setUploadError(null);
    } catch (error) {
      console.error('Failed to save leader:', error);

      setUploadError(
        error instanceof Error
          ? error.message
          : 'Failed to save leadership member.'
      );
    }
  };

  const filteredLeaders = leaders.filter((leader) => {
    const q = search.toLowerCase();

    return (
      leader.name.toLowerCase().includes(q) ||
      leader.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 font-mono">
      {/* Header */}
      <div className="rounded-xl border border-emerald-900/90 bg-[#061109]/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#041d0e] border border-emerald-500/80 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              LEADERSHIP STRUCTURE ROSTER
            </h2>

            <p className="text-xs text-emerald-500/90 font-sans mt-0.5">
              Manage office bearers, mentors, and core committee coordinators.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-1.5 rounded-lg border border-emerald-800 bg-[#07190d] hover:bg-emerald-950 text-emerald-300 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh Roster</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer font-sans shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+ ADD LEADER</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leaders by student name or designation / role..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#040c07] border border-emerald-900/80 focus:border-emerald-400 text-xs text-emerald-100 placeholder-emerald-700/80 font-mono tracking-wide"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeaders.map((leader) => (
          <div
            key={leader.id}
            className="rounded-xl border border-emerald-950/80 bg-[#06120a] p-4 flex flex-col justify-between hover:border-emerald-500/60 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-16 rounded-lg overflow-hidden bg-emerald-950 border border-emerald-800/80 shrink-0">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">
                  {leader.name}
                </h3>

                <div className="text-[11px] font-bold text-emerald-400 uppercase font-mono tracking-wide mt-0.5">
                  {leader.role}
                </div>

                {leader.bio && (
                  <p className="text-[11px] text-emerald-500/90 font-sans mt-1 line-clamp-2 leading-tight">
                    {leader.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-emerald-950/80">
              <button
                onClick={() => handleOpenEdit(leader)}
                className="px-3 py-1 rounded bg-[#071f11] hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-1 transition-all cursor-pointer font-sans"
              >
                <Edit2 className="w-3 h-3 text-emerald-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() =>
                  handleDelete(leader.id, leader.name)
                }
                className="px-3 py-1 rounded bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/60 text-rose-400 hover:text-rose-200 text-xs flex items-center gap-1 transition-all cursor-pointer font-sans"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#061209] border border-emerald-500 rounded-2xl p-6 shadow-2xl font-mono max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />

                <span>
                  {editingLeaderId
                    ? 'EDIT LEADER PROFILE'
                    : 'ADD NEW LEADER'}
                </span>
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-600 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveSubmit}
              className="py-4 space-y-3.5 text-xs"
            >
              {/* Name */}
              <div>
                <label className="text-emerald-400 block mb-1">
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elston Herold Pereira"
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-emerald-400 block mb-1">
                  Role / Designation *
                </label>

                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. PRESIDENT"
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white uppercase"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-emerald-400 block mb-1">
                  Leadership Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as
                        | 'executive'
                        | 'faculty'
                        | 'core'
                    )
                  }
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white"
                >
                  <option value="executive">Executive</option>
                  <option value="faculty">Faculty</option>
                  <option value="core">Core</option>
                </select>
              </div>

              {/* Image */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Portrait Image Upload *</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[10px] text-emerald-500 hover:text-emerald-300 underline font-sans cursor-pointer"
                  >
                    {showUrlInput
                      ? 'Hide URL input'
                      : 'Or paste image URL'}
                  </button>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center gap-4 ${
                    isDragging
                      ? 'border-emerald-400 bg-emerald-950/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'border-emerald-900/90 bg-[#040c06] hover:border-emerald-500/80 hover:bg-[#07170b]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/svg+xml,.jpg,.jpeg,.png,.svg"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-black border border-emerald-800/80 shrink-0 relative group">
                    {image ? (
                      <img
                        src={image}
                        alt="Portrait Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-700">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white transition-opacity font-sans">
                      Change
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Click to upload or drag &amp; drop</span>
                    </div>

                    <p className="text-[11px] text-emerald-600 font-sans mt-0.5">
                      Supported formats:{' '}
                      <strong className="text-emerald-400">
                        JPEG
                      </strong>
                      ,{' '}
                      <strong className="text-emerald-400">
                        SVG
                      </strong>
                      ,{' '}
                      <strong className="text-emerald-400">
                        PNG
                      </strong>
                    </p>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] text-emerald-400 font-sans">
                        Browse Computer
                      </span>
                    </div>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-rose-400 text-[11px] font-sans mt-1">
                    {uploadError}
                  </p>
                )}

                {showUrlInput && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-black/80 border border-emerald-900/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-bold font-mono">
                        Image URL (JPEG, SVG, PNG)
                      </span>

                      {image && (
                        isImageFormatValid(image) ? (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Valid Format
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-mono">
                            Invalid format
                          </span>
                        )
                      )}
                    </div>

                    <input
                      type="url"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);

                        if (uploadError) {
                          setUploadError(null);
                        }
                      }}
                      placeholder="https://.../photo.jpeg"
                      className="w-full px-3 py-1.5 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white font-mono text-[11px]"
                    />

                    <p className="text-[10px] text-emerald-600 font-sans">
                      Enter a direct image URL ending in .jpeg, .jpg,
                      .svg, or .png.
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="text-emerald-400 block mb-1">
                  Biography / Profile Note (Optional)
                </label>

                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter optional bio or student background..."
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white font-sans text-xs resize-none placeholder-emerald-800"
                />
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-emerald-400 block mb-1">
                    LinkedIn URL
                  </label>

                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-emerald-400 block mb-1">
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-emerald-400 block mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="leader@sjec.ac.in"
                  className="w-full px-3 py-2 rounded bg-black border border-emerald-900 focus:border-emerald-400 text-white font-mono text-[11px]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-900/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-emerald-900 text-emerald-400 hover:text-white cursor-pointer font-sans"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold cursor-pointer font-sans"
                >
                  {editingLeaderId
                    ? 'Update Leader'
                    : 'Save Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};