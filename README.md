# foktconsulting.com

Marketing site and legal pages for **FOKT Consulting LLC**, a Wyoming company that helps US
nonprofits fix Single Audit findings and builds software for grant professionals.

Live at **[foktconsulting.com](https://foktconsulting.com)**, served through Cloudflare.

## What's here

Static HTML and CSS. No build step, no dependencies, no framework.

| File | Purpose |
|------|---------|
| `index.html` | Homepage: Findings Review offer, pricing, founder, FAQ, software |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `refund.html` | Refund &amp; Cancellation Policy |
| `404.html` | Page shown for broken links |
| `styles.css` | All styling |
| `assets/` | Self-hosted fonts, founder photos, NofoDesk logo, social share image and the sample retest note PDF (`assets/samples/`) |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` | Site icons |
| `robots.txt`, `sitemap.xml` | Search engine files |
| `_headers` | Cloudflare security and cache headers |

The legal pages share the homepage's navigation and footer. If you change the nav or footer in
`index.html`, copy the same change into `terms.html`, `privacy.html`, `refund.html` and `404.html`.

The three legal pages are the ones referenced from the product, so they need to stay
publicly reachable at stable URLs.

## Products

**[NofoDesk](https://nofodesk.com)** — AI-powered grant management for grant writers, program
managers and research administrators. Extracts structured data from any funding notice in
seconds, drafts proposals, tracks deadlines, and manages the full pipeline in one place.

## Local preview

Serve the directory (pages use root-relative paths, so opening the file directly won't load
styles):

```
python -m http.server 8000
```

Cloudflare serves `terms.html` at `/terms`. `python -m http.server` doesn't, so open
`/terms.html` locally instead.

---

FOKT Consulting LLC · Wyoming, United States · support@foktconsulting.com
