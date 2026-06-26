'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

/**
 * @file Loader.jsx
 * @description Premium progress loading indicator showing research steps in real time for INVESTOR AI.
 */
export default function Loader() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Researching company profile',
    'Checking financial data',
    'Calculating investment score',
    'Generating AI reasoning'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="max-w-md mx-auto bg-[#050914]/80 border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-8 backdrop-blur-xl relative overflow-hidden animate-fade-in-up">
      {/* Top green glowing border line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D09C] to-transparent"></div>
      
      {/* Central spinning loader animation with multiple glow rings */}
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 bg-[#00D09C]/5 blur-2xl rounded-full animate-pulse-slow"></div>
          <div className="absolute inset-0 border border-[#00D09C]/10 rounded-full"></div>
          <div className="absolute inset-2 border border-dashed border-[#00D09C]/20 rounded-full animate-spin [animation-duration:12s]"></div>
          <Loader2 className="w-10 h-10 text-[#00D09C] animate-spin relative" />
        </div>
      </div>

      {/* Progress description */}
      <div className="text-center space-y-1">
        <h3 className="text-white font-bold text-xl tracking-tight">AI Analyst At Work</h3>
        <p className="text-slate-400 text-xs">INVESTOR AI agents are crawling and analyzing real-time indicators...</p>
      </div>

      {/* Step List Container */}
      <div className="space-y-4 pt-2">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <div 
              key={index}
              className={`flex items-center gap-4 text-sm transition-all duration-300 p-3 rounded-xl border border-transparent ${
                isActive 
                  ? 'text-[#00D09C] bg-[#00D09C]/5 border-[#00D09C]/10 font-semibold' 
                  : isCompleted 
                    ? 'text-slate-400' 
                    : 'text-slate-600'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-[#00D09C] shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-[#00D09C] animate-spin shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-800 shrink-0" />
              )}
              
              <span className="leading-none">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
