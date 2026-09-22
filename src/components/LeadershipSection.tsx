import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Github,
  Linkedin,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { LEADERS } from '../data/cipherData';
import { Leader } from '../types';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick } from '../utils/audio';

export const LeadershipSection: React.FC = () => {
  const headingText = useScrambleText('Leadership Structure', true, 750, 14);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedLeader(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const leaders = LEADERS;
  // Duplicate array to allow seamless carousel looping across all cards
  const displayLeaders = [...leaders, ...leaders];

  // Determine how many cards are visible horizontally
  const visibleCards =
    windowWidth < 640 ? 1.25 : windowWidth < 768 ? 2.2 : windowWidth < 1024 ? 3.2 : windowWidth < 1280 ? 4 : 4.4;

  // Automatic slide triggered when mouse is hovering over the carousel
  useEffect(() => {
    if (!isHovered || leaders.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % leaders.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [isHovered, leaders.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? leaders.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % leaders.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      playCyberClick();
      nextSlide();
    } else if (diff < -45) {
      playCyberClick();
      prevSlide();
    }
    setTouchStartX(null);
  };

  return (
    <section id="leadership" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-emerald-950/60 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-10">
          <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-2">
            <span className="text-emerald-400 font-bold">//</span>
            <span>GOVERNANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2 drop-shadow-[0_0_25px_rgba(34,197,94,0.35)]">
            {headingText}
          </h2>
          <p className="mt-2 text-sm text-emerald-400/80 font-sans max-w-xl">
            Elected student office bearers orchestrating technical initiatives, competitions, and computing culture.
          </p>
        </div>

        {/* Carousel Track with auto-slide on hover */}
        <div
          className="relative mt-4 font-mono group/track"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Navigation Chevrons on Track Sides */}
          <button
            onClick={() => {
              playCyberClick();
              prevSlide();
            }}
            title="Previous profile"
            aria-label="Previous profile"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/80 border border-emerald-900 text-emerald-400 hover:border-emerald-400 hover:text-white hover:bg-emerald-950 transition-all cursor-pointer active:scale-95 shadow-xl opacity-0 group-hover/track:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              playCyberClick();
              nextSlide();
            }}
            title="Next profile"
            aria-label="Next profile"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/80 border border-emerald-900 text-emerald-400 hover:border-emerald-400 hover:text-white hover:bg-emerald-950 transition-all cursor-pointer active:scale-95 shadow-xl opacity-0 group-hover/track:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Viewport */}
          <div
            className="overflow-hidden p-1 sm:p-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {displayLeaders.map((leader, idx) => (
                <div
                  key={`${leader.id}-${idx}`}
                  style={{ width: `${100 / visibleCards}%` }}
                  className="flex-shrink-0 px-2 sm:px-2.5"
                >
                  <div
                    onClick={() => {
                      playCyberClick();
                      setSelectedLeader(leader);
                    }}
                    className="relative group bg-[#060e08]/90 border border-emerald-950/80 hover:border-2 hover:border-emerald-500 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] flex flex-col h-full"
                  >
                    {/* Portrait Image Container with Matrix Rain Background */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#030604]">
                      <MatrixRainCanvas opacity={0.35} speed={0.9} fontSize={12} />

                      {/* Portrait Image */}
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="relative z-10 w-full h-full object-cover object-top grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />

                      {/* Bottom vignette gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060e08] to-transparent z-20 pointer-events-none" />

                      {/* Green Circular Magnifying Search Button at Bottom-Right */}
                      <div className="absolute bottom-3 right-3 z-30 w-7 h-7 rounded-full bg-emerald-950/90 border border-emerald-500/80 flex items-center justify-center text-emerald-400 shadow-md group-hover:bg-emerald-500 group-hover:text-black transition-all">
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
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mt-1">
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
                            <Github className="w-4 h-4" />
                          </a>
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
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {leaders.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {leaders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playCyberClick();
                    setCurrentIndex(idx);
                  }}
                  title={`Go to item ${idx + 1}`}
                  aria-label={`Go to item ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex % leaders.length === idx
                      ? 'w-8 bg-emerald-400 shadow-[0_0_8px_#22c55e]'
                      : 'w-2 bg-emerald-950 hover:bg-emerald-800'
                  }`}
                />
              ))}
            </div>
          )}
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
                      <Github className="w-3.5 h-3.5" />
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
                      <Linkedin className="w-3.5 h-3.5" />
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

