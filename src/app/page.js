'use client';

import React, { useState, useRef, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import { analyzeCompany } from '../api/apiHelper';
import Link from 'next/link';
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
  X,
  Sparkles,
  GitPullRequest,
  CheckCircle,
  ExternalLink,
  Mail,
  User,
  LogOut
} from 'lucide-react';

/**
 * @file page.js
 * @description Premium minimal SaaS landing page & dashboard for INVESTOR AI.
 */
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userSession, setUserSession] = useState(null);

  const resultRef = useRef(null);

  // Read mock user authentication state on load
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      setUserSession(JSON.parse(session));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userSession');
    setUserSession(null);
  };

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
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D09C]/5 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse-slow [animation-delay:4s]"></div>

      {/* Sticky Premium Navbar */}
      <header className="border-b border-white/5 bg-[#030507]/80 backdrop-blur-md sticky top-0 z-50 py-4 px-6 md:px-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Branding */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-inner">
              <span className="absolute left-[3px] top-[3px] w-3 h-5 bg-[#00D09C] rounded-sm transform rotate-12 transition-transform duration-300 hover:scale-110"></span>
              <span className="absolute right-[3px] bottom-[3px] w-3 h-5 bg-sky-500 rounded-sm transform -rotate-12 mix-blend-screen transition-transform duration-300 hover:scale-110"></span>
            </div>
            <span className="font-black text-lg tracking-wider text-white">
              INVESTOR<span className="text-[#00D09C]">AI</span>
            </span>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#how-it-works" className="text-xs font-semibold text-slate-400 hover:text-[#00D09C] transition-colors duration-200 uppercase tracking-widest font-mono">
              How it works
            </a>
            <a href="#search-section" className="text-xs font-semibold text-slate-400 hover:text-[#00D09C] transition-colors duration-200 uppercase tracking-widest font-mono">
              AI Analysis
            </a>
            <a 
              href="https://github.com/abhishekshukla1155/INVESTMENT_RESEARCH_AI_AGENT" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-semibold text-slate-400 hover:text-[#00D09C] transition-colors duration-200 uppercase tracking-widest font-mono flex items-center gap-1.5"
            >
              GitHub <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </nav>

          {/* Right Action Buttons / Auth State */}
          <div className="hidden sm:flex items-center gap-4">
            {userSession ? (
              <div className="flex items-center gap-4 bg-slate-950/65 border border-white/5 pl-3.5 pr-1.5 py-1.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <img 
                    src={userSession.avatar} 
                    alt="" 
                    className="w-5 h-5 bg-slate-900 border border-white/10 rounded-lg object-cover"
                  />
                  <span className="text-xs font-mono text-slate-300 font-bold truncate max-w-[140px]">
                    {userSession.name}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 p-2 rounded-xl transition-all duration-200 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition-colors cursor-pointer font-mono uppercase tracking-wider"
                >
                  Login
                </Link>
                <a 
                  href="#search-section"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer font-mono uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                >
                  Get Started
                </a>
              </>
            )}
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
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest"
              >
                How it works
              </a>
              <a 
                href="#search-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest"
              >
                AI Analysis
              </a>
              <a 
                href="https://github.com/abhishekshukla1155/INVESTMENT_RESEARCH_AI_AGENT" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-300 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-widest flex items-center gap-1.5"
              >
                GitHub <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <div className="h-px bg-white/5 my-2"></div>
              
              {userSession ? (
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <img src={userSession.avatar} alt="" className="w-6 h-6 bg-slate-900 border border-white/10 rounded-lg" />
                    <span className="text-xs font-mono text-slate-300 font-bold">{userSession.name}</span>
                  </div>
                  <button 
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center text-xs font-bold text-slate-300 hover:text-white py-3 border border-white/5 rounded-xl font-mono uppercase"
                  >
                    Login
                  </Link>
                  <a 
                    href="#search-section"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-[#00D09C] text-[#030507] text-xs font-bold py-3 rounded-xl font-mono uppercase"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-16 px-6 md:px-12 z-10 space-y-24">
        
        {/* Hero Section Container */}
        <section id="search-section" className="text-center space-y-8 max-w-4xl mx-auto py-8 scroll-mt-24">
          
          <div className="inline-flex items-center gap-2 bg-[#00D09C]/5 border border-[#00D09C]/10 text-[#00D09C] text-[10px] font-mono tracking-widest uppercase px-4 py-1.5 rounded-full animate-fade-in shadow-[0_0_15px_rgba(0,208,156,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D09C] animate-pulse"></span>
            ✦ MULTI-AGENT INVESTMENT INTELLIGENCE
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-gradient-white">
            Adversarial Investment Analysis<br />
            <span className="text-gradient-green">Powered by Multiple AI Analysts</span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Query any company ticker to run sequential web research, fundamental screening, and an adversarial bull vs bear committee debate to finalize conviction.
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
            <div className="animate-fade-in-up">
              <ResultCard result={result} />
            </div>
          )}
        </section>

        {/* How INVESTOR AI Works Section */}
        <section id="how-it-works" className="space-y-12 py-8 border-t border-white/5 scroll-mt-24">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-semibold text-[#00D09C] uppercase tracking-widest font-mono">Workflow Architecture</h2>
            <h3 className="text-3xl font-black text-white tracking-tight">How INVESTOR AI Works</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">Our automated analytical pipeline coordinates multiple distinct agent layers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'Research Agent', desc: 'Gathers real-time web sentiment, analyst news, and qualitative press articles.', icon: <Search className="w-5 h-5 text-[#00D09C]" /> },
              { step: '02', title: 'Financial Intelligence', desc: 'Standardizes fundamental market metrics, P/E multiples, margins, and debt ratios.', icon: <BarChart3 className="w-5 h-5 text-sky-400" /> },
              { step: '03', title: 'Bull vs Bear Debate', desc: 'Simulates adversarial BUY/SELL arguments between opposing specialized AI agents.', icon: <Brain className="w-5 h-5 text-purple-400" /> },
              { step: '04', title: 'Committee Decision', desc: 'Chief Investment Officer arbitrates arguments to output calibrated recommendations.', icon: <Sliders className="w-5 h-5 text-amber-400" /> }
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 pb-12">
          
          {/* Main Info Column */}
          <div className="space-y-4 max-w-md">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-7 h-7 flex items-center justify-center bg-slate-900 border border-white/5 rounded-lg overflow-hidden">
                <span className="absolute left-[2px] top-[2px] w-2.5 h-4 bg-[#00D09C] rounded-sm transform rotate-12"></span>
                <span className="absolute right-[2px] bottom-[2px] w-2.5 h-4 bg-sky-500 rounded-sm transform -rotate-12 mix-blend-screen"></span>
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                INVESTOR<span className="text-[#00D09C]">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multi-Agent Investment Research Platform powered by AI. Orchestrating autonomous research agents, qualitative debate, and financial metrics to empower portfolio analysis.
            </p>
          </div>

          {/* Clean footer links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest font-mono">Platform</h5>
              <ul className="space-y-2">
                <li>
                  <a href="#how-it-works" className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#search-section" className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors">
                    Research Terminal
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest font-mono">Developer</h5>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com/abhishekshukla1155/INVESTMENT_RESEARCH_AI_AGENT" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors flex items-center gap-1"
                  >
                    GitHub <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors flex items-center gap-1"
                  >
                    LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a href="mailto:abhishekshukla1155@gmail.com" className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors flex items-center gap-1">
                    Contact <Mail className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-[10px] font-bold text-slate-200 uppercase tracking-widest font-mono">Legal</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-xs text-slate-500 hover:text-[#00D09C] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

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
