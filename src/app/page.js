'use client';

import React, { useState, useRef, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import DebatePanel from '../components/DebatePanel';
import { analyzeCompany } from '../api/apiHelper';
import { 
  Database, 
  Globe, 
  Cpu, 
  Zap, 
  Search, 
  BarChart3, 
  Brain, 
  Sliders,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

/**
 * @file page.js
 * @description Premium SaaS Fintech landing page & dashboard for INVESTOR AI.
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const resultRef = useRef(null);

  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Scroll to the result area so the loader steps are immediately visible
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    try {
      const data = await analyzeCompany(companyName);
      setResult(data);
      // Scroll to the result once loaded
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError(err.message || 'Failed to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030507] text-[#f8fafc] flex flex-col justify-between font-sans selection:bg-[#00D09C] selection:text-[#030507]">
      
      {/* Background patterns */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D09C]/5 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow [animation-delay:4s]"></div>

      {/* Sticky Premium Navbar */}
      <header className="border-b border-white/5 bg-[#030507]/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-inner">
              <span className="absolute left-[3px] top-[3px] w-3 h-5 bg-[#00D09C] rounded-sm transform rotate-12 transition-transform duration-300 hover:scale-110"></span>
              <span className="absolute right-[3px] bottom-[3px] w-3 h-5 bg-rose-500 rounded-sm transform -rotate-12 mix-blend-screen transition-transform duration-300 hover:scale-110"></span>
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              INVESTOR<span className="text-[#00D09C]">AI</span>
            </span>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {['Our Story', 'Our AI', 'Research', 'Market Insights', 'Products', 'Team', 'News'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-semibold text-slate-400 hover:text-[#00D09C] transition-colors duration-200 uppercase tracking-widest font-mono"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <button className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition-colors cursor-pointer font-mono uppercase tracking-wider">
              Login
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer font-mono uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#030507] border-b border-white/5 p-6 space-y-4 lg:hidden animate-fade-in z-50">
            <div className="flex flex-col gap-4">
              {['Our Story', 'Our AI', 'Research', 'Market Insights', 'Products', 'Team', 'News'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest"
                >
                  {item}
                </a>
              ))}
              <div className="h-px bg-white/5 my-2"></div>
              <div className="flex items-center gap-4">
                <button className="flex-1 text-center text-xs font-bold text-slate-300 hover:text-white py-3 border border-white/5 rounded-xl">
                  Login
                </button>
                <button className="flex-1 text-center bg-[#00D09C] text-[#030507] text-xs font-bold py-3 rounded-xl">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-16 px-6 md:px-12 z-10 space-y-24">
        
        {/* Hero Section Container */}
        <section className="text-center space-y-8 max-w-4xl mx-auto py-8">
          
          <div className="inline-flex items-center gap-2 bg-[#00D09C]/5 border border-[#00D09C]/10 text-[#00D09C] text-[10px] font-mono tracking-widest uppercase px-4 py-1.5 rounded-full animate-fade-in shadow-[0_0_15px_rgba(0,208,156,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-pulse"></span>
            PRO LEVEL PORTFOLIO ANALYTICS
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-gradient-white">
            AI that works<br />
            <span className="text-gradient-green">for your investments</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            INVESTOR AI analyzes companies using advanced AI agents, real-time financial data, and market intelligence to deliver transparent investment insights.
          </p>

          {/* Embedded Search Box */}
          <div className="pt-4">
            <SearchBox onSearch={handleSearch} isLoading={isLoading} />
          </div>

        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            { metric: '2500+', desc: 'Companies Analyzed', icon: <Database className="w-5 h-5 text-[#00D09C]" /> },
            { metric: 'Real-time', desc: 'Market Research', icon: <Globe className="w-5 h-5 text-sky-400" /> },
            { metric: 'AI Powered', desc: 'Investment Analysis', icon: <Cpu className="w-5 h-5 text-purple-400" /> },
            { metric: '15s', desc: 'Average Analysis Time', icon: <Zap className="w-5 h-5 text-amber-400 animate-pulse" /> }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-[#050914]/40 border border-white/5 rounded-2xl p-5 md:p-6 space-y-3 glass-panel-hover flex flex-col items-start"
            >
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/5 shadow-inner">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <div className="text-xl md:text-2xl font-black text-white tracking-tight">{stat.metric}</div>
                <div className="text-xs text-slate-500 font-semibold uppercase font-mono tracking-wider">{stat.desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Dynamic Display Area (Ref controlled) */}
        <section ref={resultRef} className="scroll-mt-24 min-h-[100px]">
          {isLoading && (
            <div className="py-12">
              <Loader />
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto bg-rose-950/10 border border-rose-500/20 p-6 rounded-2xl flex items-start gap-4 text-rose-200 shadow-[0_15px_30px_rgba(239,68,68,0.05)] animate-fade-in">
              <span className="text-2xl mt-0.5 shrink-0">⚠️</span>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider font-mono">Analysis Execution Failed</h4>
                <p className="text-xs text-rose-300/80 mt-1.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && result && (
            <div className="animate-fade-in-up space-y-6">
              <ResultCard result={result} />
              {result.debate && <DebatePanel debate={result.debate} />}
            </div>
          )}
        </section>

        {/* How INVESTOR AI Works Section */}
        <section className="space-y-12 py-8 border-t border-white/5">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-[#00D09C] uppercase tracking-widest font-mono">Workflow Mechanics</h2>
            <h3 className="text-3xl font-black text-white tracking-tight">How INVESTOR AI Works</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">Our automated analytical pipeline runs four key steps before outputting verdicts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'AI Research', desc: 'Agent collects web, news, and financial database details in real-time.', icon: <Search className="w-5 h-5 text-[#00D09C]" /> },
              { step: '02', title: 'Data Analysis', desc: 'Aggregates fundamental ratios, P/E metrics, debt levels, and growth vectors.', icon: <BarChart3 className="w-5 h-5 text-sky-400" /> },
              { step: '03', title: 'AI Reasoning', desc: 'Chat model structures qualitative factors, competitive moats, and risk vectors.', icon: <Brain className="w-5 h-5 text-purple-400" /> },
              { step: '04', title: 'Decision Engine', desc: 'Mathematically calculates the final score to produce INVEST / WATCH / PASS recomendations.', icon: <Sliders className="w-5 h-5 text-amber-400" /> }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#050914]/40 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-colors relative overflow-hidden group"
              >
                {/* Step Index Watermark */}
                <div className="absolute -right-2 -bottom-2 text-7xl font-black text-white/[0.02] font-mono select-none group-hover:text-white/[0.04] transition-colors duration-300">
                  {item.step}
                </div>

                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/5 shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-[#00D09C] transition-colors">STEP {item.step}</span>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030507] pt-16 pb-8 px-6 md:px-12 text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12">
          
          {/* Main Info Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 flex items-center justify-center bg-slate-900 border border-white/5 rounded-lg overflow-hidden">
                <span className="absolute left-[2px] top-[2px] w-2.5 h-4 bg-[#00D09C] rounded-sm transform rotate-12"></span>
                <span className="absolute right-[2px] bottom-[2px] w-2.5 h-4 bg-rose-500 rounded-sm transform -rotate-12 mix-blend-screen"></span>
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                INVESTOR<span className="text-[#00D09C]">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              AI-powered investment research for smarter decisions. Delivering institution-grade intelligence on demand.
            </p>
          </div>

          {/* Menu Columns */}
          {[
            {
              title: 'Company',
              links: ['About', 'Team', 'Careers']
            },
            {
              title: 'Products',
              links: ['AI Research', 'Dashboard', 'API']
            },
            {
              title: 'Resources',
              links: ['Documentation', 'Blog', 'Research Methodology']
            },
            {
              title: 'Legal',
              links: ['Privacy Policy', 'Terms']
            }
          ].map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest font-mono">{col.title}</h5>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom copyright bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© 2026 INVESTOR AI. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>LangChain</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
