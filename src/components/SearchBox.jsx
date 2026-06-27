'use client';

import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

/**
 * @file SearchBox.jsx
 * @description Premium glassmorphic company search box for the INVESTOR AI platform.
 */
export default function SearchBox({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto relative group z-10"
    >
      {/* Background glow behind search box */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent to-sky-500 rounded-2xl blur-lg opacity-25 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex flex-col md:flex-row gap-3 bg-[#050914]/80 border border-white/5 rounded-2xl p-2.5 backdrop-blur-xl">
        {/* Input container */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-4 text-slate-400">
            <Search className="w-5 h-5 text-[#00D09C]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name or ticker (Tesla, Apple, Microsoft)"
            disabled={isLoading}
            className="w-full bg-transparent text-white placeholder-slate-500 border-0 rounded-xl pl-12 pr-4 py-3.5 text-base focus:outline-none focus:ring-0 disabled:opacity-50 transition-all duration-200"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-[#00D09C] hover:bg-[#00d09c]/90 text-[#030507] font-bold px-7 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,208,156,0.2)] hover:shadow-[0_0_30px_rgba(0,208,156,0.4)] active:scale-98 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:pointer-events-none group/btn cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Company</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
