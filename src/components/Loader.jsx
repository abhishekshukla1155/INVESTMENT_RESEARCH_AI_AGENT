'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle, Hourglass } from 'lucide-react';

/**
 * @file Loader.jsx
 * @description Premium multi-stage AI workflow loader for INVESTOR AI.
 * Simulates real-time agent progression: Research, Financials, Bull/Bear, and CIO arbitration.
 */
export default function Loader() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: 'Research Agent', desc: 'Gathering real-time web news and sentiment' },
    { name: 'Financial Analysis', desc: 'Scraping and matching fundamental stock metrics' },
    { name: 'Bull Analyst', desc: 'Evaluating positive growth vectors and moats' },
    { name: 'Bear Analyst', desc: 'Identifying risks, debt levels, and valuation multiples' },
    { name: 'Chief Investment Officer', desc: 'Arbitrating analyst debate for final recommendation' }
  ];

  useEffect(() => {
    // Automatically transition through the agent workflow stages
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-md mx-auto bg-[#050914]/80 border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 backdrop-blur-xl relative overflow-hidden animate-fade-in-up">
      {/* Top ambient green/blue gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D09C] to-transparent"></div>
      
      {/* Central spinning loader with multiple glow rings */}
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 bg-[#00D09C]/5 blur-2xl rounded-full animate-pulse-slow"></div>
          <div className="absolute inset-0 border border-[#00D09C]/10 rounded-full"></div>
          <div className="absolute inset-2 border border-dashed border-[#00D09C]/20 rounded-full animate-spin [animation-duration:12s]"></div>
          <Loader2 className="w-10 h-10 text-[#00D09C] animate-spin relative" />
        </div>
      </div>

      {/* Progress description */}
      <div className="text-center space-y-1.5">
        <h3 className="text-white font-bold text-xl tracking-tight">AI Committee Assembling</h3>
        <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
          Our independent analyst agents are compiling research and debating the investment thesis...
        </p>
      </div>

      {/* Step List Container showing live status updates */}
      <div className="space-y-3.5 pt-2">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep;

          let cardBorder = 'border-white/5';
          let textColor = 'text-slate-500';
          let statusText = 'Pending';
          let statusColor = 'text-slate-600';
          let statusIcon = <Circle className="w-4.5 h-4.5 text-slate-800 shrink-0" />;

          if (isCompleted) {
            textColor = 'text-slate-400';
            statusText = 'Complete';
            statusColor = 'text-[#00D09C] font-mono text-[10px] font-bold uppercase tracking-wider bg-[#00D09C]/5 border border-[#00D09C]/10 px-2 py-0.5 rounded-md';
            statusIcon = <CheckCircle2 className="w-4.5 h-4.5 text-[#00D09C] shrink-0" />;
          } else if (isActive) {
            textColor = 'text-white font-semibold';
            cardBorder = 'border-[#00D09C]/20 bg-[#00D09C]/5 shadow-[0_0_15px_rgba(0,208,156,0.02)]';
            statusText = 'Analyzing...';
            statusColor = 'text-[#00D09C] font-mono text-[10px] font-bold animate-pulse uppercase tracking-wider';
            statusIcon = <Loader2 className="w-4.5 h-4.5 text-[#00D09C] animate-spin shrink-0" />;
          } else {
            statusColor = 'text-slate-700 font-mono text-[10px] uppercase tracking-wider';
            statusIcon = <Hourglass className="w-4.5 h-4.5 text-slate-800 shrink-0" />;
          }

          return (
            <div 
              key={index}
              className={`flex items-center justify-between gap-4 text-sm transition-all duration-300 p-3.5 rounded-xl border ${cardBorder}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {statusIcon}
                <div className="text-left min-w-0">
                  <div className={`text-xs md:text-sm truncate ${textColor}`}>{step.name}</div>
                  {isActive && <div className="text-[10px] text-slate-400 mt-0.5 leading-none">{step.desc}</div>}
                </div>
              </div>
              
              <span className={`shrink-0 ${statusColor}`}>
                {statusText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
