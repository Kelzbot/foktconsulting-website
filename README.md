# foktconsulting.com

Marketing site and legal pages for **FOKT Consulting LLC** — a software company registered in
Wyoming, United States.

Live at **[foktconsulting.com](https://foktconsulting.com)**, served through Cloudflare.

## What's here

Static HTML and CSS. No build step, no dependencies, no framework.

| File | Purpose |
|------|---------|
| `index.html` | Company site — products, about, contact |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `refund.html` | Refund &amp; Cancellation Policy |
| `styles.css` | All styling |
| `favicon.svg` | Site icon |

The three legal pages are the ones referenced from the product, so they need to stay
publicly reachable at stable URLs.

## Products

**[NofoDesk](https://nofodesk.com)** — AI-powered grant management for grant writers, program
managers and research administrators. Extracts structured data from any funding notice in
seconds, drafts proposals, tracks deadlines, and manages the full pipeline in one place.

## Local preview

No tooling required — open `index.html` in a browser, or serve the directory:

```
python -m http.server 8000
```

---

FOKT Consulting LLC · Cheyenne, Wyoming · support@foktconsulting.com
