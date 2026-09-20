import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Shield, Sparkles } from 'lucide-react';
import { isSoundEnabled, toggleSound, playCyberClick } from '../utils/audio';

interface NavbarProps {
  onOpenJoin: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoin, onReplayIntro }) => {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'about', 'leadership', 'events', 'join'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const navLinks = [
    { name: 'HOME', href: '#home', id: 'home' },
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'LEADERSHIP', href: '#leadership', id: 'leadership' },
    { name: 'EVENTS', href: '#events', id: 'events' },
    { name: 'JOIN', href: '#join', id: 'join' },
  ];

  const handleNavClick = (href: string) => {
    playCyberClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-mono ${
        scrolled
          ? 'bg-[#050806]/90 backdrop-blur-md border-b border-emerald-950/80 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: CIPHER Logo Badge with wings */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-3 group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border border-emerald-500/50 bg-[#08120b] shadow-[0_0_12px_rgba(34,197,94,0.35)] group-hover:border-emerald-400 group-hover:shadow-[0_0_18px_rgba(34,197,94,0.6)] transition-all">
            {/* Wing emblem overlay */}
            <Shield className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e] animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="font-extrabold tracking-widest text-lg text-emerald-300 text-glow-sm flex items-center gap-1.5">
              CIPHER
              <span className="text-[10px] font-normal px-1.5 py-0.2 bg-emerald-950/80 border border-emerald-800/60 rounded text-emerald-400">
                CSE
              </span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-600/90 font-mono hidden sm:block">
              St Joseph Engg College
            </span>
          </div>
        </a>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`relative px-3 py-1.5 text-xs font-semibold tracking-wider rounded transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                    : 'text-emerald-500/80 hover:text-emerald-300 hover:bg-emerald-950/30'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_#22c55e]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute Cyber Audio' : 'Unmute Cyber Audio'}
            className="p-2 text-emerald-500/70 hover:text-emerald-300 border border-emerald-900/50 hover:border-emerald-700 bg-[#060b08]/80 rounded transition-all"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Replay Intro */}
          {onReplayIntro && (
            <button
              onClick={() => {
                playCyberClick();
                onReplayIntro();
              }}
              title="Replay Terminal Bootloader Intro"
              className="p-2 text-emerald-500/70 hover:text-emerald-300 border border-emerald-900/50 hover:border-emerald-700 bg-[#060b08]/80 rounded transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Join Cipher CTA (matching video style) */}
          <button
            id="nav-join-cipher-btn"
            onClick={() => {
              playCyberClick();
              onOpenJoin();
            }}
            className="px-4 py-1.5 text-xs font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/60 hover:bg-emerald-800/50 border border-emerald-600/80 hover:border-emerald-400 rounded transition-all duration-200 shadow-[0_0_12px_rgba(34,197,94,0.25)] hover:shadow-[0_0_18px_rgba(34,197,94,0.5)] active:scale-95"
          >
            JOIN CIPHER
          </button>
        </div>

        {/* Mobile menu & quick buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => {
              playCyberClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 text-emerald-400 border border-emerald-900 bg-[#060b08] rounded"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-950 bg-[#050806]/98 backdrop-blur-xl px-4 py-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-3 py-2 text-sm font-semibold rounded ${
                  activeSection === link.id
                    ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-emerald-950/80 flex items-center justify-between gap-3">
            <button
              onClick={handleSoundToggle}
              className="flex items-center gap-2 px-3 py-2 text-xs border border-emerald-900 rounded text-emerald-400"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundOn ? 'Sound On' : 'Sound Off'}</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                setMobileMenuOpen(false);
                onOpenJoin();
              }}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-black bg-emerald-500 hover:bg-emerald-400 rounded text-center"
            >
              JOIN CIPHER
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
