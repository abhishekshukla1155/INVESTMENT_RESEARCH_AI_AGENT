'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight, Github } from 'lucide-react';

/**
 * @file page.js (Login)
 * @description Premium authentication page for INVESTOR AI.
 * Supports Google OAuth and Email/Password sign-in.
 * Dark institutional theme — minimal, no illustrations.
 */
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentials = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[#030507] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#00D09C]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-sky-500/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="w-full max-w-md z-10">
        
        {/* Logo header */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
              <span className="absolute left-[3px] top-[3px] w-3 h-5 bg-[#00D09C] rounded-sm transform rotate-12" />
              <span className="absolute right-[3px] bottom-[3px] w-3 h-5 bg-rose-500 rounded-sm transform -rotate-12 mix-blend-screen" />
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              INVESTOR<span className="text-[#00D09C]">AI</span>
            </span>
          </a>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {mode === 'signin'
              ? 'Sign in to access your investment research dashboard.'
              : 'Join INVESTOR AI and analyze any company in seconds.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#050914]/80 border border-white/8 rounded-3xl p-8 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] space-y-5">
          
          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[11px] text-slate-600 font-mono uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-950/60 border border-white/8 hover:border-white/15 focus:border-[#00D09C]/50 text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-slate-950/60 border border-white/8 hover:border-white/15 focus:border-[#00D09C]/50 text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00D09C] hover:bg-[#00D09C]/90 text-[#030507] font-bold py-3 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,208,156,0.2)] hover:shadow-[0_0_30px_rgba(0,208,156,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-xs text-slate-500">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="text-[#00D09C] font-semibold hover:underline cursor-pointer"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-xs text-slate-600">
          <a href="/" className="hover:text-slate-400 transition-colors">
            ← Back to INVESTOR AI
          </a>
        </p>

      </div>
    </div>
  );
}
