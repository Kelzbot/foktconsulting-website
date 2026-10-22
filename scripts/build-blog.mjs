// Builds the blog from blog-src/posts. No dependencies: plain Node 20+.
//
//   node scripts/build-blog.mjs            build everything due today (Lagos date)
//   node scripts/build-blog.mjs --all      preview: build every post, due or not
//   node scripts/build-blog.mjs --date=2026-11-03   build as if it were that day
//
// Each post is blog-src/posts/<slug>.html: a JSON header in an HTML comment, then the article
// body as HTML. A post is published when its date has arrived and its status is "scheduled".
// Status "draft" or "hold" keeps it off the site whatever the date.
//
// Output (all generated, never edit by hand): blog/<slug>.html, blog/index.html, blog/feed.xml,
// blog/posts.json (read by the PostPilot tracker),
// and the blog entries in sitemap.xml. Pages for posts that are no longer due are removed, so
// putting a post on hold takes it down at the next build.
//
// The GitHub Action in .github/workflows/publish-blog.yml runs this every morning and commits
// the result; Cloudflare Workers Builds deploys the commit. blog-src/ and scripts/ are listed in
// .assetsignore, so future posts are never served before their date.

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "blog-src", "posts");
const OUT = join(ROOT, "blog");
const SITE = "https://foktconsulting.com";

const args = process.argv.slice(2);
const previewAll = args.includes("--all");
const dateArg = args.find((a) => a.startsWith("--date="))?.slice(7);

/** Today in Lagos (UTC+1, no DST), as YYYY-MM-DD. */
function lagosToday() {
  return new Date(Date.now() + 3600_000).toISOString().slice(0, 10);
}
const today = dateArg ?? lagosToday();

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function readPosts() {
  const posts = [];
  for (const file of readdirSync(SRC).filter((f) => f.endsWith(".html")).sort()) {
    const raw = readFileSync(join(SRC, file), "utf8");
    const m = raw.match(/^<!--\s*([\s\S]*?)\s*-->\s*([\s\S]*)$/);
    if (!m) throw new Error(`${file}: missing the JSON header comment`);
    const meta = JSON.parse(m[1]);
    for (const key of ["title", "description", "date", "status"]) {
      if (!meta[key]) throw new Error(`${file}: header needs "${key}"`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);
    const slug = file.replace(/\.html$/, "");
    const body = m[2].trim();
    const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    posts.push({ ...meta, slug, body, words, file });
  }
  return posts;
}

const longDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// The nav and footer match the rest of the site. If they change in index.html, change them here.
const NAV = `
  <a href="#main" class="skip-link">Skip to content</a>

  <nav class="nav" aria-label="Main">
    <div class="wrap nav__bar">
      <a href="/" class="brand" aria-label="FOKT Consulting home">
        <svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#14284B"/><path d="M9 6.5h12.5v3.7H13v3.9h7.4v3.7H13v8.2H9z" fill="#fff"/><path d="M18.6 22.6l2.3 2.3 4.6-5" fill="none" stroke="#5FC4C0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="brand__name">FOKT <span>Consulting</span></span>
      </a>
      <button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <ul class="nav__links" id="navLinks">
        <li><a href="/#findings">Findings</a></li>
        <li><a href="/#how">How it works</a></li>
        <li><a href="/#pricing">Pricing</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/#faq">FAQ</a></li>
        <li><a href="/#software">Software</a></li>
        <li><a href="https://cal.com/foktconsulting/20min" target="_blank" rel="noopener" class="btn btn--primary">Book a call</a></li>
      </ul>
    </div>
  </nav>`;

const FOOTER = `
  <footer class="footer" id="contact">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="/" class="brand" aria-label="FOKT Consulting home">
            <svg class="brand__mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="#fff"/><path d="M9 6.5h12.5v3.7H13v3.9h7.4v3.7H13v8.2H9z" fill="#14284B"/><path d="M18.6 22.6l2.3 2.3 4.6-5" fill="none" stroke="#0E7C7B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span class="brand__name">FOKT <span>Consulting</span></span>
          </a>
          <p class="footer__desc">Single Audit findings remediation for US nonprofits.</p>
          <div class="footer__contact">
            <a href="mailto:kelvin@foktconsulting.com">kelvin@foktconsulting.com</a>
            <a href="https://cal.com/foktconsulting/20min" target="_blank" rel="noopener">Book a 20-minute call</a>
            <a href="https://www.linkedin.com/in/oreoluwa-fawehinmi/" target="_blank" rel="noopener">Kelvin on LinkedIn</a>
          </div>
          <p class="footer__hours">Calls: Monday–Friday, 12–3 pm ET, booked online. Email replies within one US business day.</p>
        </div>
        <nav class="footer__col" aria-labelledby="footServices">
          <h2 id="footServices">Services</h2>
          <ul>
            <li><a href="/#how">Findings Review</a></li>
            <li><a href="/#pricing">Pricing</a></li>
            <li><a href="/#retest">Free retest note</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
        </nav>
        <nav class="footer__col" aria-labelledby="footSoftware">
          <h2 id="footSoftware">Software</h2>
          <ul>
            <li><a href="https://nofodesk.com" target="_blank" rel="noopener noreferrer">NofoDesk</a></li>
          </ul>
        </nav>
        <nav class="footer__col" aria-labelledby="footLegal">
          <h2 id="footLegal">Legal</h2>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/refund">Refund &amp; Cancellation</a></li>
          </ul>
        </nav>
      </div>
      <dl class="company">
        <div><dt>Legal name</dt><dd>FOKT Consulting LLC</dd></div>
        <div><dt>Entity</dt><dd>Wyoming limited liability company, formed November 2025</dd></div>
        <div><dt>Mailing address</dt><dd>30 N Gould St Ste R, Sheridan, WY 82801, United States</dd></div>
        <div><dt>Company contact</dt><dd><a href="mailto:support@foktconsulting.com">support@foktconsulting.com</a></dd></div>
      </dl>
      <p class="footer__legal">&copy; 2026 FOKT Consulting LLC. All rights reserved.</p>
    </div>
  </footer>

  <script>
    (function(){
      var toggle = document.getElementById('navToggle');
      var links  = document.getElementById('navLinks');
      function setOpen(open){
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open);
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
      toggle.addEventListener('click', function(){ setOpen(!links.classList.contains('is-open')); });
      links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setOpen(false); }); });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setOpen(false); });
    })();
  </script>`;

function head({ title, description, url, type = "website", extra = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#14284B">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="FOKT Consulting">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${SITE}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="alternate" type="application/rss+xml" title="FOKT Consulting blog" href="/blog/feed.xml">
  <link rel="preload" href="/assets/fonts/source-serif-4-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/public-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="/styles.css">${extra}
</head>
<body>
${NAV}
`;
}

const CLOSING = `
        <aside class="post-cta">
          <p class="post-cta__title">Got a finding that keeps coming back?</p>
          <p>A Findings Review takes one compliance requirement and every finding on it, repeats included, and leaves you with the procedures, a corrective action plan your funder can accept, and a self-test that proves the fix works. Fixed fee, about two weeks.</p>
          <div class="hero__actions">
            <a href="https://cal.com/foktconsulting/20min" target="_blank" rel="noopener" class="btn btn--primary">Book a 20-minute call</a>
            <a href="/#how" class="btn btn--quiet">How a Findings Review works</a>
          </div>
        </aside>`;

function articlePage(post, newer, older) {
  const url = `${SITE}/blog/${post.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: url,
    image: `${SITE}/assets/og-image.png`,
    author: { "@type": "Person", name: "Kelvin Fawehinmi", url: `${SITE}/#about` },
    publisher: { "@type": "Organization", name: "FOKT Consulting LLC", logo: { "@type": "ImageObject", url: `${SITE}/apple-touch-icon.png` } },
  };
  const minutes = Math.max(1, Math.round(post.words / 230));
  return `${head({
    title: `${post.title} | FOKT Consulting`,
    description: post.description,
    url,
    type: "article",
    extra: `\n  <script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  })}
  <main id="main">
    <header class="legal-top">
      <div class="wrap">
        <div class="legal-top__inner">
          <p class="breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span><a href="/blog">Blog</a></p>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="legal-updated"><time datetime="${post.date}">${longDate(post.date)}</time> · ${minutes} min read · Kelvin Fawehinmi</p>
        </div>
      </div>
    </header>
    <div class="wrap">
      <article class="post-body">
${post.body}
${CLOSING}
        <nav class="post-nav" aria-label="More posts">
          ${newer ? `<a href="/blog/${newer.slug}"><span>Newer</span>${escapeHtml(newer.title)}</a>` : "<span></span>"}
          ${older ? `<a href="/blog/${older.slug}"><span>Older</span>${escapeHtml(older.title)}</a>` : "<span></span>"}
        </nav>
      </article>
    </div>
  </main>
${FOOTER}

</body>
</html>
`;
}

function indexPage(posts) {
  const items = posts
    .map(
      (p) => `
          <li class="post-list__item">
            <p class="post-list__date"><time datetime="${p.date}">${longDate(p.date)}</time></p>
            <h2><a href="/blog/${p.slug}">${escapeHtml(p.title)}</a></h2>
            <p>${escapeHtml(p.description)}</p>
          </li>`,
    )
    .join("");
  return `${head({
    title: "Single Audit and Uniform Guidance blog | FOKT Consulting",
    description: "Plain-English answers about Single Audit findings, corrective action plans and the Uniform Guidance, for nonprofit finance and compliance teams.",
    url: `${SITE}/blog`,
  })}
  <main id="main">
    <header class="legal-top">
      <div class="wrap">
        <div class="legal-top__inner">
          <p class="breadcrumb"><a href="/">Home</a><span aria-hidden="true">›</span>Blog</p>
          <h1>Single Audit, in plain English</h1>
          <p class="legal-updated">Answers for nonprofit finance and compliance teams: what findings mean, what auditors test, and how to make a fix stick.</p>
        </div>
      </div>
    </header>
    <div class="wrap">
      <ol class="post-list" reversed>${items || `\n          <li class="post-list__item"><p>The first posts are on their way.</p></li>`}
      </ol>
    </div>
  </main>
${FOOTER}

</body>
</html>
`;
}

function feed(posts) {
  const items = posts
    .slice(0, 20)
    .map(
      (p) => `
    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid>${SITE}/blog/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T11:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(p.description)}</description>
    </item>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FOKT Consulting blog</title>
    <link>${SITE}/blog</link>
    <description>Single Audit findings, corrective action plans and the Uniform Guidance, in plain English.</description>
    <language>en-us</language>${items}
  </channel>
</rss>
`;
}

/** Replace the generated blog block in sitemap.xml, leaving the hand-written entries alone. */
function updateSitemap(posts) {
  const path = join(ROOT, "sitemap.xml");
  const xml = readFileSync(path, "utf8").replace(/\s*<!-- blog:start -->[\s\S]*<!-- blog:end -->/, "");
  const entries = [
    `  <url><loc>${SITE}/blog</loc><lastmod>${posts[0]?.date ?? today}</lastmod></url>`,
    ...posts.map((p) => `  <url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${p.updated ?? p.date}</lastmod></url>`),
  ];
  const block = `\n  <!-- blog:start -->\n${entries.join("\n")}\n  <!-- blog:end -->`;
  writeFileSync(path, xml.replace("</urlset>", `${block}\n</urlset>`));
}

const all = readPosts();
const due = all
  .filter((p) => previewAll || (p.status === "scheduled" && p.date <= today))
  .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));

if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
due.forEach((p, i) => writeFileSync(join(OUT, `${p.slug}.html`), articlePage(p, due[i - 1], due[i + 1])));
writeFileSync(join(OUT, "index.html"), indexPage(due));
writeFileSync(join(OUT, "feed.xml"), feed(due));
// For the PostPilot tracker: every published post with its date (CORS-enabled in _headers).
writeFileSync(join(OUT, "posts.json"), JSON.stringify(due.map((p) => ({ slug: p.slug, title: p.title, date: p.date })), null, 1));
if (!previewAll) updateSitemap(due);

const upcoming = all.filter((p) => !due.includes(p)).sort((a, b) => a.date.localeCompare(b.date));
console.log(`Blog built for ${today}: ${due.length} published, ${upcoming.length} waiting.`);
if (upcoming[0]) console.log(`Next: ${upcoming[0].date} ${upcoming[0].slug} (${upcoming[0].status})`);
