# Nirmaan · Your tax. Your say.

A concept prototype, built in public: India's income-tax payers choose how **10%** of their tax is spent, across national, state and city projects, and track every rupee to the last mile with purpose-bound **e-Rupee**.

> Demo only. Not affiliated with the Government of India, RBI or the Income Tax Department. Personas, projects, vendors and transactions are illustrative.

## The demo flow

| Route | What it shows |
|---|---|
| `/` | The pitch: problem, how it works, the three tiers, last-mile tracking and the win-win |
| `/login` | PAN + OTP demo login with four sample taxpayers |
| `/you` | Income tax under the FY 2026-27 new regime, split 90% / 10% |
| `/essentials` | Where your 90% goes, using Union Budget 2026-27 "rupee goes to" data |
| `/build` | Project marketplace: My City / State / National, filtered by category |
| `/basket` | Split your 10% with sliders and see the matching your backing unlocks |
| `/confirm` | e₹ minting animation and a shareable "Nation Builder" card |
| `/impact` | The e₹ trail, hop by hop, with fast-forward through time, milestones and geotagged proof |
| `/fairness` | The ₹1 Cr vs ₹1 L question, answered with quadratic funding (square-root voice) |
| `/government` | The government's view: demand signal, participation and the case for a pilot |

Sample PANs: `ABCPR4821K` (Bengaluru), `PQRPK7310M` (Pune), `LMNPS2290D` (Delhi), `XYZPM5567Q` (Mumbai, ₹1.2 Cr income). Any PAN-format ID also works.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

The site is static (Vite + React), so `npm run build` writes `dist/`. `netlify.toml` already sets the build command, publish directory and SPA redirects. To deploy, connect the GitHub repo in Netlify and it builds on every push.

## Where the numbers come from

- **Tax**: new-regime slabs for FY 2026-27 (unchanged from Budget 2025): ₹75,000 standard deduction, 87A rebate up to ₹12 L taxable, surcharge and 4% cess. See [`src/lib/tax.ts`](src/lib/tax.ts).
- **90% breakdown**: Union Budget 2026-27, "where the rupee goes / comes from" (BE). Total expenditure ₹53.47 L Cr, income-tax BE ₹14.66 L Cr. See [`src/data/budget.ts`](src/data/budget.ts).
- **Projects**: illustrative, inspired by Budget 2026 themes (ISM 2.0, IndiaAI, Khelo India Mission, AVGC labs, City Economic Regions) and common urban civic issues. See [`src/data/projects.ts`](src/data/projects.ts).
- **Matching**: quadratic funding run per tier. See [`src/lib/qf.ts`](src/lib/qf.ts).

## Roadmap ideas

- Live budget data from PFMS / Open Budgets India
- Citizen-proposed projects with upvotes
- A recording-friendly guided tour mode for the 90-second demo video
