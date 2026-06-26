'use client';

import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle, 
  ExternalLink, 
  Info,
  Layers,
  Activity,
  Award,
  Link2
} from 'lucide-react';

/**
 * @file ResultCard.jsx
 * @description Premium investment analysis report card designed as an institutional terminal dashboard.
 */
export default function ResultCard({ result }) {
  if (!result) return null;

  const {
    company,
    decision,
    score,
    overview,
    financialSummary,
    reasons = [],
    risks = [],
    sources = []
  } = result;

  const isInvest = decision === 'INVEST';
  const isWatch = decision === 'WATCH';
  const isPass = decision === 'PASS';

  // Parse details out of the financialSummary string cleanly on frontend
  let ticker = 'N/A';
  let marketCap = 'N/A';
  let peRatio = 'N/A';
  let growth = 'N/A';
  let margins = 'N/A';
  let debtLevel = 'N/A';
  let hasQuantitativeData = false;

  if (financialSummary && financialSummary.includes('Ticker Symbol:')) {
    hasQuantitativeData = true;
    const tickerMatch = financialSummary.match(/Ticker Symbol:\s*([^\s|]+)/i);
    const mcMatch = financialSummary.match(/Market Cap:\s*([^\s|]+(?:\s*[KkMmBbTt])?)/i);
    const peMatch = financialSummary.match(/P\/E Ratio:\s*([^\s|]+)/i);
    const growthMatch = financialSummary.match(/Growth:\s*([^\s|]+)/i);
    const marginMatch = financialSummary.match(/Margins:\s*([^\s|]+)/i);
    const debtMatch = financialSummary.match(/Debt Level:\s*([^\s|]+)/i);

    if (tickerMatch) ticker = tickerMatch[1];
    if (mcMatch) marketCap = mcMatch[1];
    if (peMatch) peRatio = peMatch[1];
    if (growthMatch) growth = growthMatch[1];
    if (marginMatch) margins = marginMatch[1];
    if (debtMatch) debtLevel = debtMatch[1];
  }

  // Dynamic colors and theme classes based on decision state
  let verdictColor = 'text-slate-400';
  let verdictBg = 'bg-slate-950/80 border-slate-800';
  let verdictGlow = 'border-slate-800';
  let scoreColor = '#94a3b8';
  let statusText = 'Hold / Monitor';

  if (isInvest) {
    verdictColor = 'text-[#00D09C]';
    verdictBg = 'bg-[#00D09C]/10 border-[#00D09C]/30 text-[#00D09C] shadow-[0_0_20px_rgba(0,208,156,0.15)]';
    verdictGlow = 'border-[#00D09C]/20 shadow-[#00D09C]/5';
    scoreColor = '#00D09C';
    statusText = 'INVEST';
  } else if (isWatch) {
    verdictColor = 'text-amber-400';
    verdictBg = 'bg-amber-400/10 border-amber-400/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]';
    verdictGlow = 'border-amber-400/20 shadow-amber-400/5';
    scoreColor = '#fbbf24';
    statusText = 'WATCH';
  } else if (isPass) {
    verdictColor = 'text-rose-500';
    verdictBg = 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]';
    verdictGlow = 'border-rose-500/20 shadow-rose-500/5';
    scoreColor = '#f43f5e';
    statusText = 'PASS';
  }

  // Circular score progress properties
  const radius = 34;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className={`w-full max-w-5xl mx-auto border rounded-3xl overflow-hidden glass-panel ${verdictGlow} transition-all duration-500 animate-fade-in-up`}>
      
      {/* Top Banner / Dashboard Header */}
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative">
        {/* Glow ambient background blur */}
        <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-10`} style={{ backgroundColor: scoreColor }}></div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono tracking-wider px-2 py-0.5 rounded-md uppercase">
              INSTITUTIONAL AI REPORT
            </span>
            {hasQuantitativeData && (
              <span className="text-xs text-[#00D09C] font-mono font-bold tracking-widest px-2 py-0.5 bg-[#00D09C]/5 border border-[#00D09C]/10 rounded-md">
                ${ticker.toUpperCase()}
              </span>
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {company}
          </h2>
        </div>

        {/* Score & Verdict badges */}
        <div className="flex items-center gap-5 relative z-10">
          
          {/* Verdict glowing pill */}
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">RECOMMENDATION</span>
            <div className={`text-sm font-black px-4 py-2 rounded-xl border ${verdictBg} tracking-wider font-sans`}>
              {statusText}
            </div>
          </div>

          {/* Investment Score Circular Chart */}
          <div className="flex items-center gap-3 bg-slate-950/60 border border-white/5 p-3 rounded-2xl">
            <div className="relative flex items-center justify-center">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                {/* Background circle track */}
                <circle
                  stroke="rgba(255, 255, 255, 0.05)"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                {/* Foreground indicator track */}
                <circle
                  stroke={scoreColor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Score text absolute center */}
              <span className="absolute text-sm font-black text-white">{score}</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] text-slate-500 block tracking-widest font-mono">INVESTMENT SCORE</span>
              <span className="text-[11px] text-slate-300 font-bold font-mono">/ 100 max</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Panel grid */}
      <div className="p-6 md:p-8 space-y-8 bg-slate-950/20">
        
        {/* Core Summaries section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Company Overview Block */}
          <div className="lg:col-span-7 bg-[#050914]/60 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-colors">
            <h3 className="text-slate-200 font-bold text-sm flex items-center gap-2 uppercase tracking-wider font-mono">
              <Layers className="w-4 h-4 text-[#00D09C]" />
              Executive Analysis Summary
            </h3>
            <p className="text-slate-400 text-[14px] leading-relaxed">
              {overview}
            </p>
          </div>

          {/* Financial Intelligence dashboard */}
          <div className="lg:col-span-5 bg-[#050914]/60 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-colors">
            <h3 className="text-slate-200 font-bold text-sm flex items-center gap-2 uppercase tracking-wider font-mono">
              <Activity className="w-4 h-4 text-[#00D09C]" />
              Financial Intelligence
            </h3>
            
            {hasQuantitativeData ? (
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-mono">MARKET CAP</span>
                  <span className="text-sm font-bold text-slate-200">{marketCap}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-mono">P/E RATIO</span>
                  <span className="text-sm font-bold text-slate-200">{peRatio}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-mono">REVENUE GROWTH</span>
                  <span className="text-sm font-bold text-[#00D09C]">{growth}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 block font-mono">PROFIT MARGINS</span>
                  <span className="text-sm font-bold text-slate-200">{margins}</span>
                </div>
                <div className="col-span-2 bg-slate-950/40 border border-white/5 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-[9px] text-slate-500 font-mono">DEBT-TO-EQUITY</span>
                  <span className="text-xs font-bold text-slate-300">{debtLevel}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-center py-6 text-slate-500">
                <Info className="w-6 h-6 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs">No formal public ticker resolved. Displaying search metadata summary:</p>
                <p className="text-[11px] font-mono text-slate-400 text-left bg-slate-950/40 p-2.5 rounded-lg border border-white/5 leading-normal max-h-[140px] overflow-y-auto">
                  {financialSummary}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Strengths & Risks bullet matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths column */}
          <div className="bg-[#050914]/40 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-[#00D09C] font-bold text-sm flex items-center gap-2 border-b border-white/5 pb-3 uppercase tracking-wider font-mono">
              <CheckCircle className="w-4.5 h-4.5" />
              Strengths & Opportunities
            </h3>
            <ul className="space-y-3.5">
              {reasons.length > 0 ? (
                reasons.map((reason, idx) => (
                  <li key={idx} className="flex gap-3 text-[13px] text-slate-300 leading-normal">
                    <span className="text-[#00D09C] font-black shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-xs italic">No structured positive signals found.</li>
              )}
            </ul>
          </div>

          {/* Risks column */}
          <div className="bg-[#050914]/40 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-rose-400 font-bold text-sm flex items-center gap-2 border-b border-white/5 pb-3 uppercase tracking-wider font-mono">
              <ShieldAlert className="w-4.5 h-4.5" />
              Risks & Threats
            </h3>
            <ul className="space-y-3.5">
              {risks.length > 0 ? (
                risks.map((risk, idx) => (
                  <li key={idx} className="flex gap-3 text-[13px] text-slate-300 leading-normal">
                    <span className="text-rose-500 font-bold shrink-0">!</span>
                    <span>{risk}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 text-xs italic">No negative risk factors identified.</li>
              )}
            </ul>
          </div>

        </div>

        {/* Research Sources Section */}
        {sources && sources.length > 0 && (
          <div className="border-t border-white/5 pt-6 space-y-3">
            <h4 className="text-slate-400 font-semibold text-xs flex items-center gap-2 uppercase tracking-wider font-mono">
              <Link2 className="w-3.5 h-3.5 text-[#00D09C]" />
              Research Sources Verified
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {sources.map((url, index) => {
                let domain = 'Website';
                try {
                  domain = new URL(url).hostname.replace('www.', '');
                } catch {
                  domain = 'Source Link';
                }

                // Favicon url utility
                const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#050914]/80 border border-white/5 hover:border-[#00D09C]/30 hover:bg-[#00D09C]/5 px-3 py-2 rounded-xl text-xs text-slate-300 transition-all duration-200 cursor-pointer"
                  >
                    <img 
                      src={faviconUrl} 
                      alt="" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                      className="w-3.5 h-3.5 rounded-sm object-contain"
                    />
                    <span className="font-mono">{domain}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
