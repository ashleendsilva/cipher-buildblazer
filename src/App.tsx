import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { LeadershipSection } from './components/LeadershipSection';
import { EventsSection } from './components/EventsSection';
import { JoinSection } from './components/JoinSection';
import { Footer } from './components/Footer';
import { InteractiveMouseGrid } from './components/InteractiveMouseGrid';
import { TopographicMeshCanvas } from './components/TopographicMeshCanvas';
import { IntroBootloader } from './components/IntroBootloader';
import { JoinModal } from './components/JoinModal';
import { RootAccessModal } from './components/RootAccessModal';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { AdminAuthModal } from './components/AdminPanel/AdminAuthModal';
import { playAccessGranted, playCyberBeep, playCyberClick } from './utils/audio';

// Helper to determine if the current URL points to the private Admin console
const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const rawPath = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    const href = window.location.href.toLowerCase();

    let decodedPath = '';
    let decodedHref = '';
    try {
      decodedPath = decodeURIComponent(rawPath);
      decodedHref = decodeURIComponent(href);
    } catch {
      decodedPath = rawPath;
      decodedHref = href;
    }

    // Matches /admin, \admin, /\admin, %5cadmin, etc.
    const pathMatch =
      rawPath.includes('/admin') ||
      rawPath.includes('\\admin') ||
      rawPath.includes('%5cadmin') ||
      rawPath.endsWith('admin') ||
      decodedPath.includes('/admin') ||
      decodedPath.includes('\\admin') ||
      decodedPath.endsWith('admin');

    const hashMatch =
      hash.includes('admin') ||
      hash === '#admin' ||
      hash === '#/admin' ||
      hash === '#\\admin' ||
      hash.startsWith('#admin') ||
      hash.startsWith('#/admin');

    const searchMatch =
      search.includes('admin') ||
      search === '?admin';

    const hrefMatch =
      decodedHref.includes('/admin') ||
      decodedHref.includes('\\admin');

    return Boolean(pathMatch || hashMatch || searchMatch || hrefMatch);
  } catch {
    return false;
  }
};

// Checks whether a valid admin session or remembered authentication flag exists
const checkIsAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (sessionStorage.getItem('cipher_admin_locked') === 'true') {
      return false;
    }
    return (
      sessionStorage.getItem('cipher_admin_session') === 'true' ||
      localStorage.getItem('cipher_admin_auth') === 'true'
    );
  } catch {
    return false;
  }
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRootOpen, setIsRootOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    checkIsAdminAuthenticated()
  );

  // Listen to URL changes (when user types or updates /admin or #admin in address bar)
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin = checkIsAdminRoute();
      setIsAdminRoute(isAdmin);
      const isAuth = checkIsAdminAuthenticated();
      setIsAdminAuthenticated(isAuth);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Periodic check to capture direct browser address bar inputs in preview environments
    const interval = setInterval(handleUrlChange, 350);

    // Check immediately on mount
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      clearInterval(interval);
    };
  }, []);

  const navigateToAdmin = useCallback(() => {
    playCyberClick();
    if (window.history?.pushState) {
      window.history.pushState({}, '', '/admin');
    }
    window.location.hash = 'admin';
    setIsAdminRoute(true);
  }, []);

  const navigateToPublic = useCallback(() => {
    playCyberClick();
    if (window.history?.pushState) {
      window.history.pushState({}, '', '/');
    }
    window.location.hash = '';
    setIsAdminRoute(false);

    try {
      sessionStorage.removeItem('cipher_admin_session');
    } catch {
      // ignore storage errors
    }
    setIsAdminAuthenticated(checkIsAdminAuthenticated());
  }, []);

  // Keyboard shortcut listener (Ctrl+Shift+A for admin toggle, Konami code for easter egg)
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
      const isAKey = e.key === 'A' || e.key === 'a' || e.code === 'KeyA';
      // Secret admin shortcut: Ctrl + Shift + A, Cmd + Shift + A, Alt + A, or Ctrl + Alt + A
      const isAdmKey =
        ((e.ctrlKey || e.metaKey) && e.shiftKey && isAKey) ||
        (e.altKey && isAKey) ||
        ((e.ctrlKey || e.metaKey) && e.altKey && isAKey);

      if (isAdmKey) {
        e.preventDefault();
        e.stopPropagation();
        if (isAdminRoute && isAdminAuthenticated) {
          navigateToPublic();
        } else if (isAdminRoute && !isAdminAuthenticated) {
          // Already on admin gate
        } else {
          setIsAdminAuthOpen(true);
        }
        return;
      }

      // Close modals on Escape
      if (e.key === 'Escape') {
        setIsJoinOpen(false);
        setIsRootOpen(false);
        if (isAdminAuthOpen) {
          setIsAdminAuthOpen(false);
        }
        if (isAdminRoute && !checkIsAdminAuthenticated()) {
          navigateToPublic();
        }
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

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isAdminRoute, isAdminAuthenticated, navigateToAdmin, navigateToPublic, isAdminAuthOpen]);

  const handleBootComplete = () => {
    setBooted(true);
  };

  const handleReplayIntro = () => {
    setBooted(false);
    playCyberBeep(440, 'sine', 0.08, 0.05);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Admin Route View:
  // If authenticated: render the full Root Command Console AdminPanel.
  // If not authenticated: render the secure Admin Clearance Gate with AdminAuthModal.
  if (isAdminRoute) {
    if (isAdminAuthenticated) {
      return (
        <AdminPanel
          onExit={navigateToPublic}
          onLogout={() => setIsAdminAuthenticated(false)}
        />
      );
    }

    return (
      <div className="relative min-h-screen bg-[#050806] cyber-grid text-emerald-100 font-mono flex items-center justify-center p-4">
        <InteractiveMouseGrid fullPage={true} />
        <AdminAuthModal
          onSuccess={() => {
            setIsAdminAuthOpen(false);
            setIsAdminAuthenticated(true);
          }}
          onCancel={navigateToPublic}
        />
      </div>
    );
  }

  // Otherwise, render the public-facing CIPHER web application (clean, no admin links)
  return (
    <div className="relative min-h-screen bg-[#050806] cyber-grid text-emerald-100 selection:bg-emerald-500 selection:text-black font-mono overflow-x-hidden">
      {/* Full Page Cyber Grid with interactive node tracking, ripple distortion, and HUD coordinates */}
      <InteractiveMouseGrid fullPage={true} />

      {/* Full Page Topographic Contour Waves with multi-harmonic undulating flow and cursor gravity */}
      <TopographicMeshCanvas fullPage={true} />

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

      {/* Modals & Cyber Drawers for Public Website */}
      {isAdminAuthOpen && (
        <AdminAuthModal
          onSuccess={() => {
            setIsAdminAuthOpen(false);
            setIsAdminAuthenticated(true);
            navigateToAdmin();
          }}
          onCancel={() => {
            setIsAdminAuthOpen(false);
          }}
        />
      )}

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
