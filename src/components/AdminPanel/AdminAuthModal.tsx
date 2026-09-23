import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { playAccessGranted, playCyberClick } from '../../utils/audio';

interface AdminAuthModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passcode.trim()) {
      setError(true);
      setErrorMessage('Please enter the admin passcode.');
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passcode: passcode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (!data.token) {
        throw new Error('Authentication token was not returned');
      }

      try {
        playAccessGranted();
      } catch {
        // Ignore audio errors
      }

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('cipher_admin_locked');

        if (remember) {
          localStorage.setItem('cipher_admin_token', data.token);
        } else {
          sessionStorage.setItem('cipher_admin_token', data.token);
        }

        sessionStorage.setItem('cipher_admin_session', 'true');
        sessionStorage.setItem('cipher_admin_auth', 'true');
      }

      onSuccess();
    } catch (error) {
      setError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to authenticate with the backend.'
      );

      try {
        const AudioCtx =
          window.AudioContext ||
          (
            window as unknown as {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, ctx.currentTime);
          osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.25
          );

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        }
      } catch {
        playCyberClick();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono text-emerald-100">
      <div className="relative max-w-md w-full bg-[#050c07] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-emerald-900/80 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <div className="text-[10px] tracking-widest text-emerald-400 uppercase font-bold">
                // SECURITY CLEARANCE
              </div>
              <div className="text-sm font-bold text-white tracking-wide">
                CIPHER ADMIN CONSOLE
              </div>
            </div>
          </div>

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <p className="text-xs text-emerald-400/80 font-sans mb-6 leading-relaxed">
          Authorized personnel only. Please verify your administrative
          credentials to manage club events, roster, and member applications.
        </p>

        {error && (
          <div className="mb-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/80 border border-red-600/80 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                ADMIN PASSCODE
              </span>
            </label>

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin passcode"
                autoFocus
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg bg-black/80 border border-emerald-900 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm text-emerald-100 placeholder-emerald-800 font-mono tracking-wider transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-300 p-1"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-emerald-400/90 hover:text-emerald-200">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-emerald-800 bg-black text-emerald-500 focus:ring-emerald-500"
              />
              <span>Remember authentication</span>
            </label>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE & ENTER'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                playCyberClick();
                onCancel();
              }}
              className="w-full py-2 text-xs text-emerald-600 hover:text-emerald-400 transition-colors text-center cursor-pointer font-sans"
            >
              Return to Public Website
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};