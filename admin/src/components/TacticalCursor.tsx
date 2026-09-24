import { useEffect, useState } from 'react';

export function TacticalCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', move);

    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[99999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          border: '1px solid rgba(74, 222, 128, 0.8)',
          borderRadius: '50%',
          boxShadow: '0 0 10px #22c55e',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 5,
            height: 5,
            background: '#4ade80',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        <span
          style={{
            position: 'absolute',
            left: 20,
            top: -18,
            color: '#4ade80',
            fontSize: 10,
            whiteSpace: 'nowrap',
            fontFamily: 'monospace',
          }}
        >
          G[25,2] • {position.x},{position.y}
        </span>
      </div>
    </div>
  );
}
