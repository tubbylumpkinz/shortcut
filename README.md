<div align="center">
  <img src="docs/mark.svg" width="76" height="76" alt="Shortcut logo">
  <h1>Shortcut</h1>
  <p><strong>Small advantages for online life.</strong><br>
  A fast, dependency-free blog and link library for people who live in a browser.</p>
</div>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="Dependencies: none" src="https://img.shields.io/badge/dependencies-0-2ea44f?style=flat-square">
  <img alt="Lighthouse 100 / 100 / 100" src="https://img.shields.io/badge/lighthouse-100%20%2F%20100%20%2F%20100-ff6a3d?style=flat-square">
</p>

<p align="center">
  <a href="#preview">Preview</a> &nbsp;·&nbsp;
  <a href="#features">Features</a> &nbsp;·&nbsp;
  <a href="#quick-start">Quick start</a> &nbsp;·&nbsp;
  <a href="#project-structure">Structure</a> &nbsp;·&nbsp;
  <a href="#adding-content">Adding content</a> &nbsp;·&nbsp;
  <a href="#customising">Customising</a> &nbsp;·&nbsp;
  <a href="#deploy">Deploy</a>
</p>

---

## Preview

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="docs/home-light.jpg">
    <img src="docs/home-dark.jpg" width="860" alt="Shortcut home page: large serif headline over a warm dark grid, with a tip card showing browser keyboard shortcuts">
  </picture>
</p>

<p align="center"><sub>The home page in dark mode. A light “paper” theme is one toggle away.</sub></p>

<p align="center">
  <img src="docs/links-light.jpg" width="860" alt="The link library in light mode, with search, category filters and grouped link cards">
</p>

<p align="center"><sub>The link library: search, category shelves, and a one-line note on why each link earned its place.</sub></p>

## Features

| Feature | What it does |
|---|---|
| **Two themes** | Dark by default, warm paper light mode. The choice persists in `localStorage`. |
| **Data-driven lists** | Posts and links live in one file. Add an object, and home, archive, search, filters and counts update themselves. |
| **Live search** | Filter posts and links as you type. Press <kbd>/</kbd> to jump to the search box. |
| **Generated cover art** | Each post gets a gradient cover derived from a single `hue` value — no image files, no broken thumbnails. |
| **Reading experience** | Auto-generated table of contents, scroll progress bar, syntax-labelled code blocks with copy buttons, callouts and next-up links. |
| **No dependencies** | Plain HTML, CSS and vanilla JS. No framework, no package manager, no build step. |
| **No tracking** | Zero cookies, zero analytics, zero third-party requests except the fonts. |
| **Accessible** | Lighthouse 100/100/100 with full keyboard navigation, skip link, focus states and reduced-motion support. |
| **Static** | It's a folder. Drag it onto any static host and you're done. |

## Quick start

No install, no build. Open `index.html`, or serve the folder:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit <http://localhost:8000>.

> A local server is recommended over double-clicking `index.html`, so root-relative paths behave exactly like production.

## Project structure

```
shortcut/
├── index.html                 # home: hero, featured post, latest, link preview, newsletter
├── archive.html               # all posts + live search and filters
├── links.html                 # the link library, grouped by shelf
├── about.html                 # manifesto, editorial rules, colophon
├── 404.html                   # not-found page
├── robots.txt
├── posts/
│   ├── browser-shortcuts.html
│   ├── faster-web.html
│   ├── privacy-afternoon.html
│   ├── tab-system.html
│   ├── terminal-for-humans.html
│   ├── saved-searches.html
│   └── password-manager.html
├── assets/
│   ├── css/style.css          # design tokens, components, responsive rules
│   └── js/
│       ├── data.js            # ← all post and link metadata
│       └── site.js            # theme, nav, search/filter, TOC, progress, copy
└── docs/                      # screenshots used in this README
```

## Adding content

### A post

1. Copy a file in `posts/` and rename it to your slug (e.g. `posts/my-post.html`).
2. Edit the title, meta description, breadcrumb tag, dek, byline and the contents of `<div class="prose" id="prose">`.
3. Add the matching entry to `SITE.posts` in `assets/js/data.js`:

```js
{
  slug: "my-post",              // must match the filename
  title: "My post title",
  dek: "One or two sentences for cards and search results.",
  tag: "Workflow",              // becomes a filter chip automatically
  date: "2026-11-04",           // ISO date — used for sorting and display
  read: 7,                      // minutes
  hue: 210,                     // 0–360, colours the generated cover
  num: "08",                    // big number on the cover
  glyph: "⌘"                    // small symbol on the cover
}
```

The table of contents is generated from the `h2` and `h3` elements inside `.prose`, so no manual anchors are needed.

### A link

Append to `SITE.links`:

```js
{
  name: "Tool name",
  url: "https://example.com",
  domain: "example.com",
  note: "One sentence on what it is actually good for.",
  cat: "Utilities",   // a new category creates a new shelf and filter chip
  hue: 170            // monogram tint
}
```

The six links previewed on the home page are picked by name in `site.js` — look for the `picks` array.

## Customising

| What | Where |
|---|---|
| Accent colour, backgrounds, text | `:root` tokens at the top of `assets/css/style.css` |
| Layout width | `--page` (default `1160px`) |
| Fonts | `--font-display`, `--font-body`, `--font-mono` + the Google Fonts `<link>` in each page |
| Wordmark and footer copy | the header/footer blocks in each HTML file (identical, so find-and-replace works) |
| Home hero copy | `index.html` → `.hero` |
| Newsletter behaviour | `data-subscribe` handler in `site.js` |

Changing `--accent` rebrands the entire site, including buttons, links, cover art and the 404 page.

## Deploy

Everything is static, so any host works.

**Netlify / Cloudflare Pages** — drag the folder into the dashboard, or connect the repo with no build command and publish directory `.` (root).

**GitHub Pages**

```bash
git init
git add .
git commit -m "Shortcut"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then enable **Settings → Pages → Deploy from a branch → `main` / root**.

## Performance

Measured with Lighthouse on the home, archive, link library and article pages:

| Category | Score |
|---|---|
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

No JavaScript is required to read an article; only the filtered lists need it.

## Notes

- The newsletter form is front-end only: it validates and confirms, but needs a service (Buttondown, Mailchimp, a serverless function) to actually collect addresses.
- The seven articles and thirty links are sample content, written to be replaced.
- Fonts load from Google Fonts. Self-host `Instrument Serif`, `Inter` and `JetBrains Mono` if you want zero external requests.

## License

No license file is included yet. If you plan to publish this publicly, add a `LICENSE` — MIT is a sensible default for a project like this.
