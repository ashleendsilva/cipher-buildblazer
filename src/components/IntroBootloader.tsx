import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import {
  playCyberClick,
  playCyberBeep,
  playAccessGranted,
  playCyberWarpSweep,
  playDataBurst,
  isSoundEnabled,
  toggleSound,
} from '../utils/audio';
import {
  Shield,
  Terminal,
  Cpu,
  Radio,
  Volume2,
  VolumeX,
  FastForward,
  Zap,
  Sparkles,
} from 'lucide-react';

interface IntroBootloaderProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  { text: 'INIT SJEC_CSE_SYSTEM_BUS v2.6.4', delay: 180 },
  { text: 'HANDSHAKE: NODE_MANGALURU_0824 [VERIFIED]', delay: 420 },
  { text: 'ALLOCATING QUANTUM BUFFER: 4096_MB OK', delay: 700 },
  { text: 'MOUNTING MODULE: TECHNICAL_SKILL_BUILDING', delay: 980 },
  { text: 'MOUNTING MODULE: INDUSTRY_READINESS_MESH', delay: 1250 },
  { text: 'RESOLVING CIPHER_CRYPTOGRAPHIC_PAYLOAD...', delay: 1550 },
  { text: 'DECRYPTING STUDENT_ASSOCIATION_INTERFACE...', delay: 1900 },
  { text: 'ALL SUBSYSTEMS NOMINAL: ACCESS CONFIRMED', delay: 2300 },
];

const GLYPH_CHARS = '01#@%&*$!?<>_~[]{}+=ΦΨΣΩ';
const TARGET_WORD = 'CIPHER';

export const IntroBootloader: React.FC<IntroBootloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [phase, setPhase] = useState<'boot' | 'decrypt' | 'warp' | 'done'>('boot');
  const [scrambledTitle, setScrambledTitle] = useState('------');
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isAccelerated, setIsAccelerated] = useState(false);
  const [spectrumBars, setSpectrumBars] = useState<number[]>([40, 65, 30, 85, 50, 95, 45, 75, 60, 90, 35, 70]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: 0.4, y: 0.6, speed: 0.015 });

  // Handle sound toggle
  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  // 3D Hologram Wireframe Cube & Radar HUD in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = 320);
    let height = (canvas.height = 320);

    // 8 vertices of a 3D cube
    const vertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];

    // 12 edges connecting the vertices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    let angleX = rotationRef.current.x;
    let angleY = rotationRef.current.y;
    let pulseScale = 1;
    let pulseDir = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = 58 * pulseScale;

      // Update rotation
      const spd = rotationRef.current.speed;
      angleX += spd;
      angleY += spd * 1.3;

      pulseScale += pulseDir;
      if (pulseScale > 1.08 || pulseScale < 0.94) pulseDir = -pulseDir;

      // Draw outer HUD tactical radar rings
      ctx.save();
      ctx.translate(cx, cy);

      // Ring 1 (Tick marks)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 130, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 2 (Dashed radar circle)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 115, -angleY, Math.PI * 2 - angleY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ring 3 (Outer crosshairs)
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
      ctx.beginPath();
      ctx.moveTo(-140, 0);
      ctx.lineTo(-118, 0);
      ctx.moveTo(118, 0);
      ctx.lineTo(140, 0);
      ctx.moveTo(0, -140);
      ctx.lineTo(0, -118);
      ctx.moveTo(0, 118);
      ctx.lineTo(0, 140);
      ctx.stroke();

      // Radar scanning line
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      const sweepAngle = angleY * 2.5;
      ctx.lineTo(Math.cos(sweepAngle) * 115, Math.sin(sweepAngle) * 115);
      ctx.stroke();

      ctx.restore();

      // Project 3D cube vertices to 2D
      const projected = vertices.map((v) => {
        // Rotate X
        let y1 = v.y * Math.cos(angleX) - v.z * Math.sin(angleX);
        let z1 = v.y * Math.sin(angleX) + v.z * Math.cos(angleX);

        // Rotate Y
        let x2 = v.x * Math.cos(angleY) + z1 * Math.sin(angleY);
        let z2 = -v.x * Math.sin(angleY) + z1 * Math.cos(angleY);

        // Perspective projection
        const distance = 3.5;
        const fov = distance / (distance + z2);

        return {
          x: cx + x2 * scale * fov,
          y: cy + y1 * scale * fov,
          z: z2,
        };
      });

      // Draw edges with neon glow
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 10;

      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw glowing vertices
      ctx.fillStyle = '#4ade80';
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Main Progression Engine
  useEffect(() => {
    const intervalTime = isAccelerated ? 30 : 60;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const increment = isAccelerated ? Math.random() * 4 + 2 : Math.random() * 2 + 1;
        const next = Math.min(prev + increment, 100);

        // Spawn simulated logs at milestones
        if (prev < 15 && next >= 15 && logs.length < 1) {
          setLogs((l) => [...l, BOOT_LOGS[0].text]);
          playCyberClick();
        } else if (prev < 30 && next >= 30 && logs.length < 2) {
          setLogs((l) => [...l, BOOT_LOGS[1].text]);
          playCyberClick();
        } else if (prev < 45 && next >= 45 && logs.length < 3) {
          setLogs((l) => [...l, BOOT_LOGS[2].text]);
          playCyberBeep(680, 'sine', 0.05, 0.04);
        } else if (prev < 60 && next >= 60 && logs.length < 4) {
          setLogs((l) => [...l, BOOT_LOGS[3].text]);
          playCyberClick();
        } else if (prev < 75 && next >= 75 && logs.length < 5) {
          setLogs((l) => [...l, BOOT_LOGS[4].text]);
          playDataBurst();
        } else if (prev < 88 && next >= 88 && logs.length < 6) {
          setLogs((l) => [...l, BOOT_LOGS[5].text]);
          playCyberClick();
        } else if (prev < 96 && next >= 96 && logs.length < 7) {
          setLogs((l) => [...l, BOOT_LOGS[6].text]);
          playCyberBeep(920, 'sine', 0.08, 0.05);
        }

        // Phase transitions
        if (next >= 40 && next < 85 && phase === 'boot') {
          setPhase('decrypt');
        } else if (next >= 85 && phase !== 'warp') {
          setPhase('warp');
          rotationRef.current.speed = 0.06; // Spin up 3D cube!
          playCyberWarpSweep();
        } else if (next >= 100) {
          clearInterval(progressTimer);
          playAccessGranted();
          setTimeout(() => {
            onComplete();
          }, 850);
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [isAccelerated, phase, logs.length, onComplete]);

  // Audio visualizer spectrum jitter
  useEffect(() => {
    const spectrumInterval = setInterval(() => {
      setSpectrumBars(Array.from({ length: 14 }, () => Math.floor(Math.random() * 85 + 15)));
    }, 120);
    return () => clearInterval(spectrumInterval);
  }, []);

  // Scrambling Title Decryption
  useEffect(() => {
    const letters = TARGET_WORD.split('');
    const interval = setInterval(() => {
      const resolvedCount = Math.floor((progress / 100) * letters.length);
      const output = letters
        .map((char, idx) => {
          if (idx < resolvedCount) return char;
          return GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
        })
        .join('');
      setScrambledTitle(output);
    }, 70);

    return () => clearInterval(interval);
  }, [progress]);

  // Accelerate on core click
  const handleCoreClick = () => {
    playDataBurst();
    setIsAccelerated(true);
    rotationRef.current.speed = 0.05;
    setProgress((p) => Math.min(p + 16, 99));
  };

  const handleSkip = () => {
    playCyberClick();
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#020503] text-emerald-400 font-mono select-none overflow-hidden p-4 sm:p-8"
    >
      {/* Background Matrix Rain Animation */}
      <MatrixRainCanvas opacity={0.3} speed={1.3} fontSize={14} />

      {/* Cyberpunk Scanlines & Vignette */}
      <div className="absolute inset-0 pointer-events-none cyber-scanlines opacity-35 z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#000000_100%)] z-0" />

      {/* Top Tactical HUD Bar */}
      <header className="relative z-10 w-full max-w-6xl flex items-center justify-between border-b border-emerald-950/80 pb-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <div className="flex flex-col">
            <span className="font-bold tracking-widest text-white text-[11px] sm:text-xs">
              CIPHER // KERNEL LAUNCHER
            </span>
            <span className="text-[10px] text-emerald-600 hidden sm:inline">
              DEPT. OF COMPUTER SCIENCE &amp; ENGINEERING • SJEC
            </span>
          </div>
        </div>

        {/* Live HUD telemetry badges */}
        <div className="flex items-center gap-4 text-[10px] text-emerald-500">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-900/60 rounded">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>FREQ: 4.80 GHz</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-900/60 rounded">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>NODE: SJEC.CSE.LOCAL</span>
          </div>

          <button
            onClick={handleToggleSound}
            title="Toggle Audio Feedback"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#06140a] hover:bg-emerald-950/80 border border-emerald-800/80 hover:border-emerald-400 rounded text-emerald-300 transition-colors"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-emerald-600" />}
            <span className="text-[10px] font-bold">{soundOn ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>
        </div>
      </header>

      {/* Center Stage: Interactive Holographic 3D Core & Decryption */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-2xl w-full">
        {/* Holographic Wireframe Core & Radar Canvas */}
        <div
          onClick={handleCoreClick}
          title="Click to Accelerate Kernel Initialization"
          className="relative cursor-pointer group flex items-center justify-center my-2"
        >
          <canvas
            ref={canvasRef}
            className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] drop-shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-transform duration-300 group-hover:scale-105"
          />

          {/* Interactive touch badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] tracking-widest text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded border border-emerald-900 group-hover:border-emerald-400 transition-colors">
              {progress >= 100 ? 'ACCESS GRANTED' : isAccelerated ? 'BOOSTING...' : '[ CLICK TO BOOST ]'}
            </span>
          </div>
        </div>

        {/* Decrypting Title with Chromatic Split Glitch */}
        <div className="relative mt-2">
          <div
            className={`text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-white drop-shadow-[0_0_35px_rgba(34,197,94,0.7)] ${
              phase === 'warp' ? 'animate-glitch-rgb text-emerald-300' : ''
            }`}
          >
            {scrambledTitle}
          </div>

          <div className="mt-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-emerald-400 font-bold uppercase">
            STUDENT ASSOCIATION // COMPUTER SCIENCE &amp; ENGINEERING
          </div>
          <div className="text-[11px] tracking-widest text-emerald-600 font-mono mt-1">
            ST JOSEPH ENGINEERING COLLEGE • MANGALURU
          </div>
        </div>

        {/* Progress HUD Bar */}
        <div className="w-full max-w-md mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{phase === 'warp' ? 'CONVERGENCE ACHIEVED' : 'INITIALIZING KERNEL'}</span>
            </span>
            <span className="text-emerald-300 font-bold text-sm">{Math.floor(progress)}%</span>
          </div>

          <div className="relative h-2 w-full bg-[#061109] border border-emerald-900 rounded overflow-hidden shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 shadow-[0_0_12px_#22c55e]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Real-time Spectrum Visualizer */}
          <div className="flex items-end justify-center gap-1.5 h-6 pt-2">
            {spectrumBars.map((height, idx) => (
              <div
                key={idx}
                className="w-1.5 bg-emerald-500/60 rounded-t transition-all duration-100"
                style={{
                  height: `${(height / 100) * 18}px`,
                  backgroundColor: progress >= 85 ? '#34d399' : '#10b981',
                }}
              />
            ))}
          </div>
        </div>

        {/* Simulated System Kernel Log Terminal */}
        <div className="w-full max-w-lg mt-4 p-2.5 bg-[#040c06]/80 border border-emerald-950 rounded text-left font-mono text-[11px] h-16 overflow-hidden flex flex-col justify-end">
          {logs.slice(-2).map((log, i) => (
            <div key={i} className="text-emerald-400/90 truncate flex items-center gap-1.5">
              <span className="text-emerald-600">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-emerald-600 animate-pulse">&gt; waiting for system handshake...</div>
          )}
        </div>
      </main>

      {/* Bottom Controls: Skip / Boost Buttons */}
      <footer className="relative z-10 w-full max-w-6xl flex items-center justify-between border-t border-emerald-950/80 pt-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-600 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>CIPHER_OS KERNEL_STABLE // 2026.1</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCoreClick}
            className="px-3 py-1.5 text-xs font-bold tracking-wider text-emerald-400 hover:text-white bg-[#06140a] hover:bg-emerald-950 border border-emerald-800 hover:border-emerald-400 rounded transition-all flex items-center gap-1.5"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>BOOST +15%</span>
          </button>

          <button
            id="bootloader-skip-btn"
            onClick={handleSkip}
            className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-emerald-400 hover:text-black bg-transparent hover:bg-emerald-400 border border-emerald-600 hover:border-emerald-400 rounded transition-all duration-200 shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
          >
            [ SKIP INTRO &gt; ]
          </button>
        </div>
      </footer>
    </motion.div>
  );
};
