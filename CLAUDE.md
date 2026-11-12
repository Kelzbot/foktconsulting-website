# foktconsulting.com — notes for Claude Code

Static HTML/CSS site for FOKT Consulting LLC (Kelvin Fawehinmi). No framework, no build step for the
pages themselves. Every push to `master` is deployed by Cloudflare Workers Builds (`wrangler.jsonc`).
`.assetsignore` lists what Cloudflare must never publish.

## Blog (added 22 Oct 2026)

- **Sources:** `blog-src/posts/<slug>.html`. Each file starts with a JSON header inside an HTML comment
  (`title`, `description` ≤160 chars, `date` YYYY-MM-DD, `status`, `ideas`), then the article body as HTML
  (`<p>`, `<h2>`, `<h3>`, `<blockquote>`, `<table>`, `<span class="cite">2 CFR 200.xxx</span>`).
- **Status:** `scheduled` publishes on its date. `draft` or `hold` keeps it off the site whatever the date.
  Putting a published post on hold removes it at the next build.
- **Build:** `node scripts/build-blog.mjs` writes `blog/` (one page per due post, `index.html`, `feed.xml`,
  `posts.json`) and the blog block in `sitemap.xml`. `--all` previews every post, `--date=YYYY-MM-DD`
  builds as of that day. Never edit `blog/` by hand: it is regenerated.
- **Scheduling:** `.github/workflows/publish-blog.yml` runs the build at 06:00 UTC (07:00 Lagos) daily, on
  manual dispatch, and on pushes that change `blog-src/` or the script, then commits `blog/`,
  `sitemap.xml` and the homepage's latest-posts block in `index.html` if anything changed. That push is
  what deploys the new post. (Before 1 Nov 2026 it skipped `index.html`, so the homepage list went stale.)
- `blog-src/`, `scripts/` and `.github/` are in `.assetsignore`, so future posts are never served early.
- `blog/posts.json` is CORS-enabled in `_headers`: the PostPilot app reads it for its posts-per-month tracker.
- The nav and footer in `scripts/build-blog.mjs` copy the ones in `index.html`. Change both together
  (and `404.html`, `terms.html`, `privacy.html`, `refund.html`), as the README says.

## Content calendar

Two posts a week (Tuesday and Thursday) from 22 Oct 2026 to 21 Jan 2027, drawn from Kelvin's PostPilot
Idea Bank question bank (Single Audit findings, Uniform Guidance). The `ideas` field in each header is the
PostPilot idea id.

## SEO, add-on offers and NofoDesk (updated 1 Nov 2026)

All in `outreach/` (private, in `.assetsignore`):
- `dashboard.html`: Semrush US comparison vs smartgrantsolutions.com, thompsongrants.com, hungerford.com, jmco.com
  (top pages, keyword gaps, clean backlink gaps, upsell map). Semrush has no organic data for FOKT yet (AS 2,
  all 204 referring domains are spam).
- `addon-offers.md`: every add-on written out (who, deliverables, rules, suggested price, selling order).
  New offers are **not on the website**. Suggested prices await Kelvin's decision.
- `monday-readiness-map.md`: pre-send checklist, what to study, guardrails, and the week of 2 Nov plan.
  The batch goes only to findings with a retest note (B, C, I, L, M). The E note is written (3 Nov).
- `nofodesk-gap-plan.md`: what NofoDesk actually does (read from the `Kelzbot/nofodesk` code), the US
  post-award gaps, and the build order. NofoDesk work belongs in the nofodesk repo, not here.
- index.html now describes NofoDesk as a grant management workspace (the old "every field in about 30
  seconds" line undersold it).
- Waiting on Kelvin: DKIM check in Zoho, prices for new offers, whether to offer fractional work.
  The NofoDesk post-award build is done and live (1 Nov 2026, see `NOFODESK_STATE.md` in that repo).
- CAP template page is live at `/corrective-action-plan-template` (3 Nov 2026), with Word and Excel downloads in
  `assets/samples/`, linked from the CAP blog post and listed in `sitemap.xml`. There's no email gate because the
  site has no form backend. Add one only with a form service Kelvin picks.
- Retest notes now cover B (PDF sample), C, E, I, L and M. Still missing: N, internal control, F, G, H, J.
- Code repos now live in `C:\Users\ofawehinmi\GitHub` (outside OneDrive, 3 Nov 2026). NofoDesk is at
  `GitHub\nofodesk` (full history). This repo, TailorDesk, wahala-junction and mer-capture were open in other
  windows and are still waiting to be moved there. A stray Supabase CLI cache for the NofoDesk project
  sits in this repo's `supabase/`. It's git-ignored and safe for Kelvin to delete.
- Next for the site: free profiles (Crunchbase, Pitchbook, Curlie, Substack), then indirect-cost and
  time-and-effort posts (both KD under 10).

## Audit-firm lane (12 Nov 2026)

Where we are: about 259 cold emails to nonprofits got no positive reply, so the next outreach goes to small audit
firms whose nonprofit clients carry repeat findings (they introduce the client, the client hires FOKT).
- `audit-firms.html` is **live at `/audit-firms`** (merged to master and pushed 12 Nov on Kelvin's OK, a97ca9b).
  Linked from the footer Services column of every page and `scripts/build-blog.mjs` ("For audit firms"), not
  from the top nav (already nine items). Branch `audit-firms-page` is merged and can be deleted.
- Motion (live): one block at the end of `styles.css`, CSS only, no script. Hero rises in on load, blocks
  rise in on scroll, a progress line under the nav, card hover lifts, FAQ slides open, a slow glow in the closing
  band, cross-fade between pages. All of it sits inside `prefers-reduced-motion:no-preference`, and the scroll
  parts inside `@supports (animation-timeline:view())`, so other browsers show the page still. Reveals animate
  `translate` and hovers `transform`: keep them apart or a revealed card stops lifting. Seen working on the home
  and audit-firms pages in Chrome. Live page at 375 px: no sideways scroll, menu opens, cards stack (measured, not
  eyeballed). Not checked: Safari, Firefox, blog pages.
- Firm list: `Desktop\Outreach\audit-firms-2024.csv` (118 firms, sorted by clients with repeat findings; the first
  58 have 3 or more, the rest 2). Public fac.gov data, FY2024, nonprofit auditees, repeat findings on requirements
  A B C E I L M N, 5 to 150 nonprofit audits, national firms excluded. Rebuild with `audit_firms.py OUT.csv [YEAR]`
  beside it (`FAC_API_KEY` or the slow `DEMO_KEY`, which took about 10 minutes).
- The page says FOKT pays and accepts no referral fees. Keep outreach consistent with that.
- Next for Kelvin: DKIM check in Zoho, then 10 firms a week from his own mailbox, top of the list first. Review
  at day 30 (3 real conversations or rework).
- `support@foktconsulting.com` (in every footer and `index.html` JSON-LD): Kelvin says the mailbox is active again
  (12 Nov). Not test-mailed.

## Writing rules for posts

- First person, Kelvin. Plain US English for nonprofit finance and compliance staff.
- No em dashes, en dashes or semicolons. No tidy groups of three. No moral or summary at the end, no
  closing question. No "here's the thing", "game-changer", "dive in".
- Never present Kelvin's or FOKT's work as AI-written.
- Cite the 2024 revision. Time and effort is 2 CFR 200.430(g), not (i) (fixed everywhere on 1 Nov 2026).
- Facts only from the regulation (cite the 2 CFR 200 section) or from Kelvin's notes. Don't invent
  numbers, clients or results. Leave dollar thresholds out unless certain they are current.
- Things that change and need re-checking before their date: the proposed Uniform Grants Regulation
  (blocked from being finalized before 11 Dec 2026) and the 2026 Compliance Supplement's status.
- Every post ends with the standard Findings Review call-to-action, which the build script adds.
