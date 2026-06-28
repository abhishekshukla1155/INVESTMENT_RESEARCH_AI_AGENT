import React from 'react';

/**
 * @file page.js (Privacy Policy)
 * @description Minimal, honest privacy policy page.
 */
export const metadata = {
  title: 'Privacy Policy — INVESTOR AI',
  description: 'Privacy Policy for INVESTOR AI, a multi-agent investment research platform.'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030507] text-[#f8fafc] px-6 md:px-12 py-20">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* Back nav */}
        <a href="/" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-[#00D09C] transition-colors font-mono uppercase tracking-wider">
          ← Back to INVESTOR AI
        </a>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 font-mono">Last updated: June 2026</p>
        </div>

        <div className="space-y-8 text-sm text-slate-400 leading-relaxed">

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">1. What this application is</h2>
            <p>
              INVESTOR AI is a portfolio project demonstrating multi-agent AI investment research.
              It is not a licensed financial advisor. All analysis is for educational and demonstration
              purposes only and should not be used to make real investment decisions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">2. Data we collect</h2>
            <p>
              When you use the analysis tool, the company name you enter is sent to our backend API,
              which queries Tavily Search and Yahoo Finance. We do not store search queries or results
              in any persistent database.
            </p>
            <p>
              If you sign in using Google OAuth, your name and email address are returned by Google
              and held in your browser session only. We do not store credentials on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">3. Third-party services</h2>
            <ul className="list-disc list-inside space-y-1.5 text-slate-400">
              <li><strong className="text-slate-300">Tavily Search API</strong> — used to retrieve real-time web information about companies.</li>
              <li><strong className="text-slate-300">Yahoo Finance</strong> — used to retrieve publicly available financial data.</li>
              <li><strong className="text-slate-300">Google Gemini API</strong> — used to generate AI reasoning and summaries.</li>
              <li><strong className="text-slate-300">Google OAuth</strong> — optional authentication provider.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">4. No financial advice</h2>
            <p>
              Nothing on this platform constitutes financial advice, investment recommendations,
              or solicitation to buy or sell securities. INVESTOR AI is a technology demonstration
              using AI models to simulate institutional research workflows.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">5. Contact</h2>
            <p>
              For questions about this policy, contact:{' '}
              <a href="mailto:contact@investorai.dev" className="text-[#00D09C] hover:underline">
                contact@investorai.dev
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
