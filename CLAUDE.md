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
- Local NofoDesk repo: `Documents\nofodesk` (full history). A stray Supabase CLI cache for the NofoDesk project
  sits in this repo's `supabase/`. It's git-ignored and safe for Kelvin to delete.
- Next for the site: free profiles (Crunchbase, Pitchbook, Curlie, Substack), then indirect-cost and
  time-and-effort posts (both KD under 10).

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
