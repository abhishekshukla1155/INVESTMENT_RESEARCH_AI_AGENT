'use client';

import React, { useState, useRef } from 'react';
import SearchBox from '../components/SearchBox';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import { analyzeCompany } from '../api/apiHelper';
import { 
  Globe,
  Search, 
  BarChart3, 
  Scale,
  Award,
  Menu,
  X,
  Mail,
  ArrowRight
} from 'lucide-react';

/**
 * @file page.js
 * @description Premium landing page for INVESTOR AI — Multi-Agent Investment Research Platform.
 *
 * DESIGN PHILOSOPHY:
 * — Every nav link goes somewhere real (existing section on this page or a real URL).
 * — No fabricated statistics.
 * — Hero copy communicates the unique multi-agent architecture within 5 seconds.
 * — Footer contains only truthful links.
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchSectionRef = useRef(null);
  const howItWorksRef = useRef(null);
  const resultRef = useRef(null);

  const scrollToSearch = (e) => {
    e?.preventDefault();
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setMobileMenuOpen(false);
  };

  const scrollToHowItWorks = (e) => {
    e?.preventDefault();
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const data = await analyzeCompany(companyName);
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030507] text-[#f8fafc] flex flex-col font-sans selection:bg-[#00D09C] selection:text-[#030507]">

      {/* ─── Background Ambience ─────────────────────────────────────────── */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D09C]/4 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-sky-500/4 rounded-full blur-[160px] pointer-events-none z-0 animate-pulse-slow [animation-delay:4s]" />

      {/* ─── Navbar ──────────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 bg-[#030507]/85 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/8 rounded-xl overflow-hidden">
              <span className="absolute left-[3px] top-[3px] w-3 h-5 bg-[#00D09C] rounded-sm transform rotate-12 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute right-[3px] bottom-[3px] w-3 h-5 bg-rose-500 rounded-sm transform -rotate-12 mix-blend-screen group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              INVESTOR<span className="text-[#00D09C]">AI</span>
            </span>
          </a>

          {/* Desktop Nav — only items that scroll to real sections */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={scrollToHowItWorks}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-mono cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={scrollToSearch}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-mono cursor-pointer"
            >
              AI Analysis
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-mono flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              GitHub
            </a>
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer font-mono uppercase tracking-wider"
            >
              Sign In
            </a>
            <button
              onClick={scrollToSearch}
              className="bg-[#00D09C] hover:bg-[#00D09C]/90 text-[#030507] text-xs font-black px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(0,208,156,0.2)] hover:shadow-[0_0_30px_rgba(0,208,156,0.35)] cursor-pointer font-mono uppercase tracking-wider flex items-center gap-1.5"
            >
              Analyze Company
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#030507]/98 border-b border-white/5 backdrop-blur-md p-6 space-y-5 md:hidden animate-fade-in z-50">
            <div className="flex flex-col gap-4">
              <button onClick={scrollToHowItWorks} className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest text-left cursor-pointer">
                How It Works
              </button>
              <button onClick={scrollToSearch} className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest text-left cursor-pointer">
                AI Analysis
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                GitHub
              </a>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center gap-3">
              <a href="/login" className="flex-1 text-center text-xs font-bold text-slate-300 hover:text-white py-3 border border-white/8 rounded-xl font-mono uppercase tracking-wider transition-colors">
                Sign In
              </a>
              <button onClick={scrollToSearch} className="flex-1 text-center bg-[#00D09C] text-[#030507] text-xs font-black py-3 rounded-xl font-mono uppercase tracking-wider">
                Analyze
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-12 z-10">

        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <section className="text-center pt-24 pb-16 max-w-4xl mx-auto space-y-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00D09C]/5 border border-[#00D09C]/15 text-[#00D09C] text-[10px] font-mono tracking-widest uppercase px-4 py-1.5 rounded-full animate-fade-in shadow-[0_0_20px_rgba(0,208,156,0.04)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-pulse" />
            Multi-Agent Investment Intelligence
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            <span className="text-gradient-white">An AI Investment</span>
            <br />
            <span className="text-gradient-green">Committee, Not Just One Model</span>
          </h1>

          {/* Sub-heading — unique value prop in two lines */}
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Enter any company and watch a Bull Analyst, Bear Analyst, and Chief Investment Officer
            independently research, debate, and produce an{' '}
            <span className="text-white font-semibold">INVEST / WATCH / PASS</span> recommendation —
            powered by real-time web data and Gemini AI.
          </p>

          {/* Search Box — primary CTA */}
          <div ref={searchSectionRef} className="pt-4 scroll-mt-24">
            <SearchBox onSearch={handleSearch} isLoading={isLoading} />
            <p className="text-[11px] text-slate-600 mt-3 font-mono">
              Try: Apple · Tesla · Nvidia · Infosys · Samsung
            </p>
          </div>

        </section>

        {/* ─── Architecture Chips ───────────────────────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-20 max-w-5xl mx-auto">
          {[
            { label: 'Real-time Research', sub: 'Tavily web search', icon: <Globe className="w-4 h-4 text-[#00D09C]" /> },
            { label: 'Live Financial Data', sub: 'Yahoo Finance metrics', icon: <BarChart3 className="w-4 h-4 text-sky-400" /> },
            { label: 'Bull vs Bear Debate', sub: '2 adversarial AI agents', icon: <Scale className="w-4 h-4 text-purple-400" /> },
            { label: 'CIO Final Verdict', sub: 'INVEST · WATCH · PASS', icon: <Award className="w-4 h-4 text-amber-400" /> },
          ].map((chip, i) => (
            <div
              key={i}
              className="bg-[#050914]/50 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 glass-panel-hover"
            >
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/5 self-start">
                {chip.icon}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{chip.label}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{chip.sub}</div>
              </div>
            </div>
          ))}
        </section>

        {/* ─── Result Area ──────────────────────────────────────────────── */}
        <section ref={resultRef} id="analysis" className="scroll-mt-24 min-h-[60px] pb-16">
          {isLoading && (
            <div className="py-12">
              <Loader />
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto bg-rose-950/10 border border-rose-500/20 p-6 rounded-2xl flex items-start gap-4 text-rose-200 animate-fade-in">
              <span className="text-2xl shrink-0">⚠️</span>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider font-mono">Analysis Failed</h4>
                <p className="text-xs text-rose-300/80 mt-1.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && result && (
            <div className="animate-fade-in-up">
              <ResultCard result={result} />
            </div>
          )}
        </section>

        {/* ─── How It Works ─────────────────────────────────────────────── */}
        <section ref={howItWorksRef} id="how-it-works" className="py-20 border-t border-white/5 scroll-mt-24">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-[10px] font-bold text-[#00D09C] uppercase tracking-widest font-mono">
              Architecture
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              How INVESTOR AI Works
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Five coordinated steps run sequentially every time you analyze a company.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Research Agent',
                desc: 'Scrapes real-time web news and financial metrics from Tavily and Yahoo Finance in a single parallel call.',
                icon: <Search className="w-5 h-5 text-[#00D09C]" />,
                accent: 'text-[#00D09C]'
              },
              {
                step: '02',
                title: 'Financial Intelligence',
                desc: 'Extracts revenue growth, profit margins, debt ratios, P/E multiples, and market cap from live market data.',
                icon: <BarChart3 className="w-5 h-5 text-sky-400" />,
                accent: 'text-sky-400'
              },
              {
                step: '03',
                title: 'Bull vs Bear Debate',
                desc: 'A Bull Analyst builds the buy case. A Bear Analyst argues every risk. Both receive the same data — opposite mandates.',
                icon: <Scale className="w-5 h-5 text-purple-400" />,
                accent: 'text-purple-400'
              },
              {
                step: '04',
                title: 'Investment Committee',
                desc: 'The Chief Investment Officer reads both reports, evaluates argument quality, and issues INVEST / WATCH / PASS.',
                icon: <Award className="w-5 h-5 text-amber-400" />,
                accent: 'text-amber-400'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#050914]/40 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Step watermark */}
                <div className="absolute -right-1 -bottom-1 text-6xl font-black text-white/[0.025] font-mono select-none group-hover:text-white/[0.04] transition-colors duration-300">
                  {item.step}
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/5">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-bold text-slate-700 group-hover:${item.accent} transition-colors`}>
                    STEP {item.step}
                  </span>
                </div>

                <div className="space-y-2 relative z-10">
                  <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#030507] px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

          {/* Brand column */}
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start">
              <div className="relative w-7 h-7 flex items-center justify-center bg-slate-900 border border-white/8 rounded-lg overflow-hidden">
                <span className="absolute left-[2px] top-[2px] w-2.5 h-4 bg-[#00D09C] rounded-sm transform rotate-12" />
                <span className="absolute right-[2px] bottom-[2px] w-2.5 h-4 bg-rose-500 rounded-sm transform -rotate-12 mix-blend-screen" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                INVESTOR<span className="text-[#00D09C]">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Multi-Agent Investment Research Platform. Real-time data. Adversarial AI debate.
              Institutional-grade decisions.
            </p>
          </div>

          {/* Social links + legal — only real ones */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              LinkedIn
            </a>
            <a
              href="mailto:contact@investorai.dev"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Contact
            </a>
            <a
              href="/privacy"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </a>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-700 font-mono">
          <span>© 2026 INVESTOR AI. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Next.js · LangChain · Gemini · Tavily · Yahoo Finance
          </span>
        </div>
      </footer>

    </div>
  );
}
