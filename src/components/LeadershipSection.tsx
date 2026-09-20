import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Mail, X, ShieldCheck, Quote } from 'lucide-react';
import { LEADERS } from '../data/cipherData';
import { Leader } from '../types';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { useScrambleText } from '../utils/scrambleText';
import { playCyberClick } from '../utils/audio';

export const LeadershipSection: React.FC = () => {
  const headingText = useScrambleText('Leadership Structure', true, 750, 14);
  const [activeTab, setActiveTab] = useState<'executive' | 'faculty'>('executive');
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  const filteredLeaders = LEADERS.filter((l) => l.category === activeTab);

  return (
    <section id="leadership" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#050806] border-t border-emerald-950/60 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2">
              <span className="text-emerald-400 font-bold">//</span>
              <span>GOVERNANCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono mt-2">
              {headingText}
            </h2>
            <p className="mt-2 text-sm text-emerald-400/80 font-sans max-w-xl">
              Elected student office bearers and esteemed faculty mentorship orchestrating academic excellence, research initiatives, and computing culture.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#07130b] border border-emerald-900/60 rounded-lg font-mono text-xs">
            <button
              onClick={() => {
                playCyberClick();
                setActiveTab('executive');
              }}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                activeTab === 'executive'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : 'text-emerald-400 hover:text-emerald-200'
              }`}
            >
              EXECUTIVE BOARD
            </button>
            <button
              onClick={() => {
                playCyberClick();
                setActiveTab('faculty');
              }}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                activeTab === 'faculty'
                  ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(34,197,94,0.4)]'
                  : 'text-emerald-400 hover:text-emerald-200'
              }`}
            >
              FACULTY MENTORS
            </button>
          </div>
        </div>

        {/* Leadership Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
          {filteredLeaders.map((leader) => (
            <div
              key={leader.id}
              onClick={() => {
                playCyberClick();
                setSelectedLeader(leader);
              }}
              className="relative group bg-[#060e09] border border-emerald-950 hover:border-emerald-500/90 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/50 flex flex-col"
            >
              {/* Matrix Rain Canvas behind the portrait */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#030604]">
                <MatrixRainCanvas opacity={0.3} speed={0.9} fontSize={12} />

                {/* Portrait */}
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="relative z-10 w-full h-full object-cover object-top grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500"
                  loading="lazy"
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#060e09] via-transparent to-transparent opacity-80" />

                {/* Click to inspect badge overlay */}
                <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] tracking-wider px-2 py-0.5 rounded bg-black/80 border border-emerald-500 text-emerald-300">
                    EXPAND
                  </span>
                </div>
              </div>

              {/* Leader Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-[#060e09] z-20 border-t border-emerald-950">
                <div>
                  <div className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase mb-1">
                    {leader.role}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {leader.name}
                  </h3>
                  {leader.subtitle && (
                    <p className="text-xs text-emerald-600 font-sans mt-0.5">
                      {leader.subtitle}
                    </p>
                  )}
                </div>

                {/* Social icons matching video at 00:18 */}
                <div className="mt-4 pt-3 border-t border-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {leader.github && (
                      <a
                        href={leader.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-500/70 hover:text-emerald-300 transition-colors"
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
                        className="text-emerald-500/70 hover:text-emerald-300 transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {leader.email && (
                      <a
                        href={`mailto:${leader.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-emerald-500/70 hover:text-emerald-300 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <span className="text-[10px] text-emerald-700">SJEC // CSE</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leader Modal Popup (as seen at video timestamp 00:23) */}
      <AnimatePresence>
        {selectedLeader && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full bg-[#060c08] border-2 border-emerald-500/90 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(34,197,94,0.35)] font-mono"
            >
              {/* Top close button */}
              <button
                onClick={() => setSelectedLeader(null)}
                className="absolute top-3 right-3 z-40 p-1.5 rounded-full bg-black/70 border border-emerald-700 text-emerald-400 hover:text-white hover:border-emerald-400 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Matrix rain canvas inside the modal */}
              <div className="relative aspect-[4/5] w-full bg-[#030604] overflow-hidden">
                <MatrixRainCanvas opacity={0.4} speed={1.3} fontSize={13} />

                <img
                  src={selectedLeader.image}
                  alt={selectedLeader.name}
                  className="relative z-10 w-full h-full object-cover object-top"
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#060c08] via-transparent to-transparent" />
              </div>

              {/* Bottom Card details */}
              <div className="p-6 bg-[#060c08] text-center relative z-20 border-t border-emerald-900/60">
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-400">
                  {selectedLeader.role}
                </span>

                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedLeader.name}
                </h3>

                {selectedLeader.quote && (
                  <p className="mt-3 text-xs italic text-emerald-300/80 font-sans px-2">
                    &ldquo;{selectedLeader.quote}&rdquo;
                  </p>
                )}

                <p className="mt-3 text-xs text-emerald-500 font-sans leading-relaxed">
                  {selectedLeader.bio}
                </p>

                {/* Social icons */}
                <div className="mt-5 flex items-center justify-center gap-5 pt-4 border-t border-emerald-950">
                  {selectedLeader.github && (
                    <a
                      href={selectedLeader.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full border border-emerald-800 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950 transition-all"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {selectedLeader.linkedin && (
                    <a
                      href={selectedLeader.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full border border-emerald-800 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950 transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {selectedLeader.email && (
                    <a
                      href={`mailto:${selectedLeader.email}`}
                      className="p-2 rounded-full border border-emerald-800 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950 transition-all"
                    >
                      <Mail className="w-4 h-4" />
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
