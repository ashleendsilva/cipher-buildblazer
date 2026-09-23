import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Users,
  Award,
  X,
  Code2,
  Crown,
  Layers,
  Rocket,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { CIPHER_META, DOMAINS, GALLERY_COLLAGE_IMAGES, GalleryCollageItem } from '../data/cipherData';
import { DomainItem } from '../types';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick, playDataBurst } from '../utils/audio';

const ICON_MAP = {
  Code2,
  Crown,
  Layers,
  Rocket,
};

// 7 precise destination layouts around CIPHER:
// upper-left, upper-right, left, right, lower-left, lower-right, bottom
interface PhotoPositionConfig {
  direction: 'upper-left' | 'upper-right' | 'left' | 'right' | 'lower-left' | 'lower-right' | 'bottom';
  label: string;
  code: string;
  // Position when thrown / placed around CIPHER
  target: {
    x: number;
    y: number;
    rotate: number;
    zIndex: number;
  };
  // Position when tucked behind CIPHER initially
  initial: {
    x: number;
    y: number;
    rotate: number;
    opacity: number;
    scale: number;
    zIndex: number;
  };
}

const PHOTO_DIRECTIONS: PhotoPositionConfig[] = [
  // 1. upper-left
  {
    direction: 'upper-left',
    label: 'UPPER-LEFT',
    code: 'POS-01',
    target: { x: -145, y: -125, rotate: -8, zIndex: 21 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
  // 2. upper-right
  {
    direction: 'upper-right',
    label: 'UPPER-RIGHT',
    code: 'POS-02',
    target: { x: 145, y: -125, rotate: 7, zIndex: 22 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
  // 3. left
  {
    direction: 'left',
    label: 'LEFT',
    code: 'POS-03',
    target: { x: -165, y: 10, rotate: -5, zIndex: 23 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
  // 4. right
  {
    direction: 'right',
    label: 'RIGHT',
    code: 'POS-04',
    target: { x: 165, y: 10, rotate: 6, zIndex: 24 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
  // 5. lower-left
  {
    direction: 'lower-left',
    label: 'LOWER-LEFT',
    code: 'POS-05',
    target: { x: -140, y: 140, rotate: -7, zIndex: 25 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
  // 6. lower-right
  {
    direction: 'lower-right',
    label: 'LOWER-RIGHT',
    code: 'POS-06',
    target: { x: 140, y: 140, rotate: 8, zIndex: 26 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
  // 7. bottom
  {
    direction: 'bottom',
    label: 'BOTTOM',
    code: 'POS-07',
    target: { x: 0, y: 155, rotate: 3, zIndex: 27 },
    initial: { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.8, zIndex: 10 },
  },
];

export const AboutSection: React.FC = () => {
  const headingText = useScrambleText('Who we are', true, 600, 10);
  const domainsHeading = useScrambleText('Our Domains', true, 700, 12);
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Sequential photo reveal state:
  // 0: Initial state (CIPHER in front, 2 photos subtly tucked behind)
  // 1-7: Photos 1 through 7 placed sequentially around CIPHER
  const [revealedCount, setRevealedCount] = useState<number>(0);
  const [isHoveringCollage, setIsHoveringCollage] = useState<boolean>(false);
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null);

  // Cursor tracking refs to trigger one card at a time on movement
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const accumDistance = useRef<number>(0);
  const lastStepTime = useRef<number>(0);
  const autoStepTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Multiplier ensures photos stay strictly contained within right column
  const getResponsiveMultiplier = () => {
    if (windowWidth < 420) return 0.52;
    if (windowWidth < 640) return 0.68;
    if (windowWidth < 1024) return 0.84;
    return 1.0;
  };

  // Move-based sequential activation: Next photo activates as cursor continues moving around
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHoveringCollage(true);
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (lastMousePos.current) {
      const dist = Math.hypot(
        clientX - lastMousePos.current.x,
        clientY - lastMousePos.current.y
      );
      accumDistance.current += dist;
    }
    lastMousePos.current = { x: clientX, y: clientY };

    const now = Date.now();
    // Every 42px of cursor travel and at least 220ms since last card placement
    if (accumDistance.current >= 42 && now - lastStepTime.current >= 220) {
      accumDistance.current = 0;
      lastStepTime.current = now;
      setRevealedCount((prev) => {
        if (prev < 7) {
          playCyberClick();
          return prev + 1;
        }
        return prev;
      });
    }
  };

  // Continuous hover auto-advance if user hovers without shaking mouse
  useEffect(() => {
    if (!isHoveringCollage) {
      if (autoStepTimer.current) clearInterval(autoStepTimer.current);
      return;
    }

    autoStepTimer.current = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev < 7) {
          playCyberClick();
          return prev + 1;
        }
        return prev;
      });
    }, 460);

    return () => {
      if (autoStepTimer.current) clearInterval(autoStepTimer.current);
    };
  }, [isHoveringCollage]);

  const handleMouseEnter = () => {
    setIsHoveringCollage(true);
    accumDistance.current = 0;
    lastStepTime.current = Date.now();
    playDataBurst();
    setRevealedCount((prev) => (prev === 0 ? 1 : prev));
  };

  const handleMouseLeave = () => {
    setIsHoveringCollage(false);
    setRevealedCount(0);
    setHoveredPhotoIndex(null);
    lastMousePos.current = null;
    accumDistance.current = 0;
  };

  const handleContainerClick = () => {
    setRevealedCount((prev) => (prev < 7 ? prev + 1 : 1));
    playCyberClick();
  };

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

          {/* Right Column: Dynamic CIPHER Collage with 7 Rectangular Photos */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Subtle Green Ambient Glow */}
            <div
              className={`absolute w-[75%] h-[75%] rounded-full transition-all duration-700 pointer-events-none ${
                revealedCount > 0
                  ? 'bg-[#00ff41]/16 blur-3xl scale-125'
                  : 'bg-[#00ff41]/10 blur-2xl scale-100'
              }`}
            />

            {/* Cyber Radar / Target Rings Background Accent */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
              <div className="w-72 h-72 sm:w-84 sm:h-84 rounded-full border border-dashed border-[#00ff41]/35 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-[#00ff41]/20" />
            </div>

            {/* Interactive Collage Container:
                Tracks cursor movement to sequentially activate photos one by one */}
            <div
              className="relative z-10 w-full min-h-[500px] xs:min-h-[540px] sm:min-h-[580px] md:min-h-[620px] flex items-center justify-center select-none cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleContainerClick}
              title={
                revealedCount === 7
                  ? 'All 7 photos placed around CIPHER. Move away to tuck.'
                  : 'Move cursor around to throw photos one by one around CIPHER'
              }
            >
              {/* MAIN ELEMENT: Glowing Word "CIPHER"
                  - Positioned in the center of the collage
                  - Appears FIRST and remains visually prominent in front of the images
                  - Higher z-index (z-40) than photos
                  - Strong neon-green cyber glow (#00ff41)
                  - Larger than the photos */}
              <div className="absolute z-40 flex items-center justify-center pointer-events-none select-none text-center">
                <span
                  className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-black font-mono tracking-widest text-[#00ff41] transition-transform duration-300"
                  style={{
                    filter:
                      'drop-shadow(0 0 12px #00ff41) drop-shadow(0 0 32px rgba(0,255,65,0.85)) drop-shadow(0 0 65px rgba(0,255,65,0.4))',
                  }}
                >
                  CIPHER
                </span>
                
              </div>

              {/* 7 Rectangular Physical Photographs from GALLERY_COLLAGE_IMAGES */}
              {GALLERY_COLLAGE_IMAGES.slice(0, 7).map((item, index) => {
                const config = PHOTO_DIRECTIONS[index];
                const mult = getResponsiveMultiplier();

                // Has this specific photo been activated yet in the sequence?
                const isActivated = index < revealedCount;
                const isThisHovered = hoveredPhotoIndex === index;
                const isOtherHovered = hoveredPhotoIndex !== null && hoveredPhotoIndex !== index;

                // Target position when placed around CIPHER vs initial tucked state behind CIPHER
                const targetX = config.target.x * mult;
                const targetY = config.target.y * mult;
                const targetRotate = config.target.rotate;

                const currentX = isActivated ? targetX : config.initial.x;
                const currentY = isActivated ? targetY : config.initial.y;
                const currentRotate = isThisHovered ? 0 : isActivated ? targetRotate : config.initial.rotate;

                // Scale: CIPHER is larger than the photos
                const baseScale = isActivated ? 1.0 : config.initial.scale;
                const targetScale = isThisHovered ? baseScale * 1.12 : isOtherHovered ? baseScale * 0.94 : baseScale;

                // Z-Index: CIPHER is at z-40. Photos are z-10 to z-30 (unless directly hovered by user to inspect, which elevates to z-45)
                const targetZIndex = isThisHovered ? 45 : isActivated ? config.target.zIndex : config.initial.zIndex;

                // Opacity: At the beginning (before activation), photos are completely hidden (opacity 0)
                const targetOpacity = isActivated
                  ? isOtherHovered
                    ? 0.75
                    : 1
                  : 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0.8,
                      rotate: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: currentX,
                      y: currentY,
                      scale: targetScale,
                      rotate: currentRotate,
                      opacity: targetOpacity,
                      zIndex: targetZIndex,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 220,
                      damping: 20,
                      mass: 0.68,
                    }}
                    style={{ zIndex: targetZIndex }}
                    className={`absolute w-36 xs:w-42 sm:w-48 md:w-54 aspect-[4/3] ${
                      isActivated ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
                    }`}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      if (isActivated) {
                        setHoveredPhotoIndex(index);
                        playCyberClick();
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredPhotoIndex(null);
                    }}
                  >
                    {/* Physical Rectangular Photo Frame
                        - Black/dark background (#030805)
                        - Thin neon green #00ff41 border
                        - Slight shadows under photos
                        - Mostly rectangular (rounded-none / rounded-xs) */}
                    <div
                      className={`relative w-full h-full rounded-none overflow-hidden transition-all duration-300 bg-[#030805] ${
                        isThisHovered
                          ? 'border-2 border-[#00ff41] shadow-[0_0_30px_rgba(0,255,65,0.95)] drop-shadow-[0_20px_35px_rgba(0,0,0,0.98)] brightness-110'
                          : isActivated
                          ? 'border border-[#00ff41]/60 shadow-[0_16px_32px_rgba(0,0,0,0.92)] drop-shadow-[0_4px_16px_rgba(0,255,65,0.18)]'
                          : 'border border-[#00ff41]/30 shadow-lg shadow-black/90 opacity-60'
                      }`}
                    >
                      {/* Tactical Corner Crosshairs */}
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#00ff41] z-20 pointer-events-none" />
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#00ff41] z-20 pointer-events-none" />
                      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#00ff41] z-20 pointer-events-none" />
                      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#00ff41] z-20 pointer-events-none" />

                      {/* Top Header Tactical Strip */}
                      <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-2 py-0.5 z-15 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-[#00ff41]/90 pointer-events-none">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="text-[#00ff41]">0{item.id}</span>
                          <span className="text-emerald-500/70">//</span>
                          <span className="text-emerald-300 uppercase tracking-tighter text-[7px] sm:text-[8px]">
                            {config.label}
                          </span>
                        </span>
                        <span className="px-1 py-0.2 bg-[#051408] border border-[#00ff41]/40 rounded-none text-[#00ff41] font-bold text-[7px]">
                          {item.tag}
                        </span>
                      </div>

                      {/* Photo Image */}
                      <img
                        src={item.url}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = item.fallbackUrl;
                        }}
                        className={`w-full h-full object-cover pointer-events-none transition-all duration-300 ${
                          isOtherHovered ? 'grayscale-[20%] brightness-90' : 'grayscale-0'
                        }`}
                        loading="lazy"
                      />

                      {/* Bottom Caption & Frame Counter (appears clearly when placed) */}
                      <div
                        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-2 pt-4 z-15 pointer-events-none transition-opacity duration-200 ${
                          isActivated ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-200 truncate drop-shadow">
                          {item.title}
                        </p>
                        <div className="flex items-center justify-between mt-0.5 text-[7px] sm:text-[8px] font-mono text-[#00ff41]/80">
                          <span className="truncate">{item.subtitle}</span>
                          <span className="text-[#00ff41] font-bold ml-1 shrink-0">
                            0{item.id}/07
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
