import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, ShieldAlert, Sparkles, Key, Check } from 'lucide-react';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { playCyberClick, playAccessGranted } from '../utils/audio';

interface RootAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RootAccessModal: React.FC<RootAccessModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const secretKey = 'CIPHER{SJEC_CSE_KERNEL_BYPASS_CONFIRMED_2026}';

  const handleCopyKey = () => {
    playCyberClick();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(secretKey)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Clipboard access blocked in sandboxed iframe
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl font-mono select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-lg w-full bg-[#040905] border-2 border-emerald-500 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.5)] text-emerald-300"
      >
        {/* Matrix rain falling inside */}
        <div className="absolute inset-0 z-0">
          <MatrixRainCanvas opacity={0.3} speed={1.4} fontSize={13} />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Top icon */}
          <div className="w-14 h-14 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_#22c55e] mb-4">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>

          {/* Root access header (exact as in video 01:07) */}
          <h2 className="text-3xl sm:text-4xl font-black tracking-widest text-emerald-400 text-glow">
            ROOT ACCESS
          </h2>

          <div className="mt-4 p-4 bg-black/70 border border-emerald-900 rounded-lg text-left w-full space-y-2 text-xs sm:text-sm">
            <p className="text-emerald-300 font-bold">
              &gt; You found the backdoor. Welcome to the inner circle of CIPHER.
            </p>
            <p className="text-emerald-500 font-sans">
              The real code was inside you all along.
            </p>
          </div>

          {/* Secret flag token */}
          <div className="mt-4 w-full p-3 bg-[#06140a] border border-emerald-800 rounded flex items-center justify-between text-xs">
            <span className="font-mono text-emerald-400 truncate max-w-[280px]">
              {secretKey}
            </span>
            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white px-2 py-1 rounded bg-emerald-950 border border-emerald-800"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
              <span>{copied ? 'SAVED' : 'KEY'}</span>
            </button>
          </div>

          {/* Close connection button (matches video at 01:07) */}
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="mt-6 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-white border border-emerald-700 hover:border-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 rounded transition-all shadow-sm"
          >
            [ CLOSE CONNECTION ]
          </button>
        </div>
      </motion.div>
    </div>
  );
};
