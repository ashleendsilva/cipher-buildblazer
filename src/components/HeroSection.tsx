import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Terminal, Shield, Activity, Cpu } from 'lucide-react';
import { AsciiMatrixCipherHeader } from './AsciiMatrixCipherHeader';
import { playCyberClick } from '../utils/audio';

interface HeroSectionProps {
  onOpenJoin: () => void;
  onExploreEvents: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenJoin, onExploreEvents }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, active: true });
    sectionRef.current.style.setProperty('--mouse-x', `${x}px`);
    sectionRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setMousePos((prev) => ({ ...prev, active: true }))}
      onMouseLeave={() => setMousePos((prev) => ({ ...prev, active: false }))}
      style={{
        backgroundImage: mousePos.active
          ? 'radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 40%), rgba(34, 197, 94, 0.14), rgba(5, 150, 105, 0.04) 50%, transparent 80%)'
          : 'radial-gradient(600px circle at 50% 40%, rgba(34, 197, 94, 0.08), transparent 75%)',
      }}
      className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent transition-colors duration-300"
    >
      {/* Dynamic Cursor Light Glow Pulse */}
      {mousePos.active && (
        <div
          className="absolute pointer-events-none rounded-full blur-[90px] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.22) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
          }}
        />
      )}

      {/* Subtle radial ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Node status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-emerald-800/60 bg-[#07130b]/80 backdrop-blur-md text-xs font-mono text-emerald-400/90 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#22c55e]" />
          <span className="font-semibold">NODE: SJEC.CSE.CIPHER</span>
          <span className="text-emerald-700">|</span>
          <span className="hidden sm:inline text-emerald-500/80">TERM 2025–2026</span>
          <span className="text-emerald-700 hidden sm:inline">|</span>
          <span className="text-emerald-300 font-mono text-[11px]">SYS // ONLINE</span>
          <span className="text-emerald-700 hidden md:inline">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            CLICK TO WARP GRID
          </span>
        </div>

        {/* ASCII Matrix Glyph Typography & Vertical Contour Waves: CIPHER */}
        <AsciiMatrixCipherHeader />

        {/* Subtitle / Department Definition */}
        <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-emerald-100 max-w-3xl">
          Student Association of Computer Science &amp; Engineering
        </h2>

        <p className="mt-4 text-sm sm:text-base md:text-lg text-emerald-400/80 max-w-2xl font-sans font-normal leading-relaxed">
          Bridging academic knowledge and practical application — a community of aspiring professionals in computing.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto font-mono">
          <button
            id="hero-join-btn"
            onClick={() => {
              playCyberClick();
              onOpenJoin();
            }}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold tracking-wider uppercase bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-all duration-200 shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:shadow-[0_0_35px_rgba(34,197,94,0.8)] active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>JOIN CIPHER</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-events-btn"
            onClick={() => {
              playCyberClick();
              onExploreEvents();
            }}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold tracking-wider uppercase text-emerald-300 hover:text-emerald-100 bg-[#060e08]/90 hover:bg-emerald-950/40 border border-emerald-600/70 hover:border-emerald-400 rounded transition-all duration-200 shadow-[0_0_15px_rgba(34,197,94,0.15)] flex items-center justify-center gap-2 group active:scale-95"
          >
            <Calendar className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>EXPLORE EVENTS</span>
          </button>
        </div>

        {/* Quick Micro-Telemetry Grid */}
        <div className="mt-16 pt-8 border-t border-emerald-950/80 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-left">
          <div className="p-3 bg-[#060c08]/60 border border-emerald-950 rounded">
            <div className="flex items-center gap-2 text-emerald-500 text-xs mb-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACTIVE DOMAINS</span>
            </div>
            <div className="text-xl font-bold text-emerald-200">04 TRACKS</div>
            <div className="text-[10px] text-emerald-600">Tech • Lead • Events • Industry</div>
          </div>

          <div className="p-3 bg-[#060c08]/60 border border-emerald-950 rounded">
            <div className="flex items-center gap-2 text-emerald-500 text-xs mb-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>ACTIVITIES LOG</span>
            </div>
            <div className="text-xl font-bold text-emerald-200">17+ SESSIONS</div>
            <div className="text-[10px] text-emerald-600">Workshops, IVs &amp; Hackathons</div>
          </div>

          <div className="p-3 bg-[#060c08]/60 border border-emerald-950 rounded">
            <div className="flex items-center gap-2 text-emerald-500 text-xs mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>AFFILIATION</span>
            </div>
            <div className="text-xl font-bold text-emerald-200">SJEC CSE</div>
            <div className="text-[10px] text-emerald-600">Autonomous Institute</div>
          </div>

          <div className="p-3 bg-[#060c08]/60 border border-emerald-950 rounded">
            <div className="flex items-center gap-2 text-emerald-500 text-xs mb-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECURITY LEVEL</span>
            </div>
            <div className="text-xl font-bold text-emerald-300 text-glow-sm">ROOT / OPEN</div>
            <div className="text-[10px] text-emerald-600">Cipher Protocol Enabled</div>
          </div>
        </div>
      </div>
    </section>
  );
};
