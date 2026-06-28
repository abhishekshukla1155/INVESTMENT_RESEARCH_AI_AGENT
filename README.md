# INVESTOR AI — Multi-Agent Investment Research Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-1.5-green)](https://langchain.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5--flash-blue?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

INVESTOR AI is a multi-agent system that researches publicly listed companies and produces structured investment recommendations. Enter any company name or ticker — the system dispatches three independent AI agents (a Bull Analyst, a Bear Analyst, and a Chief Investment Officer) that each receive the same verified research context and argue to a final `INVEST / WATCH / PASS` verdict.

The project was built to explore adversarial prompting and multi-agent coordination as an alternative to a single monolithic LLM call. Rather than asking one model to "be balanced," each agent is given a fixed mandate (buy, sell, or arbitrate) and constrained to the same shared evidence base. The tension between the Bull and Bear agents is where the nuanced reasoning emerges.

It combines real-time web intelligence (Tavily Search), live financial metrics (Yahoo Finance), LLM reasoning (Google Gemini via LangChain), and a rule-based scoring engine to produce an institutional-style investment dashboard — all within a Next.js full-stack application.

---

## Features

| Feature | Description |
|---|---|
| **Company Resolver** | Disambiguates raw user input (e.g. "F1" → Formula One) before any research begins, preventing data source mismatch |
| **Real-time Web Research** | Tavily Search API retrieves current news, competitive landscape, and qualitative context |
| **Live Financial Data** | Yahoo Finance supplies revenue growth, profit margins, P/E ratio, market cap, and debt metrics |
| **Bull Analyst Agent** | Role-conditioned LLM with a permanent BUY mandate — builds the strongest possible investment case |
| **Bear Analyst Agent** | Role-conditioned LLM with a permanent SELL mandate — surfaces every risk and concern |
| **CIO Judge Agent** | Reads both reports, arbitrates the debate, and issues a final committee decision with reasoning |
| **Investment Score Calculator** | Deterministic rule-based scoring across financial strength, market position, valuation, and risk |
| **INVEST / WATCH / PASS** | Three-tier verdict system with confidence score on a 0–100 scale |
| **Debate Visualisation** | Animated Bull vs Bear comparison matrix with influence indicators and confidence bars |
| **Executive Summary** | Gemini-generated qualitative overview and reasoning paragraph |
| **Financial Dashboard** | Market cap, P/E, revenue growth, margins, and debt displayed as structured metrics |
| **Research Sources** | Verified source links with favicons displayed alongside the analysis |
| **Google Authentication** | Sign-in via Google OAuth or email/password (NextAuth v5) |
| **Responsive UI** | Dark institutional-grade dashboard built with Tailwind CSS and Lucide icons |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Backend** | Next.js API Routes (Node.js runtime) |
| **AI / LLM** | Google Gemini 2.5 Flash via LangChain (`@langchain/google-genai`) |
| **Web Research** | Tavily Search API |
| **Financial Data** | `yahoo-finance2` |
| **Authentication** | NextAuth v5 (Google OAuth + Credentials) |
| **Styling** | Tailwind CSS v4, Lucide React icons |
| **Package Manager** | npm |

---

## Folder Structure

```
ai-investment/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.js       # Main orchestration API route
│   │   │   └── auth/[...nextauth]/    # NextAuth handler
│   │   ├── login/page.js              # Authentication page
│   │   ├── privacy/page.js            # Privacy policy
│   │   ├── layout.js
│   │   └── page.js                    # Landing page + analysis UI
│   ├── ai/
│   │   ├── agents/
│   │   │   ├── bullAnalyst.js         # Bull Analyst agent
│   │   │   ├── bearAnalyst.js         # Bear Analyst agent
│   │   │   └── cioJudge.js            # Chief Investment Officer agent
│   │   ├── debateOrchestrator.js      # Coordinates the 3-agent debate
│   │   ├── investmentAnalyzer.js      # Main Gemini analysis + scoring
│   │   └── researchAgent.js           # Research coordination layer
│   ├── components/
│   │   ├── DebatePanel.jsx            # Debate visualisation component
│   │   ├── ResultCard.jsx             # Analysis results dashboard
│   │   ├── SearchBox.jsx              # Company search input
│   │   └── Loader.jsx                 # Multi-stage loading indicator
│   ├── tools/
│   │   ├── companyResolver.js         # Company disambiguation agent (NEW)
│   │   ├── webSearchTool.js           # Tavily API integration
│   │   └── financeTool.js             # Yahoo Finance integration
│   ├── utils/
│   │   └── scoreCalculator.js         # Rule-based investment scorer
│   └── auth.js                        # NextAuth v5 config
├── .env.local                          # API keys (not committed)
├── package.json
└── README.md
```

---

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-investment.git
cd ai-investment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Google Gemini API — https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily Search API — https://tavily.com/
TAVILY_API_KEY=your_tavily_api_key_here

# NextAuth v5 — generate with: npx auth secret
AUTH_SECRET=your_auth_secret_here

# Google OAuth (optional — for "Continue with Google")
# Create credentials at: https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** Email/password sign-in works without Google OAuth credentials configured. Google login requires `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

---

## How It Works

```
User Input (e.g. "F1", "Apple", "Infosys")
          │
          ▼
┌─────────────────────┐
│  Company Resolver   │  Disambiguates raw query → verified (companyName, ticker)
└─────────┬───────────┘  Returns suggestions if ambiguous (e.g. "AI" → multiple matches)
          │
          ▼
┌─────────────────────┐
│  Research Agent     │  Dispatches two parallel calls:
│  (One shared call)  │  ├── Tavily Search → web news, competitive context
└─────────┬───────────┘  └── Yahoo Finance → financial metrics
          │
          ├──────────────────────────────────┐
          ▼                                  ▼
┌──────────────────┐              ┌──────────────────────┐
│ Investment       │              │ Debate Orchestrator  │
│ Analyzer         │              │                      │
│ (Gemini summary) │              │ ┌──────────────────┐ │
└────────┬─────────┘              │ │  Bull Analyst    │ │
         │                        │ │  (BUY mandate)   │ │
         │                        │ └──────────────────┘ │
         │                        │ ┌──────────────────┐ │
         │                        │ │  Bear Analyst    │ │
         │                        │ │  (SELL mandate)  │ │
         │                        │ └──────────────────┘ │
         │                        │ ┌──────────────────┐ │
         │                        │ │  CIO Judge       │ │
         │                        │ │  (Arbitration)   │ │
         │                        │ └──────────────────┘ │
         │                        └──────────┬───────────┘
         │                                   │
         └──────────────┬────────────────────┘
                        ▼
              ┌──────────────────┐
              │ Score Calculator │  Deterministic weighted scoring
              └────────┬─────────┘
                       ▼
              Frontend Dashboard
         (INVEST / WATCH / PASS + full report)
```

| Stage | What Happens |
|---|---|
| **Company Resolution** | Raw query → Yahoo Finance search → token-overlap scoring → verified `(name, ticker)` |
| **Research Collection** | Tavily receives verified name; Yahoo Finance receives verified ticker — same entity guaranteed |
| **Investment Analyzer** | Gemini summarises qualitative research and identifies strengths and risks |
| **Bull Analyst** | Role-conditioned agent with BUY mandate builds the strongest positive case from shared context |
| **Bear Analyst** | Role-conditioned agent with SELL mandate surfaces every risk from the same shared context |
| **CIO Judge** | Reads both analyst reports and issues the final committee decision with reasoning |
| **Score Calculator** | Applies deterministic weights across financial strength, valuation, market position, and risk |

---

## Multi-Agent Debate

Each agent receives **the same shared research context object** — Tavily text and Yahoo Finance metrics collected exactly once. Agents differ only in their mandate:

```js
// sharedResearch passed identically to all agents
{
  company:       "Apple Inc.",
  ticker:        "AAPL",
  searchData:    "...",   // Tavily web text
  financialData: { ... }, // Yahoo Finance metrics
  sources:       [...]
}
```

| Agent | Mandate | Output |
|---|---|---|
| **Bull Analyst** | Build strongest possible BUY case | `{ points[], confidence, summary }` |
| **Bear Analyst** | Build strongest possible SELL case | `{ points[], confidence, summary }` |
| **CIO Judge** | Read both reports, issue final verdict | `{ decision, confidence, reasoning }` |
| **Score Calculator** | Deterministic weighted scoring (no LLM) | `{ score, decision }` |

The CIO does **not** average the analyst scores — it reads their actual arguments and evaluates argument quality, matching how a real investment committee operates.

---

## Key Engineering Decisions

**Why LangChain?**
LangChain abstracts the Gemini API behind a standard `ChatModel` interface. Switching to a different LLM (e.g. Claude, GPT-4) requires changing one constructor call, not rewriting prompt infrastructure.

**Why multiple agents instead of one prompt?**
A single balanced prompt produces hedged, uncommitted output. Role-conditioned adversarial agents (one permanently bullish, one permanently bearish) produce sharper, more specific reasoning. The committee structure mirrors how institutional investment decisions are actually made.

**Why Tavily over direct Google Search?**
Tavily's API returns structured result objects (title, URL, content) designed for LLM consumption. Direct Google Search scraping is rate-limited, legally grey, and returns HTML that requires parsing.

**Why Yahoo Finance for financial data?**
`yahoo-finance2` provides structured financial metrics (revenue growth, margins, P/E, market cap) without requiring a paid data subscription. It covers the majority of global equities sufficient for a portfolio project.

**Why a rule-based Score Calculator instead of asking the LLM to score?**
LLM-generated scores are non-deterministic — the same inputs can produce different scores across runs. The weighted rule-based calculator produces the same score for the same inputs every time, making the system's investment logic auditable and predictable.

**Why Next.js?**
Next.js App Router allows backend API routes and React frontend to coexist in a single codebase without a separate Express server. This simplifies deployment and keeps the project runnable with a single `npm run dev` command.

**Why a Company Resolver as a separate step?**
Without it, "F1" sent to Yahoo Finance's search returns "Fu Yu Corporation (F13.SI)" while Tavily returns Formula One content — two different companies in the same analysis. The resolver canonicalises the user query to a single verified entity before either tool is called.

---

## Trade-offs

| Trade-off | Reason |
|---|---|
| No database | Simplicity — each analysis is stateless and results are not persisted |
| No historical portfolio tracking | Out of scope for this project phase |
| No response streaming | Simplifies frontend state management at the cost of perceived latency |
| No Redis caching | Analysis results are always fresh; caching would require TTL logic for financial data |
| Limited financial ratios | Yahoo Finance's free tier doesn't expose segment revenue, FCF, or full balance sheet |
| Single-user demo | No multi-tenancy, rate limiting, or per-user analytics |
| Email/password auth is demo-only | Credentials provider accepts any valid email without a real database |
| No SEC / annual report parsing | Would require a PDF extraction pipeline (future improvement) |

---

## Example Runs

### Example 1 — Tesla

| Field | Value |
|---|---|
| **Input** | `Tesla` |
| **Resolved** | Tesla, Inc. (TSLA) |
| **Recommendation** | WATCH |
| **Score** | 62 / 100 |
| **Summary** | Tesla maintains EV market leadership and strong brand recognition, but decelerating growth and margin compression from price cuts weigh on the near-term outlook. The Bull case rests on energy storage and FSD optionality; the Bear case highlights intensifying competition and elevated valuation multiples. |

### Example 2 — Apple

| Field | Value |
|---|---|
| **Input** | `Apple` |
| **Resolved** | Apple Inc. (AAPL) |
| **Recommendation** | INVEST |
| **Score** | 78 / 100 |
| **Summary** | Apple's services segment provides high-margin recurring revenue that offsets hardware cyclicality. The company's ecosystem lock-in, strong balance sheet, and capital return programme support a constructive long-term investment thesis despite rich valuation multiples. |

### Example 3 — Infosys

| Field | Value |
|---|---|
| **Input** | `Infosys` |
| **Resolved** | Infosys Limited (INFY) |
| **Recommendation** | WATCH |
| **Score** | 58 / 100 |
| **Summary** | Infosys benefits from stable IT services demand and a disciplined operating model, but faces near-term headwinds from client discretionary spending cuts and currency volatility. Margins remain healthy; the growth re-acceleration timeline is the key monitoring variable. |

---

## Future Improvements

- **Portfolio management** — track multiple companies and aggregate exposure across sectors
- **Watchlists** — save companies for periodic re-analysis
- **Vector database (RAG)** — store past analyses and surface relevant historical context
- **News sentiment analysis** — weight recent news sentiment into the scoring engine
- **SEC filing integration** — parse 10-K/10-Q filings for financial detail beyond Yahoo Finance
- **Multi-LLM support** — allow switching between Gemini, GPT-4, and Claude per-agent
- **Streaming responses** — stream the analysis to the frontend as tokens are generated
- **Agent memory** — give agents access to prior analyses for the same company
- **Redis caching** — cache financial data with a short TTL to reduce API calls
- **Historical trend analysis** — overlay analysis outputs over time for the same company
- **Quantitative backtesting** — validate the scoring engine against historical stock returns

---

## LLM Development Process

This project was developed with extensive AI assistance throughout the engineering process.

AI was used for:
- **Architecture design** — outlining the multi-agent pipeline structure and separation of concerns
- **Prompt engineering** — iterating on role-conditioned analyst prompts and CIO arbitration prompts
- **Bug diagnosis** — identifying the root cause of the company mismatch bug (F1 → Fu Yu Corporation) and designing the resolver pattern
- **Code review** — reviewing API integration patterns for LangChain, Yahoo Finance, and NextAuth
- **UI iteration** — refining the debate panel layout, visual hierarchy, and component structure
- **Documentation** — drafting inline JSDoc comments and architecture notes

Complete conversation transcripts and interaction logs from the development process are included separately as part of the submission for evaluation purposes.

---

## Screenshots

> **Hero / Landing Page**
> `[screenshot: landing-page.png]`

> **Analysis Dashboard — Result Card**
> `[screenshot: result-card.png]`

> **Multi-Agent Debate Panel — Bull vs Bear**
> `[screenshot: debate-panel.png]`

> **Financial Intelligence Dashboard**
> `[screenshot: financial-dashboard.png]`

> **Authentication — Login Page**
> `[screenshot: login-page.png]`

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Abhishek Shukla**

- GitHub: [github.com/your-username](https://github.com/your-username)
- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

---

*Built as a portfolio demonstration of multi-agent AI system design, LangChain integration, and institutional-grade investment research automation.*
