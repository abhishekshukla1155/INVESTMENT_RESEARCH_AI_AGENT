'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

/**
 * @file page.js
 * @description Premium minimal Privacy Policy page for INVESTOR AI.
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030507] text-[#f8fafc] flex flex-col justify-between font-sans selection:bg-[#00D09C] selection:text-[#030507]">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>

      <header className="border-b border-white/5 bg-[#030507]/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/5 rounded-xl">
              <span className="absolute left-[3px] top-[3px] w-3 h-5 bg-[#00D09C] rounded-sm transform rotate-12"></span>
              <span className="absolute right-[3px] bottom-[3px] w-3 h-5 bg-sky-500 rounded-sm transform -rotate-12 mix-blend-screen"></span>
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              INVESTOR<span className="text-[#00D09C]">AI</span>
            </span>
          </Link>
          <Link 
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 border border-white/5 hover:border-white/10 rounded-xl transition-all font-mono uppercase tracking-wider"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto py-16 px-6 z-10 space-y-8 text-left">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-[#00D09C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Terminal</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#00D09C]/5 border border-[#00D09C]/10 text-[#00D09C] text-[10px] font-mono tracking-widest uppercase px-3.5 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5" /> SECURITY & TRANSPARENCY
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Privacy Policy & Disclosures</h1>
          <p className="text-xs font-mono text-slate-500">Last updated: June 2026</p>
        </div>

        <div className="h-px bg-white/5"></div>

        <div className="space-y-6 text-slate-400 text-xs md:text-sm leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-white font-bold text-base">1. Platform Scope & Purpose</h3>
            <p>
              INVESTOR AI is an educational multi-agent research dashboard built to demonstrate advanced AI orchestrations. It does not provide real investment or advisory services. The recommendations generated (INVEST, WATCH, PASS) are parsed using rule-based scorers and LLM analysis grounded in search parameters.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base">2. Shared Research Context Cache</h3>
            <p>
              To maintain performance thresholds and prevent redundant endpoint execution, search contexts (Tavily Search scrapes) and fundamental stock metrics (Yahoo Finance queries) are collected once and shared across all active sub-agents (Bull, Bear, CIO). No search records or company queries are shared with unauthorized third-parties.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-white font-bold text-base">3. Cookie & Session Storage</h3>
            <p>
              Authentication tokens and mock user credentials are stored exclusively in client-side localStorage. This session state is used only to personalize navigation bars and displays, and is never transmitted to external analytics providers.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-600">
        <p>© 2026 INVESTOR AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
