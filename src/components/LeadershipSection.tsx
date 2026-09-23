import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Play,
  Pause,
  Zap,
} from 'lucide-react';
import { Leader } from '../types';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick } from '../utils/audio';

export const LeadershipSection: React.FC = () => {
  const headingText = useScrambleText('Leadership Structure', true, 750, 14);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [hoveredLeaderId, setHoveredLeaderId] = useState<string | null>(null);
  const [isPausedState, setIsPausedState] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 3>(1); // Default: 1 = Calm & smooth glide

  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const speedRef = useRef(0.75); // Calibrated gentle speed
  const touchStartXRef = useRef<number | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/team');

        if (!response.ok) {
          throw new Error('Failed to fetch team');
        }

      const data = await response.json();
      setLeaders(data);
    } catch (error) {
    console.error('Failed to load team:', error);
  }
};

fetchLeaders();
}, []);

// Synchronize speed multiplier
useEffect(() => {
  // Calibrated comfortable speeds: 1x (Calm) = 0.75px/frame (~45px/sec), 2x (Medium) = 1.25px/frame (~75px/sec), 3x (Brisk) = 1.85px/frame (~110px/sec)
  speedRef.current = speedMultiplier === 1 ? 0.75 : speedMultiplier === 2 ? 1.25 : 1.85;
}, [speedMultiplier]);

// Synchronize pause state (paused when modal open or when hovering a card or manually paused)
useEffect(() => {
  isPausedRef.current = !!selectedLeader || isPausedState;
}, [selectedLeader, isPausedState]);

// Escape to close modal
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSelectedLeader(null);
    }
};
window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, []);


// Duplicate array 3 times for a completely seamless, gap-free infinite scrolling marquee on any screen width
const displayLeaders = [...leaders, ...leaders, ...leaders];

// RequestAnimationFrame continuous sliding loop
useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  let animId: number;
  let lastTime = performance.now();

  const loop = (currentTime: number) => {
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;

    // Exactly 1/3 of the track represents one complete cycle of leaders
    const singleSetWidth = track.scrollWidth / 3;

    if (!isPausedRef.current && singleSetWidth > 0) {
      // Fast continuous forward motion
      targetOffsetRef.current += speedRef.current * (dt * 60);
    }

  // Smooth interpolation to target offset
  offsetRef.current += (targetOffsetRef.current - offsetRef.current) * 0.18;

  // Mathematical wrap-around for infinite seamless sliding
  if (singleSetWidth > 0) {
    while (offsetRef.current >= singleSetWidth) {
      offsetRef.current -= singleSetWidth;
      targetOffsetRef.current -= singleSetWidth;
    }
  while (offsetRef.current < 0) {
    offsetRef.current += singleSetWidth;
    targetOffsetRef.current += singleSetWidth;
  }
}

if (track) {
  track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
}

animId = requestAnimationFrame(loop);
};

animId = requestAnimationFrame(loop);
return () => cancelAnimationFrame(animId);
}, []);

// Manual Nudge Controls
const nudgePrev = () => {
  playCyberClick();
  targetOffsetRef.current -= 310;
};

const nudgeNext = () => {
  playCyberClick();
  targetOffsetRef.current += 310;
};

// Touch Swipe Handlers for mobile devices
const handleTouchStart = (e: React.TouchEvent) => {
  touchStartXRef.current = e.touches[0].clientX;
  isPausedRef.current = true;
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (touchStartXRef.current === null) return;
  const diff = touchStartXRef.current - e.touches[0].clientX;
  targetOffsetRef.current += diff * 1.2;
  offsetRef.current += diff * 1.2;
  touchStartXRef.current = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  touchStartXRef.current = null;
  isPausedRef.current = !!selectedLeader || isPausedState;
};

// Card Mouse Handlers: Instantly stops sliding when mouse pointer is on the specific image/card
const handleCardMouseEnter = (leaderId: string) => {
  setIsPausedState(true);
  setHoveredLeaderId(leaderId);
};

const handleCardMouseLeave = () => {
  setIsPausedState(false);
  setHoveredLeaderId(null);
};

const hoveredLeaderObj = leaders.find((l) => l.id === hoveredLeaderId);

return (
<section id="leadership" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-emerald-950/60 overflow-hidden">
  <div className="max-w-7xl mx-auto relative z-10">
    {/* Section Header with Status Bar and Speed Controls */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div>
        <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-2">
          <span className="text-emerald-400 font-bold">//</span>
            <span>GOVERNANCE &amp; ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2 drop-shadow-[0_0_25px_rgba(34,197,94,0.35)]">
              {headingText}
            </h2>
            <p className="mt-2 text-sm text-emerald-400/80 font-sans max-w-xl">
              Elected student office bearers orchestrating technical initiatives, competitions, and computing culture.
            </p>
          </div>

          {/* Cybernetic Status Pill & Speed Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status indicator badge */}


            {/* Play/Pause toggle */}


            {/* Speed Selector Pills */}

          </div>
        </div>

        {/* Carousel Outer Track with Side Navigation Chevrons */}
        <div className="relative mt-2 font-mono group/track">
          {/* Left Navigation Chevron */}
          <button
            onClick={nudgePrev}
            title="Previous profile"
            aria-label="Previous profile"
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/90 border border-emerald-500/80 text-emerald-400 hover:border-emerald-300 hover:text-white hover:bg-emerald-950 transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-70 group-hover/track:opacity-100"
            >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Navigation Chevron */}
          <button
            onClick={nudgeNext}
            title="Next profile"
            aria-label="Next profile"
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/90 border border-emerald-500/80 text-emerald-400 hover:border-emerald-300 hover:text-white hover:bg-emerald-950 transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-70 group-hover/track:opacity-100"
            >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Overflow-Hidden Viewport Mask */}
          <div
            className="overflow-hidden py-4 px-1"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            >
            {/* Continuously Sliding Hardware-Accelerated Strip */}
            <div
              ref={trackRef}
              className="flex will-change-transform select-none"
              style={{ transform: 'translate3d(0, 0, 0)' }}
              >
              {displayLeaders.map((leader, idx) => {
                  const isThisCardHovered = hoveredLeaderId === leader.id;

                  return (
                  <div
                    key={`${leader.id}-${idx}`}
                    className="flex-shrink-0 w-[240px] sm:w-[270px] md:w-[295px] px-2.5 sm:px-3"
                    onMouseEnter={() => handleCardMouseEnter(leader.id)}
                    onMouseLeave={handleCardMouseLeave}
                    >
                    <div
                      onClick={() => {
                          playCyberClick();
                          setSelectedLeader(leader);
                        }}
                    className={`relative group bg-[#060e08]/95 border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full ${
                        isThisCardHovered
                        ? 'border-2 border-emerald-400 -translate-y-2 shadow-[0_0_30px_rgba(34,197,94,0.55)] ring-1 ring-emerald-400'
                        : 'border-emerald-950/80 hover:border-emerald-500 hover:-translate-y-1.5 hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]'
                      }`}
                  >
                  {/* Interactive Target Lock HUD Indicator (Visible when mouse pointer is on this specific image}

                  {/* Portrait Image Container with Matrix Rain Background */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#030604]">
                    <MatrixRainCanvas
                    opacity={isThisCardHovered ? 0.55 : 0.3}
                    speed={isThisCardHovered ? 1.4 : 0.8}
                    fontSize={12}
                    />

                    {/* Leader Portrait Image */}
                    <img
                    src={leader.image}
                    alt={leader.name}
                    className={`relative z-10 w-full h-full object-cover object-top transition-all duration-500 ${
                        isThisCardHovered
                        ? 'grayscale-0 contrast-100 scale-105'
                        : 'grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105'
                      }`}
                  loading="lazy"
                  />

                  {/* Bottom vignette gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060e08] to-transparent z-20 pointer-events-none" />

                  {/* Circular Magnifying Search Button at Bottom-Right */}
                  <div
                    className={`absolute bottom-3 right-3 z-30 w-7 h-7 rounded-full border flex items-center justify-center shadow-md transition-all ${
                        isThisCardHovered
                        ? 'bg-emerald-400 text-black border-emerald-300 scale-110'
                        : 'bg-emerald-950/90 border-emerald-500/80 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black'
                      }`}
                  >
                  <Search className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Centered Meta Info */}
              <div className="p-4 pt-2 text-center flex flex-col items-center justify-between flex-1 bg-[#060e08] z-20">
                <div className="w-full">
                  {/* Role in tracked uppercase green text */}
                  <div className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">
                    {leader.role}
                  </div>

                  {/* Leader Name */}
                  <h3
                    className={`text-base sm:text-lg font-bold transition-colors mt-1 ${
                        isThisCardHovered ? 'text-emerald-300' : 'text-white group-hover:text-emerald-300'
                      }`}
                  >
                  {leader.name}
                </h3>

                {leader.subtitle && (
                  <p className="text-xs text-emerald-600 font-sans mt-0.5">
                    {leader.subtitle}
                  </p>
                )}
            </div>

            {/* Centered Social Icons */}
            <div className="mt-3 flex items-center justify-center gap-3">
              {leader.github && (
                <a
                  href={leader.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-emerald-400/80 hover:text-white transition-colors"
                  title="GitHub"
                  aria-label="GitHub"
                  >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="currentColor"
                    aria-hidden="true"
                    >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.221-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.688-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .269.18.58.688.482A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                      />
                    </svg>                            </a>
                  )}
                {leader.linkedin && (
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-400/80 hover:text-white transition-colors"
                    title="LinkedIn"
                    aria-label="LinkedIn"
                    >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="currentColor"
                      aria-hidden="true"
                      >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.868 0-2.147 1.445-2.147 2.939v5.667H9.351V9h3.414v1.561h.046c.478-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.35 4.267 5.42v6.289zM5.337 7.433c-.046-1.52-.139-2.89-.139-4.188C5.198 1 .988 0 .988 0H0v4h5v-.567z" />
                    </svg>
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
</div>
</div>
</div>

{/* Leader Modal Popup */}
<AnimatePresence>
  {selectedLeader && (
    <div
      onClick={(e) => {
          if (e.target === e.currentTarget) {
            playCyberClick();
            setSelectedLeader(null);
          }
      }}
  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
  >
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    className="relative w-[92vw] max-w-[340px] max-h-[90vh] flex flex-col bg-[#060c08] border-2 border-emerald-500 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.35)] font-mono"
    >
    {/* Prominent Cross Button to close and return */}
    <button
      onClick={() => {
          playCyberClick();
          setSelectedLeader(null);
        }}
    title="Close and go back"
    aria-label="Close"
    className="absolute top-2.5 right-2.5 z-40 p-2 rounded-full bg-black/90 border border-emerald-400 text-emerald-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-300 transition-all cursor-pointer active:scale-90 shadow-lg"
    >
    <X className="w-5 h-5 stroke-[2.5]" />
  </button>

  {/* Full Image Container - Mobile Responsive and Completely Uncropped */}
  <div className="relative w-full bg-[#030604] flex items-center justify-center overflow-hidden min-h-[190px] max-h-[42vh] sm:max-h-[46vh]">
    <MatrixRainCanvas opacity={0.3} speed={1.1} fontSize={12} />

    {/* Entire uncropped photo */}
    <img
    src={selectedLeader.image}
    alt={selectedLeader.name}
    className="relative z-10 max-h-[42vh] sm:max-h-[46vh] w-auto max-w-full object-contain mx-auto"
    />

    {/* Subtle gradient vignette at the bottom */}
    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#060c08] to-transparent z-20 pointer-events-none" />
  </div>

  {/* Compact Card details with scroll safety for smaller mobile viewports */}
  <div className="p-4 bg-[#060c08] text-center relative z-20 border-t border-emerald-950 overflow-y-auto flex-1">
    <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400">
      {selectedLeader.role}
    </span>

    <h3 className="text-lg font-bold text-white mt-1">
      {selectedLeader.name}
    </h3>

    {selectedLeader.subtitle && (
      <p className="text-[11px] text-emerald-600 font-sans mt-0.5">
        {selectedLeader.subtitle}
      </p>
    )}

  <p className="mt-2 text-xs text-emerald-400/90 font-sans leading-relaxed">
    {selectedLeader.bio}
  </p>

  {/* Social icons */}
  <div className="mt-3.5 flex items-center justify-center gap-3 pt-3 border-t border-emerald-950/80">
    {selectedLeader.github && (
      <a
        href={selectedLeader.github}
        target="_blank"
        rel="noreferrer"
        className="p-1.5 rounded-full border border-emerald-800 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950 hover:text-white transition-all"
        title="GitHub"
        aria-label="GitHub profile"
        >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.167 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.62.069-.607.069-.607 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.338-2.221-.253-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.58 9.58 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.688-4.566 4.936.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .269.18.58.688.482A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"/>
        </svg>
      </a>
    )}
  {selectedLeader.linkedin && (
    <a
      href={selectedLeader.linkedin}
      target="_blank"
      rel="noreferrer"
      className="p-1.5 rounded-full border border-emerald-800 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950 hover:text-white transition-all"
      title="LinkedIn"
      aria-label="LinkedIn profile"
      >
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.605 0 4.27 2.373 4.27 5.467v6.275ZM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123ZM3.56 20.452h3.558V8.999H3.56v11.453Z"/>
      </svg>
    </a>
  )}
{selectedLeader.email && (
  <a
    href={`mailto:${selectedLeader.email}`}
    className="p-1.5 rounded-full border border-emerald-800 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950 hover:text-white transition-all"
    title="Email"
    aria-label="Email contact"
    >
    <Mail className="w-3.5 h-3.5" />
  </a>
)}
</div>
</div>
</motion.div>
</div>
)}
</AnimatePresence>
</section>
);
};
