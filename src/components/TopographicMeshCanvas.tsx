import React, { useEffect, useRef } from 'react';

export const TopographicMeshCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', onMouseMove);

    let time = 0;
    const linesCount = 28;

    const render = () => {
      time += 0.008;
      // Smooth lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Radial dark vignette around canvas
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.75
      );
      grad.addColorStop(0, 'rgba(10, 30, 18, 0.35)');
      grad.addColorStop(1, 'rgba(5, 8, 6, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render topographic contour lines
      ctx.lineWidth = 1;

      for (let i = 0; i < linesCount; i++) {
        const lineBaseY = (height / linesCount) * (i + 0.5);
        ctx.beginPath();

        const alpha = Math.sin((i / linesCount) * Math.PI) * 0.22 + 0.05;
        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;

        const points = 60;
        for (let p = 0; p <= points; p++) {
          const x = (width / points) * p;

          // Perlin-like multi-frequency sine deformation
          const wave1 = Math.sin(p * 0.15 + time + i * 0.2) * 22;
          const wave2 = Math.cos(p * 0.08 - time * 0.7 + i * 0.15) * 35;
          const wave3 = Math.sin(p * 0.04 + time * 1.2) * 15;

          // Mouse cursor gravity ripple
          const dx = x - mouseX;
          const dy = lineBaseY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseDistFactor = Math.max(0, 1 - dist / 320);
          const mouseDisplace = Math.sin(dist * 0.03 - time * 4) * 25 * mouseDistFactor;

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

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full opacity-60"
    />
  );
};
