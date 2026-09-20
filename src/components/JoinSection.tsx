import React from 'react';
import { ArrowRight, ArrowUp, Sparkles, Terminal } from 'lucide-react';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick } from '../utils/audio';

interface JoinSectionProps {
  onOpenJoin: () => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({ onOpenJoin }) => {
  const headingText = useScrambleText('Join the Team', true, 750, 12);

  const scrollToTop = () => {
    playCyberClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="join" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#040805] border-t border-emerald-950/80 overflow-hidden text-center font-mono">
      {/* Background Topographic / Matrix Ambient Glow */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Pill */}
        <div className="text-xs font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2 mb-4">
          <span className="text-emerald-400 font-bold">//</span>
          <span>ACCESS CLUB</span>
        </div>

        {/* Dynamic Decrypting Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
          {headingText}
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-emerald-300/80 font-sans max-w-2xl leading-relaxed">
          Whether you want to build, lead, or simply learn — CIPHER is where CSE students turn curiosity into capability. Join the community and help shape what comes next.
        </p>

        {/* Action Buttons (matching video at 00:49) */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            id="join-cta-btn"
            onClick={() => {
              playCyberClick();
              onOpenJoin();
            }}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold tracking-wider uppercase bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-all duration-200 shadow-[0_0_25px_rgba(34,197,94,0.45)] hover:shadow-[0_0_35px_rgba(34,197,94,0.75)] active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>JOIN</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="back-to-top-btn"
            onClick={scrollToTop}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold tracking-wider uppercase text-emerald-400 hover:text-white bg-[#06110a] hover:bg-emerald-950/60 border border-emerald-700/80 hover:border-emerald-400 rounded transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
            <span>BACK TO TOP</span>
          </button>
        </div>

        {/* Secret easter egg hint at bottom (as in video 01:03: "Try this: ↑ ↑ ↓ ↓ ← →") */}
        <div className="mt-16 text-[11px] text-emerald-700/80 hover:text-emerald-400 cursor-help transition-colors flex items-center gap-1.5 select-none">
          <Terminal className="w-3 h-3 text-emerald-600" />
          <span>Try this: ↑ ↑ ↓ ↓ ← → ← → B A</span>
          <span className="text-emerald-800">or press ~ for terminal</span>
        </div>
      </div>
    </section>
  );
};
