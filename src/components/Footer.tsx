import React from 'react';
import { Shield, Github, Linkedin, Mail, Instagram, Heart } from 'lucide-react';
import { playCyberClick } from '../utils/audio';

interface FooterProps {
  onTriggerRoot: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTriggerRoot }) => {
  return (
    <footer className="relative bg-[#030604]/80 backdrop-blur-sm border-t border-emerald-950/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-mono text-emerald-500 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-emerald-950/80">
          {/* Col 1: Brand & Department info (matches video at 00:59) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-emerald-500/50 bg-[#08120b] flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-widest text-emerald-300 text-glow-sm">
                CIPHER
              </span>
            </div>

            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Student Association • Computer Science &amp; Engineering
            </p>

            <p className="text-xs text-emerald-600 font-sans leading-relaxed max-w-sm">
              Department of Computer Science &amp; Engineering, St Joseph Engineering College (SJEC), Vamanjoor, Mangaluru, Karnataka.
            </p>
          </div>

          {/* Col 2: Fast Jump Navigation */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              QUICK SECTIONS
            </div>
            <div className="grid grid-cols-2 gap-2 text-emerald-500">
              <a href="#home" className="hover:text-emerald-300 transition-colors">01. Home</a>
              <a href="#about" className="hover:text-emerald-300 transition-colors">02. About</a>
              <a href="#domains" className="hover:text-emerald-300 transition-colors">03. Domains</a>
              <a href="#leadership" className="hover:text-emerald-300 transition-colors">04. Leadership</a>
              <a href="#events" className="hover:text-emerald-300 transition-colors">05. Events</a>
              <a href="#archive" className="hover:text-emerald-300 transition-colors">06. Archive</a>
            </div>
          </div>

          {/* Col 3: Terminal & Social Connections (matches video at 00:59 right side) */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                CONNECT &amp; NETWORK
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  title="CIPHER GitHub"
                  className="p-2 rounded-lg bg-[#061009] border border-emerald-900 text-emerald-400 hover:text-white hover:border-emerald-500 transition-all"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  title="CIPHER LinkedIn"
                  className="p-2 rounded-lg bg-[#061009] border border-emerald-900 text-emerald-400 hover:text-white hover:border-emerald-500 transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="CIPHER Instagram"
                  className="p-2 rounded-lg bg-[#061009] border border-emerald-900 text-emerald-400 hover:text-white hover:border-emerald-500 transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:cipher@sjec.ac.in"
                  title="Email CIPHER SJEC"
                  className="p-2 rounded-lg bg-[#061009] border border-emerald-900 text-emerald-400 hover:text-white hover:border-emerald-500 transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line (matching video at 00:59: "> © 2026 CIPHER SJEC.") */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-600 gap-4">
          <div className="flex items-center gap-2">
            <span>&gt; © 2026 CIPHER SJEC.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-700">KERNEL // v2.6.4</span>
            
          </div>
        </div>
      </div>
    </footer>
  );
};
