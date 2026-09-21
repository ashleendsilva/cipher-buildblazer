import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
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

  // Fun Image Changing Effect State
  const [funEffect, setFunEffect] = useState<'bounce' | 'flip' | 'glitch' | 'zoom' | 'slide' | 'spin'>('bounce');
  const [funKey, setFunKey] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; label: string }[]>([]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isSwiped, setIsSwiped] = useState(false);

  // Archive Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArchiveItem, setActiveArchiveItem] = useState<ArchiveItem | null>(null);

  const categories = ['ALL', 'AI & ML', 'Development', 'Tools & Systems', 'Industry & Career', 'Academic & Grants'];

  const funVariants: Variants = {
    bounce: {
      scale: [0.88, 1.08, 0.98, 1],
      rotate: [0, -3, 3, 0],
      transition: { duration: 0.45, ease: 'easeOut' }
    },
    flip: {
      rotateY: [0, 90, 0],
      scale: [1, 0.9, 1],
      transition: { duration: 0.5, ease: 'easeInOut' }
    },
    glitch: {
      x: [0, -10, 10, -5, 5, 0],
      y: [0, 3, -3, 2, 0],
      filter: [
        'hue-rotate(0deg) contrast(100%)',
        'hue-rotate(90deg) contrast(150%) brightness(120%)',
        'hue-rotate(-45deg) contrast(125%)',
        'hue-rotate(0deg) contrast(100%)'
      ],
      transition: { duration: 0.4, ease: 'easeInOut' }
    },
    zoom: {
      scale: [1.2, 0.96, 1],
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    slide: {
      x: [50, -6, 0],
      opacity: [0.4, 1, 1],
      transition: { duration: 0.35, ease: 'easeOut' }
    },
    spin: {
      rotate: [0, -18, 12, 0],
      scale: [0.92, 1.05, 1],
      transition: { duration: 0.45, ease: 'easeOut' }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalEvent(null);
        setActiveArchiveItem(null);
      } else if (e.key === 'ArrowRight' && activeModalEvent) {
        nextPhoto();
      } else if (e.key === 'ArrowLeft' && activeModalEvent) {
        prevPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalEvent]);

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
    setParticles([]);
    setFunKey((k) => k + 1);
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

  const triggerFunChange = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (isSwiped) {
      setIsSwiped(false);
      return;
    }
    playCyberClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch {
        // ignore
      }
    }
    const effects: ('bounce' | 'flip' | 'glitch' | 'zoom' | 'slide' | 'spin')[] = [
      'bounce', 'flip', 'glitch', 'zoom', 'slide', 'spin'
    ];
    const nextEffect = effects[Math.floor(Math.random() * effects.length)];
    setFunEffect(nextEffect);
    setFunKey((k) => k + 1);

    if (e && activeModalEvent) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const labels = ['⚡ SHUFFLE!', '✦ GLITCH', '📸 SNAP!', '✨ NEXT', 'DATA_STREAM', '💫 SYNC', '💥 POP!'];
      const randomLabel = labels[Math.floor(Math.random() * labels.length)];
      const id = Date.now() + Math.random();
      setParticles((prev) => [...prev.slice(-5), { id, x, y, label: randomLabel }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 850);
    }

    if (activeModalEvent) {
      setCurrentPhotoIdx((prev) => (prev + 1) % activeModalEvent.galleryImages.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsSwiped(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartX);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY);
    if (diffX > 15 && diffX > diffY) {
      setIsSwiped(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
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
              onClick={() => openGallery(item)}
              className="group relative p-6 sm:p-8 bg-[#06100a] border border-emerald-900/60 hover:border-emerald-500/80 rounded-xl transition-all duration-300 shadow-xl shadow-black/60 flex flex-col justify-between cursor-pointer active:scale-[0.99]"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    openGallery(item);
                  }}
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

      {/* Flagship Event Dossier Modal - Fully Mobile Responsive & Desktop Side-by-Side */}
      <AnimatePresence>
        {activeModalEvent && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                playCyberClick();
                setActiveModalEvent(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-5 lg:p-8 bg-black/92 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full my-auto max-h-[94vh] flex flex-col bg-[#040805] border border-emerald-500/80 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] font-mono text-emerald-100 overflow-hidden"
            >
              {/* Sticky Top Header Bar with Close Button */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-emerald-900/80 bg-[#061009] shrink-0 z-30">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-widest text-emerald-400 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CIPHER // ACTIVITIES</span>
                </div>
                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveModalEvent(null);
                  }}
                  title="Close (ESC)"
                  aria-label="Close"
                  className="p-1.5 sm:p-2 rounded-full bg-black/90 border border-emerald-500 text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-300 transition-all cursor-pointer shadow-lg active:scale-90"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-4 sm:p-6 lg:p-10 overflow-y-auto flex-1 overscroll-contain">
                {/* Mobile Title Block (Above photo for mobile viewers) */}
                <div className="lg:hidden mb-4 sm:mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                    {activeModalEvent.title}
                  </h2>
                  <div className="text-xs font-mono tracking-wider text-emerald-400 font-semibold uppercase mt-1.5 flex flex-wrap items-center gap-2">
                    <span>{activeModalEvent.dateStr}</span>
                    <span className="text-emerald-600 font-bold">·</span>
                    <span>{activeModalEvent.venue.toUpperCase()}</span>
                  </div>
                </div>

                {/* Two-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  {/* Left Column (Desktop: Left Col; Mobile: Below Photo) */}
                  <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
                    {/* Desktop Heading */}
                    <div className="hidden lg:block">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-sans">
                        {activeModalEvent.title}
                      </h2>
                      <div className="text-xs sm:text-sm font-mono tracking-wider text-emerald-400 font-semibold uppercase mt-1 mb-6 flex items-center gap-2">
                        <span>{activeModalEvent.dateStr}</span>
                        <span className="text-emerald-600 font-bold">·</span>
                        <span>{activeModalEvent.venue.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-emerald-300/90 font-mono leading-relaxed">
                      {activeModalEvent.fullNarrative.map((p, idx) => (
                        <p key={idx} className="leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>

                    {activeModalEvent.highlights && (
                      <div className="pt-4 border-t border-emerald-950/80 mt-6">
                        <div className="text-xs uppercase text-emerald-400 font-bold mb-2.5 flex items-center gap-1.5 font-mono">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Highlights &amp; Milestones:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-emerald-400/80 font-sans">
                          {activeModalEvent.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500">▹</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mobile Close Button */}
                    <div className="pt-6 lg:hidden">
                      <button
                        onClick={() => {
                          playCyberClick();
                          setActiveModalEvent(null);
                        }}
                        className="w-full py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600/80 text-emerald-300 hover:bg-emerald-900 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        <span>RETURN TO OVERVIEW</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Framed Card with Fun Image Changing */}
                  <div className="lg:col-span-5 flex flex-col items-center w-full order-1 lg:order-2">
                    <div className="w-full max-w-[340px] sm:max-w-[380px] bg-[#040805] border-2 border-emerald-500 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.35)] flex flex-col mx-auto">
                      {/* Top bar inside card */}
                      <div className="flex items-center justify-between px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#061009] border-b border-emerald-900/70 font-mono text-[11px] sm:text-xs text-emerald-400 font-bold">
                        <span className="tracking-wide truncate max-w-[200px]">
                          {activeModalEvent.galleryImages[currentPhotoIdx]?.tag || 'LUMIERE_GALA'}
                        </span>
                        <span className="text-emerald-300 shrink-0">
                          {String(currentPhotoIdx + 1).padStart(2, '0')} / {String(activeModalEvent.galleryImages.length).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Fun Interactive Image Frame */}
                      <div
                        onClick={triggerFunChange}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="relative aspect-[4/5] sm:aspect-[3/4] w-full max-h-[46vh] sm:max-h-none overflow-hidden bg-[#020503] cursor-pointer select-none group flex items-center justify-center touch-pan-y"
                        title="Click or tap image to change photo with fun animation!"
                      >
                        {/* Laser scanline sweep on change */}
                        <AnimatePresence>
                          <motion.div
                            key={`scanline-${funKey}`}
                            initial={{ top: '-10%', opacity: 0.9 }}
                            animate={{ top: '110%', opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'linear' }}
                            className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22c55e] z-30 pointer-events-none"
                          />
                        </AnimatePresence>

                        {/* Floating Particle Text on Click */}
                        <AnimatePresence>
                          {particles.map((p) => (
                            <motion.div
                              key={p.id}
                              initial={{ x: p.x - 30, y: p.y - 10, scale: 0.6, opacity: 1 }}
                              animate={{ y: p.y - 65, scale: 1.15, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="absolute z-40 pointer-events-none px-2.5 py-1 rounded-full bg-emerald-950/95 border border-emerald-400 text-emerald-300 font-mono text-[11px] font-bold shadow-[0_0_12px_#22c55e] whitespace-nowrap"
                            >
                              {p.label}
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {/* Click to change tooltip badge */}
                        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/85 border border-emerald-500/80 text-[9px] sm:text-[10px] text-emerald-300 font-mono flex items-center gap-1 opacity-90 sm:opacity-80 group-hover:opacity-100 group-hover:border-emerald-300 group-hover:scale-105 transition-all shadow-md pointer-events-none">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 animate-pulse" />
                          <span>TAP TO SHUFFLE</span>
                        </div>

                        {/* Animated Image */}
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={`${currentPhotoIdx}-${funKey}`}
                            src={activeModalEvent.galleryImages[currentPhotoIdx]?.url}
                            alt={activeModalEvent.galleryImages[currentPhotoIdx]?.caption}
                            variants={funVariants}
                            initial={funEffect === 'flip' ? { rotateY: 90, opacity: 0.6 } : { scale: 0.9, opacity: 0.6 }}
                            animate={funEffect}
                            exit={{ opacity: 0 }}
                            className="w-full h-full object-cover relative z-10 pointer-events-none"
                          />
                        </AnimatePresence>

                        {/* Bottom Overlay Info with Pill Badge */}
                        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none">
                          <div className="inline-block px-2 sm:px-2.5 py-0.5 rounded bg-black/90 border border-emerald-500 text-[9px] sm:text-[11px] text-emerald-400 font-mono font-bold mb-1 shadow">
                            {activeModalEvent.dateStr}
                          </div>
                          <div className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide font-sans truncate">
                            {activeModalEvent.title}
                          </div>
                          <div className="text-[10px] sm:text-xs text-emerald-400/90 font-mono mt-0.5 truncate">
                            {activeModalEvent.badge} · {activeModalEvent.venue}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Carousel Controls Row matching mockup */}
                    <div className="w-full max-w-[340px] sm:max-w-[380px] mt-3.5 sm:mt-5 flex items-center justify-between gap-3 sm:gap-4 font-mono">
                      {/* Prev Button */}
                      <button
                        onClick={prevPhoto}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#040805] border border-emerald-900/90 text-emerald-400 hover:border-emerald-400 hover:text-white hover:bg-emerald-950 transition-all flex items-center justify-center cursor-pointer active:scale-90 shadow-md shrink-0"
                        title="Previous photo"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                      </button>

                      {/* Center Info and Dots */}
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                        <div className="text-xs sm:text-sm font-bold text-emerald-300 tracking-widest font-mono">
                          {String(currentPhotoIdx + 1).padStart(2, '0')} / {String(activeModalEvent.galleryImages.length).padStart(2, '0')}
                        </div>
                        <div className="text-[9px] sm:text-[10px] tracking-widest uppercase text-emerald-500/80 font-mono">
                          TAP OR SWIPE →
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {activeModalEvent.galleryImages.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={() => {
                                playCyberClick();
                                setCurrentPhotoIdx(dotIdx);
                              }}
                              aria-label={`Go to photo ${dotIdx + 1}`}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                dotIdx === currentPhotoIdx
                                  ? 'w-5 sm:w-6 bg-emerald-400 shadow-[0_0_8px_#22c55e]'
                                  : 'w-1.5 bg-emerald-950 hover:bg-emerald-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={nextPhoto}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#040805] border border-emerald-900/90 text-emerald-400 hover:border-emerald-400 hover:text-white hover:bg-emerald-950 transition-all flex items-center justify-center cursor-pointer active:scale-90 shadow-md shrink-0"
                        title="Next photo"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                      </button>
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
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                playCyberClick();
                setActiveArchiveItem(null);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-mono overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-[#07120a] border border-emerald-500/80 rounded-xl p-4 sm:p-6 shadow-2xl shadow-emerald-950 text-emerald-100 my-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold">
                    SESSION {activeArchiveItem.num}
                  </span>
                  <span className="text-emerald-600">{activeArchiveItem.category}</span>
                </div>
                <button
                  onClick={() => {
                    playCyberClick();
                    setActiveArchiveItem(null);
                  }}
                  title="Close (ESC)"
                  aria-label="Close"
                  className="p-1.5 text-emerald-400 hover:text-white rounded-lg border border-emerald-500/80 bg-emerald-950/80 hover:bg-emerald-900 shadow-[0_0_10px_rgba(34,197,94,0.25)] transition-all cursor-pointer active:scale-95"
                >
                  <X className="w-5 h-5" />
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
