import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Trophy,
  Sparkles,
  ArrowRight,
  Search,
  ArrowUpRight,
  User,
  Tag,
  BookOpen,
} from 'lucide-react';
import { EVENTS, ARCHIVE_ITEMS } from '../data/cipherData';
import { EventItem, ArchiveItem } from '../types';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick } from '../utils/audio';

export const EventsSection: React.FC = () => {
  const headingText = useScrambleText('Events & Workshops', true, 750, 12);
  const archiveHeadingText = useScrambleText('Activities', true, 700, 10);

  // Event Gallery Modal State
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  // Archive Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArchiveItem, setActiveArchiveItem] = useState<ArchiveItem | null>(null);

  const categories = ['ALL', 'AI & ML', 'Development', 'Tools & Systems', 'Industry & Career', 'Academic & Grants'];

  const filteredArchiveItems = useMemo(() => {
    return ARCHIVE_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openGallery = (event: EventItem) => {
    playCyberClick();
    setActiveModalEvent(event);
    setCurrentPhotoIdx(0);
  };

  const nextPhoto = () => {
    if (!activeModalEvent) return;
    playCyberClick();
    setCurrentPhotoIdx((prev) => (prev + 1) % activeModalEvent.galleryImages.length);
  };

  const prevPhoto = () => {
    if (!activeModalEvent) return;
    playCyberClick();
    setCurrentPhotoIdx((prev) =>
      prev === 0 ? activeModalEvent.galleryImages.length - 1 : prev - 1
    );
  };

  return (
    <section id="events" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#050806] border-t border-emerald-950/60 overflow-hidden font-mono">
      {/* Background cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 1. Flagship Events Header */}
        <div className="mb-14">
          <div className="text-xs font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2">
            <span className="text-emerald-400 font-bold">//</span>
            <span>FLAGSHIP INITIATIVES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2">
            {headingText}
          </h2>
          <p className="mt-2 text-sm text-emerald-400/80 font-sans max-w-xl">
            Signature summits, department galas, competitive hackathons, and AI tool showcases orchestrated by CIPHER.
          </p>
        </div>

        {/* 2 Flagship Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
          {EVENTS.map((item) => (
            <div
              key={item.id}
              className="group relative p-6 sm:p-8 bg-[#06100a] border border-emerald-900/60 hover:border-emerald-500/80 rounded-xl transition-all duration-300 shadow-xl shadow-black/60 flex flex-col justify-between"
            >
              <div>
                {/* Badges Row */}
                <div className="flex items-center justify-between gap-2 mb-4 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-800 text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    {item.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#040805] border border-emerald-900/80 text-emerald-500 font-mono">
                    {item.dateStr}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>

                {/* Location & Theme */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-emerald-500/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {item.venue}
                  </span>
                  {item.theme && (
                    <span className="italic text-emerald-300/80">&ldquo;{item.theme}&rdquo;</span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-emerald-400/80 font-sans leading-relaxed">
                  {item.shortSummary}
                </p>
              </div>

              {/* View Gallery Action */}
              <div className="mt-8 pt-4 border-t border-emerald-950 flex items-center justify-between">
                <button
                  onClick={() => openGallery(item)}
                  className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-200 flex items-center gap-1.5 transition-colors group-hover:underline"
                >
                  <span>VIEW GALLERY</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-[11px] text-emerald-600 font-mono">
                  {item.galleryImages.length} PHOTO ASSETS
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Anchor point for #archive */}
        <div id="archive" className="relative -top-24" />

        {/* 2. Technical Activities Archive Sub-Section */}
        <div className="mt-28 pt-20 border-t border-emerald-950/70">
          {/* Sub-Section Header */}
          <div className="mb-10">
            <div className="text-xs font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2">
              <span className="text-emerald-400 font-bold">//</span>
              <span>ARCHIVE</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2 flex flex-wrap items-center gap-3">
              <span>{archiveHeadingText}</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded">
                17+ SESSIONS DOCUMENTED
              </span>
            </h3>
            <p className="mt-2 text-sm text-emerald-400/80 font-sans max-w-2xl leading-relaxed">
              Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.
            </p>
          </div>

          {/* Filter and Search Bar */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
            {/* Search box */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 17+ technical activities..."
                className="w-full pl-10 pr-4 py-2 bg-[#07130b] border border-emerald-900/80 rounded-lg text-emerald-200 placeholder-emerald-700 focus:outline-none focus:border-emerald-500 transition-colors"
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

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playCyberClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded text-[11px] font-semibold tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : 'bg-[#07130b] text-emerald-400/80 border border-emerald-900/60 hover:text-emerald-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Activities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {filteredArchiveItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playCyberClick();
                  setActiveArchiveItem(item);
                }}
                className="group relative p-4 sm:p-5 bg-[#07120a]/80 hover:bg-[#09170d] border border-emerald-900/50 hover:border-emerald-500/80 rounded-lg transition-all duration-200 cursor-pointer shadow-md hover:shadow-emerald-950/40 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded shrink-0">
                    {item.num}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-emerald-100 group-hover:text-emerald-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-sans truncate mt-0.5">
                      {item.tags.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="w-6 h-6 rounded bg-emerald-950/40 border border-emerald-900 flex items-center justify-center text-emerald-500 group-hover:text-emerald-300 group-hover:border-emerald-500 shrink-0 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {filteredArchiveItems.length === 0 && (
            <div className="text-center py-12 text-emerald-600 font-mono text-xs">
              &gt; NO ARCHIVED SESSIONS MATCHING QUERY &quot;{searchQuery}&quot;
            </div>
          )}
        </div>
      </div>

      {/* Flagship Event HUD Photo Carousel Modal */}
      <AnimatePresence>
        {activeModalEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-4xl w-full bg-[#07110a] border-2 border-emerald-500/80 rounded-xl p-4 sm:p-6 shadow-2xl shadow-emerald-950 font-mono text-emerald-100 overflow-hidden"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    FLAGSHIP EVENT DOSSIER // {activeModalEvent.title}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="p-1.5 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Two-Column Dossier Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
                {/* Left Column: Event Context & Stats */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-block px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-xs text-emerald-300 font-bold">
                    {activeModalEvent.badge}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {activeModalEvent.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-emerald-400 font-mono bg-[#050b07] p-3 rounded border border-emerald-900/60">
                    <div>DATE: {activeModalEvent.dateStr}</div>
                    <div>VENUE: {activeModalEvent.venue}</div>
                    {activeModalEvent.theme && (
                      <div>THEME: &ldquo;{activeModalEvent.theme}&rdquo;</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {activeModalEvent.fullNarrative.map((p, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-emerald-300/80 font-sans leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>

                  {activeModalEvent.highlights && (
                    <div className="pt-2">
                      <div className="text-xs uppercase text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Key Milestones &amp; Highlights:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-emerald-200/90 font-sans">
                        {activeModalEvent.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-400">▹</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column: Retro HUD Photo Carousel */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="w-full bg-[#050b07] border-2 border-emerald-600/70 rounded-xl p-3 sm:p-4 shadow-xl shadow-emerald-950/60">
                    {/* HUD Top Bar */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-900/80 text-[10px] sm:text-xs text-emerald-500 font-mono">
                      <span>[{activeModalEvent.galleryImages[currentPhotoIdx]?.tag || 'ASSET_FRAME'}]</span>
                      <span className="text-emerald-300 font-bold">
                        {String(currentPhotoIdx + 1).padStart(2, '0')} / {String(activeModalEvent.galleryImages.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Frame Image */}
                    <div className="relative aspect-[4/3] w-full bg-black rounded-lg overflow-hidden border border-emerald-900/50">
                      <img
                        src={activeModalEvent.galleryImages[currentPhotoIdx]?.url}
                        alt={activeModalEvent.galleryImages[currentPhotoIdx]?.caption}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />

                      {/* Photo Badge overlay */}
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 border border-emerald-800/80 rounded text-[10px] text-emerald-400 font-mono">
                        {activeModalEvent.dateStr}
                      </div>
                    </div>

                    {/* Image Caption & Venue */}
                    <div className="mt-3 text-center px-2">
                      <div className="text-xs font-bold text-white">
                        {activeModalEvent.title}
                      </div>
                      <div className="text-[11px] text-emerald-400/80 font-sans mt-0.5">
                        {activeModalEvent.galleryImages[currentPhotoIdx]?.caption}
                      </div>
                    </div>

                    {/* Carousel Controls */}
                    <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between">
                      <button
                        onClick={prevPhoto}
                        className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:text-white hover:border-emerald-500 transition-colors"
                        title="Previous Asset"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-bold text-emerald-300">
                          {String(currentPhotoIdx + 1).padStart(2, '0')} / {String(activeModalEvent.galleryImages.length).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-600">
                          SWIPE TO EXPLORE &gt;
                        </span>
                      </div>

                      <button
                        onClick={nextPhoto}
                        className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 hover:text-white hover:border-emerald-500 transition-colors"
                        title="Next Asset"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      {activeModalEvent.galleryImages.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => {
                            playCyberClick();
                            setCurrentPhotoIdx(dotIdx);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            dotIdx === currentPhotoIdx
                              ? 'w-4 bg-emerald-400 shadow-[0_0_6px_#22c55e]'
                              : 'bg-emerald-900 hover:bg-emerald-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {activeArchiveItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-lg w-full bg-[#07120a] border border-emerald-500/80 rounded-xl p-6 shadow-2xl shadow-emerald-950 text-emerald-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold">
                    SESSION {activeArchiveItem.num}
                  </span>
                  <span className="text-emerald-600">{activeArchiveItem.category}</span>
                </div>
                <button
                  onClick={() => setActiveArchiveItem(null)}
                  className="p-1 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-xl font-bold text-white">{activeArchiveItem.title}</h4>

                <div className="flex items-center gap-4 text-xs text-emerald-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {activeArchiveItem.year}
                  </span>
                  {activeArchiveItem.leadSpeaker && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> {activeArchiveItem.leadSpeaker}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-emerald-300/80 font-sans leading-relaxed">
                  {activeArchiveItem.description}
                </p>

                <div className="mt-5 pt-4 border-t border-emerald-950">
                  <div className="text-xs uppercase text-emerald-500 mb-2 font-semibold">
                    Core Competencies &amp; Tags:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeArchiveItem.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-1 rounded bg-[#050b07] border border-emerald-900 text-emerald-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-900/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700">ARCHIVE RECORD ID: CIPHER_{activeArchiveItem.num}</span>
                  <button
                    onClick={() => setActiveArchiveItem(null)}
                    className="px-4 py-1.5 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
