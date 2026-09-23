import React, { useEffect, useRef } from 'react';

interface TopographicMeshCanvasProps {
  fullPage?: boolean;
  [key: string]: any;
}

export const TopographicMeshCanvas: React.FC<TopographicMeshCanvasProps> = ({ fullPage = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = fullPage ? window.innerWidth : (canvas.parentElement?.clientWidth || window.innerWidth);
      height = fullPage ? window.innerHeight : (canvas.parentElement?.clientHeight || window.innerHeight);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;

    const onMouseMove = (e: MouseEvent | PointerEvent) => {
      if (fullPage) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        targetMouseX = e.clientX - rect.left;
        targetMouseY = e.clientY - rect.top;
      }
      mouseX = targetMouseX;
      mouseY = targetMouseY;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('pointermove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.009;
      // Direct instant mouse tracking - zero lag
      mouseX = targetMouseX;
      mouseY = targetMouseY;
      scrollY += (targetScrollY - scrollY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Subtle radial dark gradient vignette
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.85
      );
      grad.addColorStop(0, 'rgba(8, 28, 16, 0.22)');
      grad.addColorStop(1, 'rgba(5, 8, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render flowing topographic contour wave lines across the canvas
      const linesCount = Math.max(30, Math.floor(height / 36));
      const points = Math.max(65, Math.floor(width / 22));
      const scrollPhase = (scrollY * 0.0025);

      for (let i = 0; i < linesCount; i++) {
        const lineBaseY = (height / linesCount) * (i + 0.5);
        const distFromMouseY = Math.abs(lineBaseY - mouseY);
        const isNearCursorY = distFromMouseY < 200;
        const cursorGlow = isNearCursorY ? Math.max(0, 1 - distFromMouseY / 200) : 0;

        ctx.beginPath();

        // Parabolic wave opacity curve, brightest across the middle third
        const normalizedIdx = i / linesCount;
        const baseAlpha = Math.sin(normalizedIdx * Math.PI) * 0.22 + 0.05;
        const finalAlpha = Math.min(0.65, baseAlpha + cursorGlow * 0.28);
        
        ctx.strokeStyle = `rgba(34, 197, 94, ${finalAlpha})`;
        ctx.lineWidth = 1 + cursorGlow * 0.8;

        for (let p = 0; p <= points; p++) {
          const x = (width / points) * p;

          // Multi-frequency harmonic wave deformation with scroll parallax
          const wave1 = Math.sin(p * 0.12 + time * 1.1 + i * 0.2 + scrollPhase) * 24;
          const wave2 = Math.cos(p * 0.06 - time * 0.75 + i * 0.14) * 34;
          const wave3 = Math.sin(p * 0.03 + time * 1.4 + i * 0.08) * 16;

          // Mouse cursor gravity and dynamic wave displacement
          const dx = x - mouseX;
          const dy = lineBaseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseDistFactor = Math.max(0, 1 - dist / 320);
          const mouseDisplace = Math.sin(dist * 0.03 - time * 4.2) * 26 * mouseDistFactor;

          const y = lineBaseY + wave1 + wave2 + wave3 + mouseDisplace;

          if (p === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('pointermove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [fullPage]);

  return (
    <canvas
      ref={canvasRef}
      className={`${fullPage ? 'fixed inset-0 z-0' : 'absolute inset-0 z-0'} pointer-events-none w-full h-full opacity-65`}
    />
  );
};