import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { LeadershipSection } from './components/LeadershipSection';
import { EventsSection } from './components/EventsSection';
import { JoinSection } from './components/JoinSection';
import { Footer } from './components/Footer';
import { IntroBootloader } from './components/IntroBootloader';
import { JoinModal } from './components/JoinModal';
import { RootAccessModal } from './components/RootAccessModal';
import { playAccessGranted, playCyberBeep } from './utils/audio';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRootOpen, setIsRootOpen] = useState(false);

  // Konami Code detector sequence
  useEffect(() => {
    const konamiSequence = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
    ];
    let currentIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modals on Escape
      if (e.key === 'Escape') {
        setIsJoinOpen(false);
        setIsRootOpen(false);
        return;
      }

      const pressedKey = e.key.toLowerCase();
      if (pressedKey === konamiSequence[currentIndex]) {
        currentIndex++;
        if (currentIndex === konamiSequence.length) {
          currentIndex = 0;
          playAccessGranted();
          setIsRootOpen(true);
        }
      } else {
        currentIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBootComplete = () => {
    setBooted(true);
  };

  const handleReplayIntro = () => {
    setBooted(false);
    playCyberBeep(440, 'sine', 0.08, 0.05);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050806] text-emerald-100 selection:bg-emerald-500 selection:text-black font-mono overflow-x-hidden">
      {/* Intro Bootloader Terminal Animation */}
      {!booted && (
        <IntroBootloader onComplete={handleBootComplete} />
      )}

      {/* Main App Canvas */}
      <div className={`transition-opacity duration-700 ${booted ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <Navbar
          onOpenJoin={() => setIsJoinOpen(true)}
          onReplayIntro={handleReplayIntro}
        />

        <main id="main-content" className="relative">
          <HeroSection
            onOpenJoin={() => setIsJoinOpen(true)}
            onExploreEvents={() => {
              const el = document.getElementById('events');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <AboutSection />

          <LeadershipSection />

          <EventsSection />

          <JoinSection onOpenJoin={() => setIsJoinOpen(true)} />
        </main>

        <Footer
          onTriggerRoot={() => setIsRootOpen(true)}
        />
      </div>

      {/* Modals & Cyber Drawers */}
      <JoinModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />

      <RootAccessModal
        isOpen={isRootOpen}
        onClose={() => setIsRootOpen(false)}
      />
    </div>
  );
}
