'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award,
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

/**
 * @file DebatePanel.jsx
 * @description Premium multi-agent AI investment debate dashboard panel.
 * Displays Bull Analyst (BUY), Bear Analyst (SELL), and CIO Judge (verdict) cards.
 */
export default function DebatePanel({ debate }) {
  const [animate, setAnimate] = useState(false);

  // Trigger progress bar animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!debate) return null;

  const { bull, bear, judge } = debate;

  // Decide CIO style classes based on the decision
  let judgeBadgeColor = 'text-slate-400 bg-slate-900 border-slate-800';
  let judgeGlow = 'border-slate-800/60 shadow-[0_0_20px_rgba(255,255,255,0.02)]';
  let judgeThemeColor = '#94a3b8'; // Default slate

  if (judge.decision === 'INVEST') {
    judgeBadgeColor = 'text-[#00D09C] bg-[#00D09C]/10 border-[#00D09C]/30 shadow-[0_0_15px_rgba(0,208,156,0.1)]';
    judgeGlow = 'border-[#00D09C]/15 hover:border-[#00D09C]/30 hover:shadow-[0_12px_45px_rgba(0,208,156,0.06)]';
    judgeThemeColor = '#00D09C';
  } else if (judge.decision === 'WATCH') {
    judgeBadgeColor = 'text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    judgeGlow = 'border-amber-400/15 hover:border-amber-400/30 hover:shadow-[0_12px_45px_rgba(245,158,11,0.06)]';
    judgeThemeColor = '#fbbf24';
  } else if (judge.decision === 'PASS') {
    judgeBadgeColor = 'text-rose-500 bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
    judgeGlow = 'border-rose-500/15 hover:border-rose-500/30 hover:shadow-[0_12px_45px_rgba(239,68,68,0.06)]';
    judgeThemeColor = '#f43f5e';
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 space-y-6 animate-fade-in-up">
      
      {/* Section Title */}
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-semibold text-[#00D09C] uppercase tracking-widest font-mono">
          INVESTMENT COMMITTEE DELIBERATION
        </span>
        <h3 className="text-2xl font-black text-white tracking-tight">
          AI Investment Debate
        </h3>
      </div>

      {/* Main Grid for Analyst Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Bull Analyst */}
        <div className="bg-[#050914]/40 border border-[#00D09C]/10 rounded-2xl p-6 flex flex-col justify-between glass-panel glass-panel-hover hover:border-[#00D09C]/30 hover:shadow-[0_12px_40px_rgba(0,208,156,0.05)] transition-all duration-300">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐂</span>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Bull Analyst</h4>
                  <span className="text-[9px] font-mono text-[#00D09C] uppercase tracking-wider">BUY PERSPECTIVE</span>
                </div>
              </div>
              
              {/* Confidence Counter */}
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block font-mono">CONVICTION</span>
                <span className="text-sm font-black text-[#00D09C] font-mono">{bull.confidence}%</span>
              </div>
            </div>

            {/* Conviction Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-[#00D09C]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00D09C] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: animate ? `${bull.confidence}%` : '0%' }}
                />
              </div>
            </div>

            {/* Summary */}
            <p className="text-slate-400 text-xs leading-relaxed italic">
              "{bull.summary}"
            </p>

            {/* Arguments */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">KEY POSITIVES</span>
              <ul className="space-y-2">
                {bull.arguments && bull.arguments.length > 0 ? (
                  bull.arguments.map((arg, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00D09C] shrink-0 mt-0.5" />
                      <span>{arg}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-xs italic">No supporting arguments provided.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Card 2: Bear Analyst */}
        <div className="bg-[#050914]/40 border border-rose-500/10 rounded-2xl p-6 flex flex-col justify-between glass-panel glass-panel-hover hover:border-rose-500/30 hover:shadow-[0_12px_40px_rgba(239,68,68,0.05)] transition-all duration-300">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐻</span>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Bear Analyst</h4>
                  <span className="text-[9px] font-mono text-rose-400 uppercase tracking-wider">SELL PERSPECTIVE</span>
                </div>
              </div>
              
              {/* Confidence Counter */}
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block font-mono">CONVICTION</span>
                <span className="text-sm font-black text-rose-500 font-mono">{bear.confidence}%</span>
              </div>
            </div>

            {/* Conviction Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-rose-500/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: animate ? `${bear.confidence}%` : '0%' }}
                />
              </div>
            </div>

            {/* Summary */}
            <p className="text-slate-400 text-xs leading-relaxed italic">
              "{bear.summary}"
            </p>

            {/* Arguments */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">KEY RISK FACTORS</span>
              <ul className="space-y-2">
                {bear.arguments && bear.arguments.length > 0 ? (
                  bear.arguments.map((arg, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-normal">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{arg}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-xs italic">No specific risks highlighted.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Chief Investment Officer (Full Width Below) */}
      <div className={`bg-[#050914]/60 border rounded-2xl p-6 md:p-8 glass-panel ${judgeGlow} transition-all duration-300`}>
        
        {/* Glow ambient background blur */}
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none" style={{ backgroundColor: judgeThemeColor }}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* CIO info & Badge Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">👨💼</span>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Chief Investment Officer</h4>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">COMMITTEE CHAIRMAN</span>
              </div>
            </div>

            <div className="h-px bg-white/5 my-2"></div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">FINAL VERDICT</span>
              <div className={`text-center py-2 px-4 rounded-xl border text-sm font-black tracking-widest font-mono ${judgeBadgeColor}`}>
                {judge.decision}
              </div>
            </div>

            {/* Conviction progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>COMMITTEE CONVICTION</span>
                <span className="font-bold" style={{ color: judgeThemeColor }}>{judge.confidence}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: animate ? `${judge.confidence}%` : '0%',
                    backgroundColor: judgeThemeColor
                  }}
                />
              </div>
            </div>
          </div>

          {/* Explanation Text Column */}
          <div className="lg:col-span-8 bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D09C]" />
                Arbitration Reasoning
              </h5>
              <p className="text-slate-300 text-xs md:text-[13px] leading-relaxed">
                {judge.explanation}
              </p>
            </div>

            {judge.summary && (
              <div className="text-[11px] text-slate-500 border-t border-white/5 pt-3 leading-relaxed">
                <span className="font-mono text-slate-400 uppercase tracking-wider mr-1.5 font-bold">Summary:</span>
                {judge.summary}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
