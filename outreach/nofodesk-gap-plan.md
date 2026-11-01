# NofoDesk: what it does, what US buyers will ask for, and the build order (1 Nov 2026)

Read from the `Kelzbot/nofodesk` code on GitHub (main branch, last commit 9 Oct 2026), not from the marketing copy.

## What the website said vs what NofoDesk is

The site said NofoDesk "extracts every field in about 30 seconds". That's one feature out of many. It now reads (fixed on index.html, 1 Nov):
"A grant management workspace for teams running several awards..."

What is actually built:

| Area | Built | Where in the code |
|---|---|---|
| Read a NOFO, funder page, PDF, Word or Excel into a grant record, with schemas for PEPFAR, USAID, NIH, Gates, WHO/TDR, CDC | Yes | `routes/extract.js`, `lib/gemini.js` |
| Conflicts and provenance: flags when a notice states a field twice, or the portal and the page disagree | Yes | `lib/provenance.js` |
| Grant tracker across the lifecycle (application, active, completed, terminated), import from Excel | Yes | `client/src/pages/TrackerPage.js` |
| Calendar plus email alerts at 90/60/30/7/3/1 days | Yes | `CalendarPage.js`, cron in server |
| Discovery: Grants.gov, ReliefWeb, FundsForNGOs, EU portal, World Bank tenders, watched funder pages | Yes | `routes/discover.js`, `lib/watch.js` |
| Award Setup: read the Notice of Award, conditions with clocks, reporting calendar through closeout, restricted funds | Yes | `lib/award.js`, `AwardSetupPage.jsx` |
| Funder rule packs (object classes, indirect base, MTDC exclusions, de minimis 15% from 1 Oct 2024) | Yes: USAID, CDC, Global Fund, generic | `funders/*.json` |
| Budget builder where code (not the model) does every total. Justifications, funder templates | Yes | `lib/budget.js`, `lib/budgetJustify.js` |
| Budget call to departments, CDC monthly spend plan, Level of Effort month-on-month comparison | Yes | `lib/budgetCall.js`, `lib/cdcSpendPlan.js`, `lib/loe.js` |
| Subaward / site agreements generated from one template, signature round trip tracked | Yes | `lib/agreements.js` |
| Team workspaces with roles, Google Drive folder per grant, PowerPoint and Excel export, AI chat | Yes | various |

## What a US nonprofit expects from "grant management software" that NofoDesk doesn't have

Checked by searching the server and page code for each term. None of these exist today.

| Missing | Why a US buyer asks for it | Rule |
|---|---|---|
| **Budget vs actual** (import actuals from QuickBooks, Sage Intacct or a GL export, show burn rate and variance per line) | The first question every finance director asks. Without it NofoDesk is a planning tool, not a management tool. | 2 CFR 200.302 (financial management), 200.308 (budget revisions) |
| **Single Audit findings and CAP tracker** (finding, CAP steps, owner, due date, evidence per step, retest-ready status, export the Summary Schedule of Prior Audit Findings) | It's exactly what FOKT sells, so it ties the product to the service. Every Findings Review client gets a seat. | 2 CFR 200.511, 200.521 |
| **Subrecipient monitoring** (risk assessment, monitoring plan, sub report due dates, check each sub's Single Audit on the FAC) | Agreements are built, but monitoring after signature is not. Pass-through entities must do it, and auditors test it as requirement M. | 2 CFR 200.332 |
| **Time-and-effort certification** (per-person periodic sign-off built on the LoE comparison) | Payroll is usually the biggest cost on an award and auditors test the records behind it. | 2 CFR 200.430(g) |
| **SF-425 and drawdowns** (FFR figures from actuals, drawdown log, days of cash on hand) | Federal financial reporting and cash management are two of the twelve compliance requirements. | 2 CFR 200.305, 200.328 |
| Equipment inventory | Needed for any award that buys equipment | 2 CFR 200.313(d) |
| Procurement file checklist per purchase | Procurement findings are one of FOKT's target areas, and the fix is a complete file for every purchase | 2 CFR 200.318–200.320 |
| SAM.gov registration expiry reminder | Lapsed SAM registration blocks drawdowns. UEI is already parsed from the NOA, so the hook exists. | 2 CFR 25 |

**Rule bug to fix first (5 minutes):** `funders/usaid.json` keeps only the first **$25,000** of each subaward in the MTDC base. Since the 2024 revision (awards from 1 Oct 2024), 2 CFR 200.1 sets it at the first **$50,000**. `cdc.json` and `lib/budget.js` already use $50,000. A NICRA can define its own base, so keep it editable, but the default for de minimis should be $50,000.

Non-feature gaps that will cost US sales:

- **Positioning and checkout.** Copy says "Built for Africa", with NGN pricing and Flutterwave. That's fine for Africa, but US buyers need a US page, card checkout in USD and a short security answer sheet.
- **Security questions.** `NOFODESK_AUDIT_REPORT.md` lists RLS disabled, auth tokens in localStorage and CSP disabled. A 11 Sep commit says it closed the readiness-review findings. Confirm which of those three are still open before a US buyer sends a security questionnaire.
- USAID funding has largely moved to the State Department since 2025. Check that the "USAID" schema and copy still match how US clients describe their awards.

## Build order, week of 2 Nov 2026

Not everything fits in one week. In order of money:

| Day | Build | Reuses |
|---|---|---|
| Mon (first) | Fix the USAID $25,000 → $50,000 MTDC subaward default above. | `funders/usaid.json` |
| Mon–Tue | **Findings and CAP tracker.** New `audit_findings` table on the jsonb pattern, finding fields (number, compliance requirement letter, program, repeat flag, questioned costs), CAP steps with owner, due date and evidence file, calendar alerts, export of the Summary Schedule. | Tracker tables, calendar, alerts, Drive folder per grant |
| Wed | **Budget vs actual (CSV/Excel import).** Map GL accounts to budget lines once, then upload actuals monthly. Variance, burn rate, and a flag on lines that may need prior approval under the award terms. | Budget engine, ExcelJS import |
| Thu | **US landing page on nofodesk.com** for "grant management software for nonprofits": describe exactly what's built, put USD pricing first, and add the security answer sheet. | Landing page |
| Fri | Security check of the three audit items above. Then start subrecipient monitoring (risk assessment form and FAC lookup for each sub). | Agreements module |
| Next week | Time-and-effort certification, SF-425/drawdown, equipment, procurement checklist, SAM expiry. | LoE comparison, award record |

This work happens in the `nofodesk` repo, not this one. Run it in its own session. The repo would not clone over git on 1 Nov (index-pack error), so check the network or clone with `--depth 1` from a stable connection first.
