'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, Key, Mail, Lock, Sparkles, LogIn } from 'lucide-react';
import Link from 'next/link';

/**
 * @file page.js
 * @description Premium minimal login/registration screen for the INVESTOR AI platform.
 * Fully interactive simulated authentication flow to support recruiter inspection.
 */
export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in and redirect
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      router.push('/');
    }
  }, [router]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required credentials.');
      return;
    }
    
    if (activeTab === 'signup' && !name.trim()) {
      setError('Please enter your full name to register.');
      return;
    }

    setIsLoading(true);

    // Simulate short network delay for natural feel
    setTimeout(() => {
      const mockSession = {
        name: activeTab === 'signup' ? name.trim() : email.split('@')[0],
        email: email.trim(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`
      };
      
      localStorage.setItem('userSession', JSON.stringify(mockSession));
      setIsLoading(false);
      router.push('/');
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockSession = {
        name: 'Guest Investor',
        email: 'investor.guest@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest'
      };
      localStorage.setItem('userSession', JSON.stringify(mockSession));
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#030507] text-[#f8fafc] flex flex-col justify-center items-center px-6 relative selection:bg-[#00D09C] selection:text-[#030507]">
      {/* Background glowing blurs */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#00D09C]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-[#00D09C] transition-colors duration-250 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

      {/* Main card */}
      <div className="w-full max-w-md bg-[#050914]/80 border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-10 space-y-6">
        {/* Top subtle glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D09C] to-transparent"></div>
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="relative w-10 h-10 flex items-center justify-center bg-slate-900 border border-white/5 rounded-xl">
              <span className="absolute left-[4px] top-[4px] w-4.5 h-6 bg-[#00D09C] rounded-sm transform rotate-12"></span>
              <span className="absolute right-[4px] bottom-[4px] w-4.5 h-6 bg-sky-500 rounded-sm transform -rotate-12 mix-blend-screen"></span>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">
              INVESTOR<span className="text-[#00D09C]">AI</span>
            </h2>
            <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">Institutional Access Terminal</p>
          </div>
        </div>

        {/* Custom Tab Selector */}
        <div className="flex bg-slate-950 border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('signin'); setError(''); }}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'signin' 
                ? 'bg-[#00D09C]/10 border border-[#00D09C]/25 text-[#00D09C]' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'signup' 
                ? 'bg-[#00D09C]/10 border border-[#00D09C]/25 text-[#00D09C]' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error messaging */}
        {error && (
          <div className="bg-rose-950/15 border border-rose-500/20 px-4 py-3 rounded-xl text-xs text-rose-300 text-left flex items-start gap-2.5 animate-fade-in">
            <span className="mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {activeTab === 'signup' && (
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Full Name</label>
              <div className="relative flex items-center">
                <Sparkles className="w-4 h-4 text-slate-500 absolute left-3.5" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#00D09C]/30 transition-all font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#00D09C]/30 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#00D09C]/30 transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00D09C] hover:bg-[#00d09c]/90 text-[#030507] font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,208,156,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs font-mono uppercase tracking-wider"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#030507] border-t-transparent rounded-full animate-spin"></span>
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{activeTab === 'signin' ? 'Sign In to Terminal' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-500 uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* Google SSO Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-white/10 text-slate-300 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 text-xs font-mono uppercase tracking-wider"
        >
          {/* Custom Google Minimalist G Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.64 5.64 0 0 1 8.35 12.96a5.64 5.64 0 0 1 5.64-5.64c2.258 0 4.1.815 5.5 2.14l3.15-3.15C20.6 4.3 17.55 3 13.99 3A9.96 9.96 0 0 0 4 12.96a9.96 9.96 0 0 0 9.99 9.96c5.55 0 9.97-4.07 9.97-9.96 0-.6-.05-1.19-.16-1.675H12.24Z"
            />
          </svg>
          <span>Google single sign-on</span>
        </button>
      </div>
    </div>
  );
}
