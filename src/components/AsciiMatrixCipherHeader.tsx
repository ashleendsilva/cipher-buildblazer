import React, { useEffect, useRef, useState } from 'react';
import { playCyberClick, playCyberWarpSweep } from '../utils/audio';

// Monospace ASCII glyph set matching the user's cyberpunk terminal matrix image
const ASCII_GLYPHS = [
  '0', '1', 'C', 'I', 'P', 'H', 'E', 'R',
  '#', '%', '&', '*', '+', '=', '-', '/',
  '\\', '>', '<', '[', ']', '{', '}', '?',
  '!', '$', '^', '~', 'X', 'K', 'Z', 'V',
  'A', 'B', 'D', 'F', 'G', 'J', 'L', 'M',
  'N', 'O', 'Q', 'S', 'T', 'U', 'W', 'Y',
];

interface GlyphPoint {
  x: number;
  y: number;
  char: string;
  baseBrightness: number;
  isBrightSpark: boolean;
  sparkColor: string;
  scrambleCooldown: number;
}

export const AsciiMatrixCipherHeader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    let glyphPoints: GlyphPoint[] = [];
    let dynamicFontSize = 11;
    let time = 0;

    // Shockwave on click
    let shockwaveRadius = -1;
    let shockwaveOrigin = { x: 0, y: 0 };

    // Function to generate glyph mask for "CIPHER"
    const generateGlyphs = (w: number, h: number) => {
      if (w < 20 || h < 20) return;

      try {
        // Offscreen canvas to render text silhouette
        const offscreen = document.createElement('canvas');
        offscreen.width = w;
        offscreen.height = h;
        const offCtx = offscreen.getContext('2d');
        if (!offCtx) return;

        offCtx.clearRect(0, 0, w, h);
        offCtx.fillStyle = '#ffffff';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';

        // Dynamically calculate font size to fit container width nicely (enlarged & prominent)
        const text = 'C I P H E R';
        let letterFontSize = Math.min(w * 0.20, 168);
        offCtx.font = `900 ${letterFontSize}px 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace`;

        const measuredWidth = offCtx.measureText(text).width;
        if (measuredWidth > w * 0.95) {
          letterFontSize = letterFontSize * ((w * 0.95) / measuredWidth);
          offCtx.font = `900 ${letterFontSize}px 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace`;
        }

        offCtx.fillText(text, w / 2, h / 2);

        const imgData = offCtx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Density tuned for high visibility and crisp glyphs
        const stepY = Math.max(8, Math.round(letterFontSize / 13.2));
        const stepX = Math.max(6, Math.round(stepY * 0.70));
        dynamicFontSize = Math.max(8, Math.round(stepY * 1.0));

        // Color palette for glowing sparks (extra vibrant cyan/pure white/neon highlights)
        const sparkColors = [
          '#a5f3fc', // ultra bright cyan
          '#6ee7b7', // radiant mint
          '#a7f3d0', // mint white
          '#ffffff', // pure intense white
          '#4ade80', // vibrant neon green
          '#86efac', // glowing lime emerald
        ];

        const points: GlyphPoint[] = [];

        for (let y = 4; y < h - 4; y += stepY) {
          for (let x = 4; x < w - 4; x += stepX) {
            const idx = (y * w + x) * 4;
            const alpha = data[idx + 3];

            // If inside the letter boundary
            if (alpha > 75) {
              const char = ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
              // ~9% of glyphs are bright highlighted sparks (increased for extra brightness)
              const isSpark = Math.random() < 0.09;
              const sparkColor = sparkColors[Math.floor(Math.random() * sparkColors.length)];

              points.push({
                x,
                y,
                char,
                baseBrightness: 0.70 + Math.random() * 0.30,
                isBrightSpark: isSpark,
                sparkColor,
                scrambleCooldown: Math.floor(Math.random() * 50 + 10),
              });
            }
          }
        }

        glyphPoints = points;
      } catch {
        // Fallback gracefully if getImageData is not available
      }
    };

    let resizeRafId: number | null = null;
    const resize = () => {
      if (!canvas) return;
      const parentWidth = canvas.parentElement?.clientWidth;
      const newWidth = parentWidth && parentWidth > 50 ? parentWidth : Math.min(window.innerWidth - 32, 1080);
      const newHeight = Math.max(190, Math.min(320, Math.round(newWidth * 0.29)));

      // Avoid unnecessary canvas DOM resizing if dimension change is negligible
      if (Math.abs(newWidth - width) < 2 && Math.abs(newHeight - height) < 2 && canvas.width > 0) {
        return;
      }

      width = newWidth;
      height = newHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (typeof ctx.resetTransform === 'function') {
        ctx.resetTransform();
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.scale(dpr, dpr);

      generateGlyphs(width, height);
    };

    const debouncedResize = () => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        resize();
      });
    };

    resize();
    window.addEventListener('resize', debouncedResize);

    let resizeObserver: ResizeObserver | null = null;
    if (canvas.parentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        if (!entries || !entries.length) return;
        debouncedResize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    // Mouse & Touch events
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = clientX - rect.left;
      targetMouseY = clientY - rect.top;
      mouseX = targetMouseX;
      mouseY = targetMouseY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    const triggerClickPulse = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      shockwaveOrigin = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      shockwaveRadius = 0;
      playCyberClick();
      playCyberWarpSweep();

      // Scramble glyphs across shockwave
      glyphPoints.forEach((pt) => {
        const dist = Math.hypot(pt.x - shockwaveOrigin.x, pt.y - shockwaveOrigin.y);
        if (dist < 260) {
          pt.char = ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
          pt.isBrightSpark = Math.random() < 0.25;
          pt.scrambleCooldown = 0;
        }
      });
    };

    const handleClick = (e: MouseEvent) => {
      triggerClickPulse(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setIsHovered(true);
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        triggerClickPulse(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Render loop
    const render = () => {
      time += 0.016;

      // Direct instant mouse follow
      mouseX = targetMouseX;
      mouseY = targetMouseY;

      ctx.clearRect(0, 0, width, height);

      // 1. Render Undulating Vertical Topographic Contour Lines (from reference image)
      const numLines = Math.max(50, Math.floor(width / 15));
      ctx.lineWidth = 1;

      for (let i = 0; i <= numLines; i++) {
        const baseX = (width / numLines) * i;
        ctx.beginPath();

        // Vary opacity across canvas (brighter & crisp neon)
        const lineAlpha = 0.16 + Math.sin((i / numLines) * Math.PI) * 0.22;
        ctx.strokeStyle = `rgba(52, 211, 153, ${lineAlpha})`;

        const segments = 36;
        for (let s = 0; s <= segments; s++) {
          const y = (height / segments) * s;

          // Multi-frequency wave deformation
          const wave1 = Math.sin(y * 0.024 + time * 1.3 + i * 0.22) * 15;
          const wave2 = Math.cos(y * 0.048 - time * 0.9 + i * 0.16) * 8;
          const wave3 = Math.sin((y + baseX) * 0.012 + time * 0.6) * 5;

          // Mouse distortion
          const dx = baseX - mouseX;
          const dy = y - mouseY;
          const dist = Math.hypot(dx, dy);
          const mouseDisplace =
            dist < 150 ? Math.sin(dist * 0.04 - time * 3.5) * 16 * (1 - dist / 150) : 0;

          const x = baseX + wave1 + wave2 + wave3 + mouseDisplace;

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // 2. Shockwave Update
      if (shockwaveRadius >= 0) {
        shockwaveRadius += 11;
        const shockAlpha = Math.max(0, 1 - shockwaveRadius / (width * 0.75));

        if (shockAlpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(shockwaveOrigin.x, shockwaveOrigin.y, shockwaveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(74, 222, 128, ${shockAlpha * 0.75})`;
          ctx.lineWidth = 2.2;
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 16;
          ctx.stroke();

          // Secondary inner ripple
          if (shockwaveRadius > 25) {
            ctx.beginPath();
            ctx.arc(shockwaveOrigin.x, shockwaveOrigin.y, shockwaveRadius * 0.72, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(103, 232, 249, ${shockAlpha * 0.45})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          ctx.restore();
        } else {
          shockwaveRadius = -1;
        }
      }

      // 3. Render ASCII Matrix Glyphs forming the word "CIPHER"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${dynamicFontSize}px 'JetBrains Mono', 'Fira Code', Consolas, monospace`;

      glyphPoints.forEach((pt) => {
        // Scramble animation periodically
        pt.scrambleCooldown--;
        if (pt.scrambleCooldown <= 0) {
          pt.char = ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
          // Randomly toggle bright spark status
          if (Math.random() < 0.05) {
            pt.isBrightSpark = !pt.isBrightSpark;
          }
          pt.scrambleCooldown = Math.floor(Math.random() * 45 + 15);
        }

        // Distance from cursor
        const dx = pt.x - mouseX;
        const dy = pt.y - mouseY;
        const dist = Math.hypot(dx, dy);
        const nearMouse = dist < 120;
        const mouseFactor = nearMouse ? 1 - dist / 120 : 0;

        // Shockwave impact
        let shockwaveImpact = 0;
        if (shockwaveRadius >= 0) {
          const shockDist = Math.hypot(pt.x - shockwaveOrigin.x, pt.y - shockwaveOrigin.y);
          const diff = Math.abs(shockDist - shockwaveRadius);
          if (diff < 45) {
            shockwaveImpact = 1 - diff / 45;
          }
        }

        let renderChar = pt.char;
        let color = '#4ade80';
        let alpha = pt.baseBrightness;

        if (nearMouse) {
          // Rapid scramble and high brightness when hovered
          if (Math.random() < 0.35) {
            renderChar = ASCII_GLYPHS[Math.floor(Math.random() * ASCII_GLYPHS.length)];
          }
          color = '#ffffff';
          alpha = 1.0;
        } else if (pt.isBrightSpark) {
          // Distinct glowing spark characters
          color = pt.sparkColor;
          alpha = 1.0;
        } else if (shockwaveImpact > 0) {
          color = '#67e8f9';
          alpha = 1.0;
        } else {
          // Normal matrix characters: vibrant neon green
          alpha = Math.min(1, pt.baseBrightness * 1.05 + 0.12);
          color = pt.baseBrightness > 0.72 ? '#86efac' : '#4ade80';
        }

        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, alpha + shockwaveImpact * 0.5);

        // Neon glow for characters
        ctx.shadowColor = color;
        ctx.shadowBlur = pt.isBrightSpark || nearMouse || shockwaveImpact > 0.3 ? 16 : 8;

        ctx.fillText(renderChar, pt.x, pt.y);
        ctx.restore();
      });

      // 4. Tactical Cursor Radar Reticle (seen in the bottom left of reference screenshot)
      if (isHovered && mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
        ctx.save();
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.75)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;

        // Outer reticle circle
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Fine crosshair ticks
        ctx.beginPath();
        ctx.moveTo(mouseX - 22, mouseY);
        ctx.lineTo(mouseX - 8, mouseY);
        ctx.moveTo(mouseX + 8, mouseY);
        ctx.lineTo(mouseX + 22, mouseY);
        ctx.moveTo(mouseX, mouseY - 22);
        ctx.lineTo(mouseX, mouseY - 8);
        ctx.moveTo(mouseX, mouseY + 8);
        ctx.lineTo(mouseX, mouseY + 22);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', debouncedResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-3 select-none group cursor-pointer"
      title="Interactive ASCII Matrix Header — Click or Hover to Scramble"
    >
      {/* Screen Reader and Search Engine Accessible H1 Header */}
      <h1 className="sr-only">CIPHER</h1>

      {/* Radiant ambient glow backdrop */}
      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none -z-10 scale-95" />

      {/* Main Interactive ASCII Matrix & Topographic Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto drop-shadow-[0_0_55px_rgba(34,197,94,0.7)] filter brightness-125 contrast-110 transition-transform duration-300 group-hover:scale-[1.015]"
      />

      {/* Floating Hologram Scanning Line */}
      <div className="absolute -inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-40 animate-pulse pointer-events-none" />

      {/* Interactive Micro-Tag */}
      <div className="absolute -bottom-2 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-emerald-400 bg-[#040c06]/90 px-2.5 py-0.5 rounded border border-emerald-800/80 shadow-[0_0_10px_rgba(34,197,94,0.2)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>ASCII MATRIX MESH // HOVER &amp; CLICK INTERACTIVE</span>
      </div>
    </div>
  );
};