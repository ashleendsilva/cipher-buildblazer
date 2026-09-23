import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Users,
  Award,
  X,
  ZoomIn,
  Code2,
  Crown,
  Layers,
  Rocket,
  ArrowUpRight,
  CheckCircle2,
  GripHorizontal,
} from 'lucide-react';
import { CIPHER_META, GALLERY_COLLAGE_IMAGES, DOMAINS } from '../data/cipherData';
import { DomainItem } from '../types';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick } from '../utils/audio';

const ICON_MAP = {
  Code2,
  Crown,
  Layers,
  Rocket,
};

export const AboutSection: React.FC = () => {
  const headingText = useScrambleText('Who we are', true, 600, 10);
  const domainsHeading = useScrambleText('Our Domains', true, 700, 12);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; subtitle: string } | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);
  const [activeCard, setActiveCard] = useState(0);

  const pillars = [
    {
      icon: Code,
      title: 'Technical Mastery',
      desc: 'Bridging classroom theory with modern production frameworks, competitive programming, and AI research.',
    },
    {
      icon: Users,
      title: 'Collaborative Culture',
      desc: 'Peer mentorship, branch gala inductions, hackathon squads, and cross-year technical bonding.',
    },
    {
      icon: Award,
      title: 'Professional Caliber',
      desc: 'KSCST-funded research projects, industry visits, UDAAN mock interviews, and corporate summits.',
    },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-emerald-950/60 overflow-hidden font-mono">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 1. Narrative & Visual Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block">
              <div className="text-xs font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2">
                <span className="text-emerald-400 font-bold">//</span>
                <span>ABOUT</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2">
                {headingText}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-emerald-100/90 font-sans leading-relaxed font-normal">
              <strong className="text-emerald-400 font-semibold">CIPHER</strong> is the student association of the Department of Computer Science &amp; Engineering. It serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities.
            </p>

            <p className="text-sm sm:text-base text-emerald-400/80 font-sans leading-relaxed">
              The association strives to bridge the gap between academic knowledge and practical application, fostering a community of aspiring professionals dedicated to excellence in computing.
            </p>

            {/* Core Pillars */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 bg-[#07120a]/80 border border-emerald-900/40 hover:border-emerald-700/80 rounded transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-emerald-200 tracking-wider uppercase mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-emerald-500/80 font-sans leading-normal">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Collage with Glowing Neon CIPHER Backdrop */}
          <div className="lg:col-span-6 relative">
            {/* Glowing Neon CIPHER Backdrop Text */}
            <div className="absolute -top-10 -right-6 text-7xl sm:text-8xl md:text-9xl font-black font-mono tracking-widest text-emerald-500/10 select-none pointer-events-none text-glow">
              CIPHER
            </div>

            {/* Throwing Cards Photo Stack with Full Grip */}
            <div className="relative z-10 h-[430px] sm:h-[500px] flex items-center justify-center select-none">
              {/* Glow behind cards */}
              <div className="absolute w-[75%] h-[75%] bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />

              {GALLERY_COLLAGE_IMAGES.map((img, i) => {
                const total = GALLERY_COLLAGE_IMAGES.length;
                // Makes the active card appear on top
                const position = (i - activeCard + total) % total;
                const rotations = [-6, 4, -3, 7, -5, 3];

                return (
                  <motion.div
                    key={i}
                    drag={position === 0 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={(_, info) => {
                      if (position === 0) {
                        if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 200) {
                          playCyberClick();
                          setActiveCard((prev) => (prev + 1) % total);
                        }
                      }
                    }}
                    animate={{
                      x:
                        position === 0
                          ? 0
                          : position === 1
                          ? 32
                          : position === 2
                          ? -32
                          : 0,

                      y:
                        position === 0
                          ? 0
                          : position === 1
                          ? -8
                          : position === 2
                          ? 8
                          : 0,

                      rotate:
                        position === 0
                          ? 0
                          : rotations[i % rotations.length],

                      scale:
                        position === 0
                          ? 1
                          : position === 1
                          ? 0.96
                          : position === 2
                          ? 0.92
                          : 0.88,

                      opacity:
                        position > 3
                          ? 0
                          : 1,
                    }}
                    transition={{
                      duration: 0.45,
                      type: "spring",
                      stiffness: 140,
                      damping: 16,
                    }}
                    onClick={() => {
                      if (position === 0) {
                        playCyberClick();
                        setActiveCard((prev) => (prev + 1) % total);
                      }
                    }}
                    className={`absolute w-[88%] sm:w-[78%] max-w-[520px] aspect-[4/3] ${
                      position === 0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                    }`}
                    style={{
                      zIndex: total - position,
                    }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-xl border-2 border-emerald-500/80 bg-[#07120a] shadow-2xl shadow-black/90 group flex flex-col justify-between">
                      {/* Full Grip Tactical Header Strip */}
                      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-3 py-1.5 bg-[#030a05]/95 border-b border-emerald-900/90 font-mono text-[10px] text-emerald-400 select-none pointer-events-none backdrop-blur-sm">
                        <div className="flex items-center gap-1.5 font-bold tracking-wider">
                          <GripHorizontal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>FULL GRIP // SWIPEABLE</span>
                        </div>
                        <span className="text-[9px] text-emerald-600 tracking-widest uppercase">
                          {position === 0 ? 'DRAG OR TAP TO FLICK' : 'IN STACK'}
                        </span>
                      </div>

                      {/* Side Tactile Grip Ridges (Left & Right) */}
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 p-1 rounded bg-black/80 border border-emerald-500/50 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="w-1 h-3 rounded-full bg-emerald-400" />
                        <span className="w-1 h-3 rounded-full bg-emerald-400/60" />
                        <span className="w-1 h-3 rounded-full bg-emerald-400/30" />
                      </div>
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 p-1 rounded bg-black/80 border border-emerald-500/50 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="w-1 h-3 rounded-full bg-emerald-400" />
                        <span className="w-1 h-3 rounded-full bg-emerald-400/60" />
                        <span className="w-1 h-3 rounded-full bg-emerald-400/30" />
                      </div>

                      {/* Image */}
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500 pointer-events-none"
                        loading="lazy"
                      />

                      {/* Green matrix overlay */}
                      <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />

                      {/* Bottom information and grip handle */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12 z-20 pointer-events-none">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                            <ZoomIn className="w-3 h-3" />
                            {position === 0 ? 'CLICK OR DRAG' : 'VIEW SNAPSHOT'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                            {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-semibold text-white truncate">
                          {img.title}
                        </h4>

                        {/* Knurled Bottom Grip Handle Strip */}
                        <div className="mt-2 pt-1.5 border-t border-emerald-950 flex items-center justify-center gap-2 text-emerald-500 text-[9px] font-mono tracking-widest uppercase">
                          <GripHorizontal className="w-3 h-3 text-emerald-400" />
                          <span>FULL GRIP · DRAG TO THROW</span>
                          <GripHorizontal className="w-3 h-3 text-emerald-400" />
                        </div>
                      </div>

                      {/* Corner accents */}
                      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/80 z-20 pointer-events-none" />
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400/80 z-20 pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400/80 z-20 pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400/80 z-20 pointer-events-none" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Floating Live Indicator Badge */}
            <div className="absolute -bottom-4 left-6 sm:left-12 z-20 px-3.5 py-1.5 bg-[#08150c] border border-emerald-600/80 rounded-full flex items-center gap-2 shadow-lg shadow-emerald-950/60 text-xs font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SJEC CSE // EXCELLENCE ARCHIVE</span>
            </div>
          </div>
        </div>

        {/* Anchor point for #domains */}
        <div id="domains" className="relative -top-24" />

        {/* 2. Specialized Operational Domains Sub-Section */}
        <div className="mt-28 pt-20 border-t border-emerald-950/70">
          {/* Section Header */}
          <div className="mb-12">
            <div className="text-xs font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2">
              <span className="text-emerald-400 font-bold">//</span>
              <span>OPERATIONAL TRACKS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2 flex flex-wrap items-center gap-3">
              <span>{domainsHeading}</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded">
                04 SPECIALIZED VERTICALS
              </span>
            </h3>
            <p className="mt-3 text-sm sm:text-base text-emerald-400/80 font-sans max-w-2xl leading-relaxed">
              Structured operational tracks engineered to develop technical capability, leadership acumen, and career readiness for every CSE undergraduate.
            </p>
          </div>

          {/* 2x2 Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            {DOMAINS.map((domain) => {
              const Icon = ICON_MAP[domain.icon as keyof typeof ICON_MAP] || Code2;
              return (
                <div
                  key={domain.id}
                  onClick={() => {
                    playCyberClick();
                    setSelectedDomain(domain);
                  }}
                  className="relative group p-6 sm:p-8 bg-[#07120a]/80 hover:bg-[#09170d] border border-emerald-900/50 hover:border-emerald-500/80 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-black/40 hover:shadow-emerald-950/40 overflow-hidden flex flex-col justify-between"
                >
                  {/* Tactical Corner Grips */}
                  <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400/80 pointer-events-none group-hover:border-emerald-300 transition-colors" />
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400/80 pointer-events-none group-hover:border-emerald-300 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400/80 pointer-events-none group-hover:border-emerald-300 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400/80 pointer-events-none group-hover:border-emerald-300 transition-colors" />

                  {/* Tactical Top Grip Knurling Strip */}
                  <div className="h-0.5 w-full bg-[repeating-linear-gradient(90deg,#10b981_0px,#10b981_3px,transparent_3px,transparent_6px)] opacity-40 group-hover:opacity-80 transition-opacity mb-4" />

                  {/* Top row: Icon and Sessions Count badge */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-lg bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 group-hover:scale-105 group-hover:border-emerald-500 transition-all shadow-[0_0_12px_rgba(34,197,94,0.15)]">
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs tracking-wider px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-800/80 text-emerald-400 font-semibold">
                          {domain.sessionsCount} SESSIONS
                        </span>
                        <div className="w-7 h-7 rounded bg-emerald-950/40 border border-emerald-900/80 flex items-center justify-center text-emerald-500 group-hover:text-emerald-300 group-hover:border-emerald-500 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {domain.title}
                    </h4>

                    {/* Description */}
                    <p className="mt-3 text-sm text-emerald-400/80 font-sans leading-relaxed">
                      {domain.description}
                    </p>
                  </div>

                  {/* Bottom Tags */}
                  <div className="mt-6 pt-5 border-t border-emerald-950/90 flex flex-wrap gap-2">
                    {domain.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-[#061009] border border-emerald-900/60 text-emerald-500/90"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Collage Photos */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-w-3xl w-full bg-[#07100a] border border-emerald-600/70 rounded-xl overflow-hidden shadow-2xl shadow-emerald-950/80 font-mono"
            >
              <div className="flex items-center justify-between p-4 border-b border-emerald-900 bg-[#050b07]">
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>CIPHER ARCHIVE // {selectedImage.title}</span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 bg-[#07120a] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-200">{selectedImage.title}</h4>
                  <p className="text-xs text-emerald-500 font-sans mt-0.5">{selectedImage.subtitle}</p>
                </div>
                <span className="text-[10px] text-emerald-600 font-mono border border-emerald-900 px-2 py-1 rounded">
                  AUTHENTICATED RECORD
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Domain Detail Modal */}
      <AnimatePresence>
        {selectedDomain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative max-w-xl w-full bg-[#07110a] border border-emerald-600/80 rounded-xl p-6 sm:p-8 shadow-2xl shadow-emerald-950 font-mono text-emerald-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-500">// VERTICAL SPECIFICATION</span>
                </div>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="p-1.5 text-emerald-500 hover:text-white rounded border border-emerald-900 hover:border-emerald-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold">
                    DOMAIN {selectedDomain.code}
                  </span>
                  <span className="text-xs text-emerald-500">
                    {selectedDomain.sessionsCount} Curated Sessions Planned
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mt-2">
                  {selectedDomain.title}
                </h3>

                <p className="mt-3 text-sm text-emerald-300/80 font-sans leading-relaxed">
                  {selectedDomain.description}
                </p>

                {selectedDomain.recentWorkshops && (
                  <div className="mt-6">
                    <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-3">
                      Featured Initiatives &amp; Workshops:
                    </h4>
                    <ul className="space-y-2 font-sans text-sm">
                      {selectedDomain.recentWorkshops.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-emerald-900/80 flex items-center justify-between">
                  <span className="text-xs text-emerald-600">
                    STATUS: ACTIVE // ENROLLMENT OPEN
                  </span>
                  <button
                    onClick={() => {
                      playCyberClick();
                      setSelectedDomain(null);
                      const joinEl = document.getElementById('join');
                      if (joinEl) joinEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded transition-colors"
                  >
                    JOIN THIS DOMAIN
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
