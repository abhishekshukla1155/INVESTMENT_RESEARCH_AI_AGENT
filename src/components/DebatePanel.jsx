'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award,
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Activity,
  ArrowRight,
  Sparkles,
  GitBranch,
  Search
} from 'lucide-react';

/**
 * @file DebatePanel.jsx
 * @description Institutional-grade multi-agent debate analytics panel.
 * Houses the debate winner banner, Bull/Bear analyst summaries, full-width CIO
 * arbitration, and an interactive comparison metric table.
 */
export default function DebatePanel({ debate }) {
  const [animate, setAnimate] = useState(false);
  const [isBullExpanded, setIsBullExpanded] = useState(false);
  const [isBearExpanded, setIsBearExpanded] = useState(false);

  // Trigger progress bar animations on load
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!debate) return null;

  const { bull, bear, judge } = debate;

  // 1. Calculate Bull vs Bear Influence
  const totalConfidence = (bull.confidence || 0) + (bear.confidence || 0);
  const bullInfluence = totalConfidence > 0 ? Math.round((bull.confidence / totalConfidence) * 100) : 50;
  const bearInfluence = 100 - bullInfluence;

  // 2. Determine Debate Winner
  const confidenceDiff = (bull.confidence || 0) - (bear.confidence || 0);
  const isBullWinner = confidenceDiff > 0;
  const winnerName = isBullWinner ? 'Bull Analyst' : 'Bear Analyst';
  const winnerAdvantage = Math.abs(confidenceDiff);
  const winnerColorClass = isBullWinner ? 'text-[#00D09C]' : 'text-rose-500';
  const winnerBorderClass = isBullWinner ? 'border-[#00D09C]/25 bg-[#00D09C]/5' : 'border-rose-500/25 bg-rose-500/5';
  const winnerIcon = isBullWinner ? '🐂' : '🐻';

  // 3. Keyword Heuristic parser for Visual Metric Comparison
  const checkKeywords = (args = [], keywords = []) => {
    return args.some(arg => 
      keywords.some(keyword => arg.toLowerCase().includes(keyword.toLowerCase()))
    );
  };

  const metrics = [
    { 
      name: 'Revenue Growth', 
      keywords: ['growth', 'revenue', 'sales', 'expand'], 
      description: 'Top-line sales performance indicators' 
    },
    { 
      name: 'Profitability', 
      keywords: ['profit', 'margin', 'cash', 'income', 'ebitda'], 
      description: 'Earning efficiency and free cash flow generation' 
    },
    { 
      name: 'Debt Leverage', 
      keywords: ['debt', 'leverage', 'liability', 'balance sheet', 'interest'], 
      description: 'Capital structure and debt service obligations' 
    },
    { 
      name: 'Valuation Multiple', 
      keywords: ['valuation', 'pe ratio', 'p/e', 'multiple', 'price', 'overvalued', 'discount'], 
      description: 'Equity pricing relative to earnings output' 
    },
    { 
      name: 'Market Position', 
      keywords: ['market', 'leader', 'dominant', 'share', 'competitive', 'position'], 
      description: 'Industry standing and market share capture' 
    },
    { 
      name: 'Innovation Moat', 
      keywords: ['innovation', 'ai', 'technology', 'product', 'patent', 'moat', 'r&d'], 
      description: 'Intellectual property and competitive advantages' 
    },
    { 
      name: 'Macro/Legal Risk', 
      keywords: ['risk', 'threat', 'headwind', 'regulation', 'legal', 'geopolitical'], 
      description: 'External operating pressures and legal exposure' 
    }
  ];

  // Evaluate who wins each row based on matching keywords
  const comparisonRows = metrics.map(metric => {
    const bullHasMetric = checkKeywords(bull.arguments, metric.keywords);
    const bearHasMetric = checkKeywords(bear.arguments, metric.keywords);

    let winner = 'neutral';
    if (bullHasMetric && !bearHasMetric) winner = 'bull';
    if (!bullHasMetric && bearHasMetric) winner = 'bear';
    // Default assignments for categories where analysts hold natural mandates
    if (metric.name === 'Debt Leverage' && bearHasMetric) winner = 'bear';
    if (metric.name === 'Innovation Moat' && bullHasMetric) winner = 'bull';
    if (metric.name === 'Macro/Legal Risk' && bearHasMetric) winner = 'bear';

    return { ...metric, winner };
  });

  // CIO style classes
  let judgeBadgeColor = 'text-slate-400 bg-slate-900 border-slate-800';
  let judgeGlow = 'border-slate-800/60 shadow-[0_0_20px_rgba(255,255,255,0.02)]';
  let judgeThemeColor = '#94a3b8';

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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* 1. Header & AI Optimization Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#00D09C] uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
            Multi-Agent Debate Pipeline
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Institutional Research Committee
          </h3>
        </div>

        {/* Optimization Metadata Badge */}
        <div className="bg-[#050914]/65 border border-white/5 rounded-xl px-4 py-2.5 flex items-center gap-3">
          <div className="p-2 bg-slate-950 rounded-lg border border-white/5">
            <Cpu className="w-4 h-4 text-[#00D09C]" />
          </div>
          <div className="text-left font-mono text-[9px] leading-tight space-y-0.5">
            <div className="text-slate-300 font-bold uppercase tracking-wider">AI Optimization Panel</div>
            <div className="text-slate-500 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-[#00D09C] fill-[#00D09C]" /> 
              Shared Context • Parallel Core Pipeline
            </div>
            <div className="text-[#00D09C] font-semibold">3 Bypassed Network Calls saved</div>
          </div>
        </div>
      </div>

      {/* 2. Debate Winner Banner */}
      <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${winnerBorderClass} transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div className="text-left">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">DEBATE DECISION WINNER</span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{winnerIcon} {winnerName}</span>
              <span className={`text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5 font-mono ${winnerColorClass}`}>
                +{winnerAdvantage}% Margin
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 italic max-w-sm text-center sm:text-right leading-normal">
          {isBullWinner 
            ? "Bull analyst's positive valuation and scaling factors outweighed risks in the CIO's judgment."
            : "Bear analyst's risk exposure and multiple contraction warnings dominated the final evaluation."
          }
        </p>
      </div>

      {/* 3. Bull & Bear Analyst Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Bull Analyst */}
        <div className="bg-[#050914]/40 border border-[#00D09C]/15 rounded-2xl p-6 glass-panel flex flex-col justify-between transition-all duration-300">
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
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block font-mono">CONVICTION</span>
                <span className="text-sm font-black text-[#00D09C] font-mono">{bull.confidence}%</span>
              </div>
            </div>

            {/* Conviction Progress Bar */}
            <div className="w-full h-1.5 bg-[#00D09C]/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00D09C] rounded-full transition-all duration-1000 ease-out"
                style={{ width: animate ? `${bull.confidence}%` : '0%' }}
              />
            </div>

            {/* Short Executive Summary (2-3 Lines) */}
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              {bull.summary.length > 120 
                ? `${bull.summary.substring(0, 120).trim()}...` 
                : bull.summary
              }
            </p>

            {/* Key Arguments list (Show Top 3 when collapsed, show all when expanded) */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">TOP ARGUMENTS</span>
              <ul className="space-y-2">
                {(isBullExpanded ? bull.arguments : bull.arguments.slice(0, 3)).map((arg, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-[#00D09C] shrink-0 mt-0.5" />
                    <span>{arg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expandable Section */}
            {isBullExpanded && (
              <div className="border-t border-white/5 pt-3 mt-3 text-left space-y-2.5 animate-fade-in-up">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">FULL QUALITATIVE TEXT</span>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                  "{bull.summary}"
                </p>
              </div>
            )}
          </div>

          {/* Expand Toggle Button */}
          <button 
            onClick={() => setIsBullExpanded(!isBullExpanded)}
            className="w-full mt-5 flex items-center justify-center gap-1.5 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 text-[10px] font-bold text-slate-400 hover:text-white py-2 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider"
          >
            {isBullExpanded ? (
              <>
                <span>Collapse Analysis</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>View Full Analysis</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

        {/* Card 2: Bear Analyst */}
        <div className="bg-[#050914]/40 border border-rose-500/15 rounded-2xl p-6 glass-panel flex flex-col justify-between transition-all duration-300">
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
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block font-mono">CONVICTION</span>
                <span className="text-sm font-black text-rose-500 font-mono">{bear.confidence}%</span>
              </div>
            </div>

            {/* Conviction Progress Bar */}
            <div className="w-full h-1.5 bg-rose-500/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: animate ? `${bear.confidence}%` : '0%' }}
              />
            </div>

            {/* Short Executive Summary */}
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              {bear.summary.length > 120 
                ? `${bear.summary.substring(0, 120).trim()}...` 
                : bear.summary
              }
            </p>

            {/* Key Arguments List */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">TOP ARGUMENTS</span>
              <ul className="space-y-2">
                {(isBearExpanded ? bear.arguments : bear.arguments.slice(0, 3)).map((arg, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal animate-fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{arg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expandable Section */}
            {isBearExpanded && (
              <div className="border-t border-white/5 pt-3 mt-3 text-left space-y-2.5 animate-fade-in-up">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">FULL QUALITATIVE TEXT</span>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                  "{bear.summary}"
                </p>
              </div>
            )}
          </div>

          {/* Expand Toggle Button */}
          <button 
            onClick={() => setIsBearExpanded(!isBearExpanded)}
            className="w-full mt-5 flex items-center justify-center gap-1.5 bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-white/10 text-[10px] font-bold text-slate-400 hover:text-white py-2 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider"
          >
            {isBearExpanded ? (
              <>
                <span>Collapse Analysis</span>
                <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                <span>View Full Analysis</span>
                <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* 4. Visual Metric Comparison Section */}
      <div className="bg-[#050914]/40 border border-white/5 rounded-2xl p-6 glass-panel space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Activity className="w-4.5 h-4.5 text-[#00D09C]" />
          <h4 className="text-sm font-bold text-white">Adversarial Metric Comparison Matrix</h4>
        </div>

        <div className="space-y-3.5">
          {comparisonRows.map((row, index) => {
            const isNeutral = row.winner === 'neutral';
            const isBull = row.winner === 'bull';
            const isBear = row.winner === 'bear';

            return (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 hover:bg-slate-950/40 rounded-xl transition-colors">
                <div className="text-left min-w-[200px]">
                  <span className="text-xs font-semibold text-slate-200 block">{row.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono leading-none">{row.description}</span>
                </div>

                {/* Slider indicator bar */}
                <div className="flex items-center gap-3 flex-1 max-w-md w-full">
                  <span className={`text-[10px] font-bold font-mono ${isBull ? 'text-[#00D09C]' : 'text-slate-600'}`}>BULL</span>
                  <div className="h-2 bg-slate-950 border border-white/5 rounded-full flex-1 relative overflow-hidden">
                    <div 
                      className={`h-full absolute rounded-full transition-all duration-1000 ${
                        isBull 
                          ? 'bg-[#00D09C] left-0 w-1/2' 
                          : isBear 
                            ? 'bg-rose-500 right-0 w-1/2' 
                            : 'bg-slate-700 left-[25%] w-1/2'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-bold font-mono ${isBear ? 'text-rose-500' : 'text-slate-600'}`}>BEAR</span>
                </div>

                {/* Verdict Indicator pill */}
                <div className="min-w-[90px] text-right shrink-0">
                  {isBull ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#00D09C]/10 border border-[#00D09C]/20 text-[#00D09C] rounded-md font-mono">BULL WINS</span>
                  ) : isBear ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-md font-mono">BEAR WINS</span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md font-mono">BALANCED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Premium Chief Investment Officer Card */}
      <div className={`bg-[#050914]/60 border rounded-2xl p-6 md:p-8 glass-panel ${judgeGlow} transition-all duration-300 relative`}>
        
        {/* Glow ambient background blur */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-[0.04] pointer-events-none" style={{ backgroundColor: judgeThemeColor }}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Influence & Verdict badge column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">👨💼</span>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Chief Investment Officer</h4>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">COMMITTEE CHAIRMAN</span>
              </div>
            </div>

            <div className="h-px bg-white/5"></div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">FINAL VERDICT</span>
              <div className={`text-center py-3.5 px-4 rounded-xl border text-base font-black tracking-widest font-mono ${judgeBadgeColor}`}>
                {judge.decision}
              </div>
            </div>

            {/* Committee Conviction progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>COMMITTEE CONVICTION</span>
                <span className="font-bold text-sm" style={{ color: judgeThemeColor }}>{judge.confidence}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: animate ? `${judge.confidence}%` : '0%',
                    backgroundColor: judgeThemeColor
                  }}
                />
              </div>
            </div>

            {/* Bull vs Bear Influence distribution */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block">ANALYST THESIS INFLUENCE</span>
              
              <div className="w-full h-2.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-[#00D09C] transition-all duration-1000 ease-out"
                  style={{ width: animate ? `${bullInfluence}%` : '0%' }}
                />
                <div 
                  className="h-full bg-rose-500 transition-all duration-1000 ease-out"
                  style={{ width: animate ? `${bearInfluence}%` : '0%' }}
                />
              </div>
              
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#00D09C]">Bullish Force: {bullInfluence}%</span>
                <span className="text-rose-500">Bearish force: {bearInfluence}%</span>
              </div>
            </div>

          </div>

          {/* Reasoning Narrative Column */}
          <div className="lg:col-span-7 bg-slate-950/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#00D09C]" />
                Arbitration Analysis Report
              </h5>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans">
                {judge.explanation}
              </p>
            </div>

            {judge.summary && (
              <div className="text-xs text-slate-500 border-t border-white/5 pt-4 leading-relaxed font-mono">
                <span className="text-slate-400 uppercase tracking-wider mr-1.5 font-bold">Committee Note:</span>
                {judge.summary}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 6. AI Analysis Timeline */}
      <div className="bg-[#050914]/40 border border-white/5 rounded-2xl p-6 glass-panel space-y-5">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <GitBranch className="w-4.5 h-4.5 text-[#00D09C]" />
          <h4 className="text-sm font-bold text-white">AI Decision-Making Timeline</h4>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2 pt-2 relative">
          
          {/* Horizontal line background */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-950 border-b border-white/5 -translate-y-1/2 hidden md:block z-0" />

          {[
            { label: 'Research Agent', desc: 'Web news compiled' },
            { label: 'Financial Analysis', desc: 'Ratios matched' },
            { label: 'Bull Analyst', desc: 'BUY thesis generated' },
            { label: 'Bear Analyst', desc: 'SELL thesis generated' },
            { label: 'Chief Inv Officer', desc: 'Debate arbitrated' },
            { label: 'Final Verdict', desc: 'Recommendation set' }
          ].map((step, idx) => (
            <div key={idx} className="flex md:flex-col items-center gap-3.5 md:gap-2.5 relative z-10 bg-[#030507]/45 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5 md:border-transparent md:bg-transparent">
              <div className="w-7 h-7 bg-[#00D09C]/10 border border-[#00D09C]/30 text-[#00D09C] rounded-full flex items-center justify-center text-xs font-bold font-mono">
                ✓
              </div>
              <div className="text-left md:text-center">
                <span className="text-xs font-bold text-white block">{step.label}</span>
                <span className="text-[9px] text-slate-500 font-mono leading-none">{step.desc}</span>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
