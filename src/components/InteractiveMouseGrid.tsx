import React, { useEffect, useRef } from 'react';
import { playCyberClick, playCyberWarpSweep } from '../utils/audio';

interface Pulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  color: string;
  lineWidth: number;
  axisOnly?: boolean;
}

interface RippleDistortion {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  amplitude: number;
  waveWidth: number;
  life: number;
  maxLife: number;
}

interface GridNodePulse {
  gridX: number;
  gridY: number;
  intensity: number;
  decay: number;
}

interface InteractiveMouseGridProps {
  onGridClickPulse?: (x: number, y: number) => void;
  fullPage?: boolean;
  [key: string]: any;
}

export const InteractiveMouseGrid: React.FC<InteractiveMouseGridProps> = ({ fullPage = true }) => {
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current;
    const cursorCanvas = cursorCanvasRef.current;
    if (!gridCanvas) return;
    const gridCtx = gridCanvas.getContext('2d');
    const cursorCtx = cursorCanvas ? cursorCanvas.getContext('2d') : null;
    if (!gridCtx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!gridCanvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = fullPage ? window.innerWidth : (gridCanvas.parentElement?.clientWidth || window.innerWidth);
      height = fullPage ? window.innerHeight : (gridCanvas.parentElement?.clientHeight || window.innerHeight);

      gridCanvas.width = width * dpr;
      gridCanvas.height = height * dpr;
      gridCtx.resetTransform?.();
      gridCtx.scale(dpr, dpr);

      if (cursorCanvas && cursorCtx) {
        cursorCanvas.width = width * dpr;
        cursorCanvas.height = height * dpr;
        cursorCtx.resetTransform?.();
        cursorCtx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const gridSize = 44; // Spacing between grid lines
    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isHovered = false;
    let isMouseDown = false;
    let isInteractiveHover = false;
    let lastPulseTime = 0;
    let lastMoveDistance = 0;
    let prevMoveX = -1000;
    let prevMoveY = -1000;

    const pulses: Pulse[] = [];
    const ripples: RippleDistortion[] = [];
    const activeNodes = new Map<string, GridNodePulse>();
    let rippleIdCounter = 0;

    const parent = gridCanvas.parentElement;

    const spawnRippleDistortion = (x: number, y: number) => {
      // Create expanding physical ripple that bends grid lines
      ripples.push({
        id: ++rippleIdCounter,
        x,
        y,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.75,
        speed: 9.5, // Rapid, satisfying propagation
        amplitude: 28, // Distinctive visible bending displacement
        waveWidth: 80, // Crest-to-trough width
        life: 0,
        maxLife: 70, // Lasts ~1.1 seconds before returning to perfect grid
      });

      // Secondary echo ripple with slight delay/smaller amplitude
      setTimeout(() => {
        ripples.push({
          id: ++rippleIdCounter,
          x,
          y,
          radius: 0,
          maxRadius: Math.max(width, height) * 0.55,
          speed: 8.0,
          amplitude: 14,
          waveWidth: 60,
          life: 0,
          maxLife: 55,
        });
      }, 90);
    };

    const spawnPulse = (x: number, y: number, isStrong = false) => {
      pulses.push({
        x,
        y,
        radius: 0,
        maxRadius: isStrong ? Math.max(width, height) * 0.8 : 280,
        speed: isStrong ? 8.5 : 4.5,
        alpha: isStrong ? 0.95 : 0.65,
        color: isStrong ? '#4ade80' : '#22c55e',
        lineWidth: isStrong ? 2.5 : 1.5,
      });

      // Also add axis pulses (horizontal and vertical cross lasers along the grid lines)
      pulses.push({
        x,
        y,
        radius: 0,
        maxRadius: isStrong ? 520 : 220,
        speed: isStrong ? 13 : 7,
        alpha: isStrong ? 0.85 : 0.5,
        color: '#10b981',
        lineWidth: 1.5,
        axisOnly: true,
      });

      // Trigger node flashes around origin
      const gx = Math.round(x / gridSize) * gridSize;
      const gy = Math.round(y / gridSize) * gridSize;
      for (let ox = -3; ox <= 3; ox++) {
        for (let oy = -3; oy <= 3; oy++) {
          const nx = gx + ox * gridSize;
          const ny = gy + oy * gridSize;
          const key = `${nx},${ny}`;
          activeNodes.set(key, {
            gridX: nx,
            gridY: ny,
            intensity: isStrong ? 1.0 : 0.8,
            decay: isStrong ? 0.015 : 0.03,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent | PointerEvent) => {
      let curX = e.clientX;
      let curY = e.clientY;
      if (!fullPage && parent) {
        const rect = parent.getBoundingClientRect();
        curX = e.clientX - rect.left;
        curY = e.clientY - rect.top;
      }
      targetMouseX = curX;
      targetMouseY = curY;
      // Immediately sync position to prevent cursor pointer lag
      mouseX = curX;
      mouseY = curY;
      isHovered = true;

      // Detect interactive element under pointer for dynamic cursor morphing
      try {
        const target = (e.target as HTMLElement | null) || (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null);
        isInteractiveHover = !!target?.closest('button, a, input, textarea, select, [role="button"], [tabindex], .cursor-pointer, [data-interactive]');
      } catch {
        isInteractiveHover = false;
      }

      // Calculate movement delta to trigger glowing pulses on significant motion
      const dist = Math.hypot(targetMouseX - prevMoveX, targetMouseY - prevMoveY);
      lastMoveDistance += dist;
      prevMoveX = targetMouseX;
      prevMoveY = targetMouseY;

      const now = performance.now();
      if (lastMoveDistance > 85 && now - lastPulseTime > 260) {
        spawnPulse(targetMouseX, targetMouseY, false);
        lastPulseTime = now;
        lastMoveDistance = 0;
      }
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetMouseX = -1000;
      targetMouseY = -1000;
      mouseX = -1000;
      mouseY = -1000;
      if (cursorCtx) {
        cursorCtx.clearRect(0, 0, width, height);
      }
    };

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      isMouseDown = true;
      let clickX = e.clientX;
      let clickY = e.clientY;
      if (!fullPage && parent) {
        const rect = parent.getBoundingClientRect();
        clickX -= rect.left;
        clickY -= rect.top;
      }

      // Launch ripple distortion effect bending the grid lines
      spawnRippleDistortion(clickX, clickY);
      spawnPulse(clickX, clickY, true);

      // Audio feedback for cybernetic warp effect if not clicking an interactive UI control
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, input, textarea, select, [role="button"]');
      if (!isInteractive) {
        playCyberClick();
        playCyberWarpSweep();
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    if (fullPage) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('pointermove', handleMouseMove, { passive: true });
      window.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      window.addEventListener('pointerup', handlePointerUp, { passive: true });
    } else if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('pointermove', handleMouseMove, { passive: true });
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
      parent.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointerup', handlePointerUp, { passive: true });
    }

    // Mathematical grid point displacement from active ripples
    const getDistortedPoint = (
      px: number,
      py: number
    ): { x: number; y: number; warp: number } => {
      if (ripples.length === 0) {
        return { x: px, y: py, warp: 0 };
      }

      let dispX = 0;
      let dispY = 0;
      let maxWarp = 0;

      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const dx = px - r.x;
        const dy = py - r.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.001) continue;

        const delta = dist - r.radius;
        if (Math.abs(delta) < r.waveWidth) {
          const norm = delta / r.waveWidth; // range -1 to 1
          // Sinusoidal crest and trough curve
          const sinWave = Math.sin(norm * Math.PI);
          // Hanning window smoothing to 0 at edges
          const window = 0.5 * (1 + Math.cos(norm * Math.PI));
          // Distance attenuation
          const distFade = Math.max(0, 1 - r.radius / r.maxRadius);
          const amount = sinWave * window * distFade * r.amplitude;

          dispX += (dx / dist) * amount;
          dispY += (dy / dist) * amount;
          maxWarp = Math.max(maxWarp, Math.abs(sinWave * window * distFade));
        }
      }

      return {
        x: px + dispX,
        y: py + dispY,
        warp: maxWarp,
      };
    };

    // Auto-ambient periodic light pulse from center if idle
    let idleTimer = 0;
    let time = 0;

    const render = () => {
      time += 0.016;
      idleTimer += 0.016;

      if (idleTimer > 4.5 && !isHovered) {
        const ambientX = width * 0.5 + (Math.random() - 0.5) * 160;
        const ambientY = height * 0.4 + (Math.random() - 0.5) * 120;
        spawnPulse(ambientX, ambientY, false);
        idleTimer = 0;
      }

      // Direct instantaneous mouse follow - 0 lag
      if (isHovered && targetMouseX > -500) {
        mouseX = targetMouseX;
        mouseY = targetMouseY;
      } else {
        mouseX = -1000;
        mouseY = -1000;
      }

      // Update ripple waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.life += 1;
        if (r.life >= r.maxLife || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      const ctx = gridCtx;
      ctx.clearRect(0, 0, width, height);

      const hasRipples = ripples.length > 0;
      const sampleStep = 12; // High-precision segment stepping for fluid bending curves

      // 1. Draw Base & Distorted Cyber Grid Lines
      const cols = Math.ceil(width / gridSize) + 1;
      const rows = Math.ceil(height / gridSize) + 1;

      // --- Horizontal Lines ---
      for (let r = 0; r <= rows; r++) {
        const baseY = r * gridSize;
        const distY = Math.abs(baseY - mouseY);
        const isNear = distY < 220;
        const alphaBoost = isNear ? Math.max(0, 1 - distY / 220) : 0;

        // Check if this horizontal line passes through any ripple distortion field
        const inRippleZone =
          hasRipples &&
          ripples.some((rip) => Math.abs(baseY - rip.y) < rip.radius + rip.waveWidth + 10);

        const isMajor = r % 4 === 0;
        if (!inRippleZone) {
          // Standard unwarped straight line for optimal performance
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          ctx.lineTo(width, baseY);
          if (isNear) {
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 + alphaBoost * 0.28})`;
            ctx.lineWidth = 1 + alphaBoost * 0.6;
          } else {
            ctx.strokeStyle = isMajor ? 'rgba(34, 197, 94, 0.12)' : 'rgba(16, 185, 129, 0.075)';
            ctx.lineWidth = isMajor ? 1.2 : 1;
          }
          ctx.stroke();
        } else {
          // Bent line through distortion field
          ctx.beginPath();
          let maxLineWarp = 0;

          for (let px = 0; px <= width; px += sampleStep) {
            const pt = getDistortedPoint(px, baseY);
            if (pt.warp > maxLineWarp) maxLineWarp = pt.warp;

            if (px === 0) {
              ctx.moveTo(pt.x, pt.y);
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }

          // Dynamic line glow when physically bent
          const warpGlow = Math.min(1, maxLineWarp * 1.5);
          ctx.strokeStyle = `rgba(74, 222, 128, ${0.12 + alphaBoost * 0.28 + warpGlow * 0.45})`;
          ctx.lineWidth = 1 + alphaBoost * 0.6 + warpGlow * 1.2;
          ctx.stroke();
        }
      }

      // --- Vertical Lines ---
      for (let c = 0; c <= cols; c++) {
        const baseX = c * gridSize;
        const distX = Math.abs(baseX - mouseX);
        const isNear = distX < 220;
        const alphaBoost = isNear ? Math.max(0, 1 - distX / 220) : 0;
        const isMajor = c % 4 === 0;

        const inRippleZone =
          hasRipples &&
          ripples.some((rip) => Math.abs(baseX - rip.x) < rip.radius + rip.waveWidth + 10);

        if (!inRippleZone) {
          ctx.beginPath();
          ctx.moveTo(baseX, 0);
          ctx.lineTo(baseX, height);
          if (isNear) {
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 + alphaBoost * 0.28})`;
            ctx.lineWidth = 1 + alphaBoost * 0.6;
          } else {
            ctx.strokeStyle = isMajor ? 'rgba(34, 197, 94, 0.12)' : 'rgba(16, 185, 129, 0.075)';
            ctx.lineWidth = isMajor ? 1.2 : 1;
          }
          ctx.stroke();
        } else {
          // Bent line through distortion field
          ctx.beginPath();
          let maxLineWarp = 0;

          for (let py = 0; py <= height; py += sampleStep) {
            const pt = getDistortedPoint(baseX, py);
            if (pt.warp > maxLineWarp) maxLineWarp = pt.warp;

            if (py === 0) {
              ctx.moveTo(pt.x, pt.y);
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }

          const warpGlow = Math.min(1, maxLineWarp * 1.5);
          ctx.strokeStyle = `rgba(74, 222, 128, ${0.1 + alphaBoost * 0.25 + warpGlow * 0.45})`;
          ctx.lineWidth = 1 + alphaBoost * 0.6 + warpGlow * 1.2;
          ctx.stroke();
        }
      }

      // 2. Render and Update Expanding Glowing Light Pulses & Shockwaves
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += p.speed;
        p.alpha -= 0.012;

        if (p.alpha <= 0 || p.radius >= p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.save();
        if (p.axisOnly) {
          // Laser beam pulses along grid axes
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.lineWidth;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;

          // Horizontal laser segments
          ctx.beginPath();
          ctx.moveTo(p.x - p.radius, p.y);
          ctx.lineTo(p.x + p.radius, p.y);
          // Vertical laser segments
          ctx.moveTo(p.x, p.y - p.radius);
          ctx.lineTo(p.x, p.y + p.radius);
          ctx.stroke();
        } else {
          // Circular shockwave / light pulse
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.lineWidth;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 16;
          ctx.stroke();

          // Subtle secondary inner echo ring
          if (p.radius > 20) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.globalAlpha = p.alpha * 0.45;
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // 3. Grid Intersection Dots & Interactive Crosshairs (distorted along with the grid)
      const glowRadius = 240;

      for (let c = 0; c <= cols; c++) {
        const baseX = c * gridSize;
        for (let r = 0; r <= rows; r++) {
          const baseY = r * gridSize;

          // Get dynamically bent position of this intersection node
          const pt = getDistortedPoint(baseX, baseY);
          const nodeX = pt.x;
          const nodeY = pt.y;

          const dx = nodeX - mouseX;
          const dy = nodeY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Check if any light pulse is currently passing over this node
          let pulseBonus = 0;
          for (let pi = 0; pi < pulses.length; pi++) {
            const p = pulses[pi];
            const pdist = Math.hypot(nodeX - p.x, nodeY - p.y);
            const ringDiff = Math.abs(pdist - p.radius);
            if (ringDiff < gridSize * 0.85) {
              pulseBonus = Math.max(pulseBonus, (1 - ringDiff / (gridSize * 0.85)) * p.alpha);
            }
          }

          // Active node key
          const key = `${baseX},${baseY}`;
          const nodePulse = activeNodes.get(key);
          let extraIntensity = 0;
          if (nodePulse) {
            extraIntensity = nodePulse.intensity;
            nodePulse.intensity -= nodePulse.decay;
            if (nodePulse.intensity <= 0) {
              activeNodes.delete(key);
            }
          }

          const proximityFactor = Math.max(0, 1 - dist / glowRadius);
          const totalIntensity = Math.min(
            1,
            proximityFactor + pulseBonus * 1.2 + extraIntensity + pt.warp * 0.8
          );

          if (totalIntensity > 0.08) {
            // Bright reactive illuminated node with glow
            ctx.save();
            const crossSize = 3 + totalIntensity * 3.5;
            ctx.strokeStyle = `rgba(74, 222, 128, ${Math.min(1, totalIntensity * 1.25)})`;
            ctx.lineWidth = 1.2;
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = totalIntensity * 14;

            // Draw precision crosshair '+' at intersection
            ctx.beginPath();
            ctx.moveTo(nodeX - crossSize, nodeY);
            ctx.lineTo(nodeX + crossSize, nodeY);
            ctx.moveTo(nodeX, nodeY - crossSize);
            ctx.lineTo(nodeX, nodeY + crossSize);
            ctx.stroke();

            // Center bright core dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, 1.2 + totalIntensity * 1.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          } else {
            // Faint default intersection dot
            ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
            ctx.fillRect(nodeX - 1, nodeY - 1, 2, 2);
          }
        }
      }

      // 4. Cursor Reticle & Digital Coordinates HUD (Drawn on top-level overlay canvas at z-[99999])
      const cCtx = cursorCtx || ctx;
      if (cursorCtx) {
        cursorCtx.clearRect(0, 0, width, height);
      }

      if (isHovered && mouseX > -500 && mouseY > -500 && mouseX < width && mouseY < height) {
        cCtx.save();
        // Snapped grid target coordinates
        const snapX = Math.round(mouseX / gridSize) * gridSize;
        const snapY = Math.round(mouseY / gridSize) * gridSize;

        // Snapped node box outline (subtle guide)
        cCtx.strokeStyle = isInteractiveHover ? 'rgba(74, 222, 128, 0.45)' : 'rgba(34, 197, 94, 0.25)';
        cCtx.lineWidth = 1;
        cCtx.strokeRect(snapX - gridSize / 2, snapY - gridSize / 2, gridSize, gridSize);

        // Smooth cursor target circle with pulsing radar ring
        const reticlePulse = (Math.sin(time * 6) + 1) * 0.5;
        const baseRadius = isMouseDown ? 9 : isInteractiveHover ? 15 : 12;
        const currentRadius = baseRadius + (isMouseDown ? 0 : reticlePulse * 2.5);

        cCtx.strokeStyle = isMouseDown ? '#86efac' : isInteractiveHover ? '#4ade80' : '#22c55e';
        cCtx.lineWidth = isMouseDown ? 2 : isInteractiveHover ? 1.75 : 1.4;
        cCtx.shadowColor = '#22c55e';
        cCtx.shadowBlur = isMouseDown ? 18 : isInteractiveHover ? 14 : 10;
        cCtx.beginPath();
        cCtx.arc(mouseX, mouseY, currentRadius, 0, Math.PI * 2);
        cCtx.stroke();

        // 4 Precision crosshair ticks extending outward
        const tickInner = currentRadius + 3;
        const tickOuter = currentRadius + (isInteractiveHover ? 9 : 7);
        cCtx.lineWidth = 1.2;
        cCtx.beginPath();
        // Horizontal
        cCtx.moveTo(mouseX - tickOuter, mouseY);
        cCtx.lineTo(mouseX - tickInner, mouseY);
        cCtx.moveTo(mouseX + tickInner, mouseY);
        cCtx.lineTo(mouseX + tickOuter, mouseY);
        // Vertical
        cCtx.moveTo(mouseX, mouseY - tickOuter);
        cCtx.lineTo(mouseX, mouseY - tickInner);
        cCtx.moveTo(mouseX, mouseY + tickInner);
        cCtx.lineTo(mouseX, mouseY + tickOuter);
        cCtx.stroke();

        // Target Lock-On brackets when hovering buttons / interactive links
        if (isInteractiveHover) {
          const bSize = currentRadius + 5;
          const bLen = 4;
          cCtx.lineWidth = 1.5;
          cCtx.strokeStyle = '#86efac';
          cCtx.beginPath();
          // Top-left
          cCtx.moveTo(mouseX - bSize, mouseY - bSize + bLen);
          cCtx.lineTo(mouseX - bSize, mouseY - bSize);
          cCtx.lineTo(mouseX - bSize + bLen, mouseY - bSize);
          // Top-right
          cCtx.moveTo(mouseX + bSize - bLen, mouseY - bSize);
          cCtx.lineTo(mouseX + bSize, mouseY - bSize);
          cCtx.lineTo(mouseX + bSize, mouseY - bSize + bLen);
          // Bottom-left
          cCtx.moveTo(mouseX - bSize, mouseY + bSize - bLen);
          cCtx.lineTo(mouseX - bSize, mouseY + bSize);
          cCtx.lineTo(mouseX - bSize + bLen, mouseY + bSize);
          // Bottom-right
          cCtx.moveTo(mouseX + bSize - bLen, mouseY + bSize);
          cCtx.lineTo(mouseX + bSize, mouseY + bSize);
          cCtx.lineTo(mouseX + bSize, mouseY + bSize - bLen);
          cCtx.stroke();
        }

        // Center pinpoint target dot (replaces mouse cursor arrow with 100% precision)
        cCtx.shadowBlur = 10;
        cCtx.shadowColor = '#22c55e';
        cCtx.fillStyle = '#4ade80';
        cCtx.beginPath();
        cCtx.arc(mouseX, mouseY, isMouseDown ? 3.5 : 2.5, 0, Math.PI * 2);
        cCtx.fill();

        // Pure white core pinpoint dot for razor precision
        cCtx.fillStyle = '#ffffff';
        cCtx.beginPath();
        cCtx.arc(mouseX, mouseY, 1.2, 0, Math.PI * 2);
        cCtx.fill();

        // Digital coordinates / status HUD tag
        cCtx.font = '9px monospace';
        cCtx.fillStyle = isInteractiveHover ? '#86efac' : 'rgba(74, 222, 128, 0.85)';
        cCtx.shadowBlur = 0;
        const statusText = isMouseDown
          ? 'EXEC // PULSE'
          : isInteractiveHover
          ? 'LOCK // CLICK'
          : `G[${Math.round(snapX / gridSize)},${Math.round(snapY / gridSize)}] • ${Math.round(mouseX)},${Math.round(mouseY)}`;
        cCtx.fillText(statusText, mouseX + 16, mouseY - 12);

        cCtx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (fullPage) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('pointermove', handleMouseMove);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
      } else if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('pointermove', handleMouseMove);
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
        parent.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
      }
    };
  }, [fullPage]);

  return (
    <>
      {/* Background Cyber Grid & Shockwaves (behind cards) */}
      <canvas
        ref={gridCanvasRef}
        className={`${fullPage ? 'fixed inset-0 z-0' : 'absolute inset-0 z-0'} pointer-events-none w-full h-full`}
      />

      {/* Foreground Cyber Pointer HUD (at z-[99999] floating above all cards, buttons, and modals) */}
      {fullPage && (
        <canvas
          ref={cursorCanvasRef}
          className="fixed inset-0 z-[99999] pointer-events-none w-full h-full"
        />
      )}
    </>
  );
};