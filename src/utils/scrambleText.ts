import { useState, useEffect } from 'react';

const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#*+-<>=~$@%&!?ΨΣΦΩλπΔ∇';

export function useScrambleText(
  finalText: string,
  trigger = true,
  duration = 800,
  cycles = 12
) {
  const [displayText, setDisplayText] = useState(finalText);

  useEffect(() => {
    if (!trigger) {
      setDisplayText(finalText);
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;
    let iteration = 0;
    const maxIterations = Math.max(finalText.length, cycles);
    const stepTime = duration / maxIterations;

    intervalId = setInterval(() => {
      setDisplayText(() => {
        return finalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return finalText[index];
            }
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration >= maxIterations) {
        clearInterval(intervalId);
        setDisplayText(finalText);
      }
    }, stepTime);

    return () => clearInterval(intervalId);
  }, [finalText, trigger, duration, cycles]);

  return displayText;
}

export function scrambleOnce(str: string): string {
  return str
    .split('')
    .map((c) => (c === ' ' ? ' ' : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]))
    .join('');
}
