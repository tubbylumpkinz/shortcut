# Shortcut

A small, fast blog + link hub. Plain HTML, one stylesheet, vanilla JS. No build step, no dependencies, no trackers.

**Pages**

| File | What it is |
| --- | --- |
| `index.html` | Home: hero, featured post, latest posts, link preview, newsletter |
| `archive.html` | All posts with live search and topic filters |
| `links.html` | The link library, grouped by shelf, with search and filters |
| `about.html` | Manifesto, rules, colophon |
| `posts/*.html` | Individual articles |
| `404.html` | Not found |

**Assets**

- `assets/css/style.css` — design tokens, components, dark/light themes, responsive rules
- `assets/js/data.js` — all post + link metadata (the only file you edit to add content to the lists)
- `assets/js/site.js` — theme toggle, mobile nav, search/filter rendering, auto table of contents, reading progress, copy buttons

## Run it

Open `index.html` in a browser. That's it. It also works from any static host.

To preview with a local server (recommended, so paths behave like production):

```powershell
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit <http://localhost:8000>.

## Add a post

1. Copy an existing file in `posts/` and rename it to your slug, e.g. `posts/my-post.html`.
2. Replace the title, meta description, breadcrumb tag, dek, byline, and the contents of `<div class="prose" id="prose">`.
3. Add an entry to the `posts` array in `assets/js/data.js`:

```js
{
  slug: "my-post",              // must match the filename
  title: "My post title",
  dek: "One or two sentences for cards and search results.",
  tag: "Workflow",              // becomes a filter chip automatically
  date: "2026-11-04",           // ISO date, used for sorting + display
  read: 7,                      // minutes
  hue: 210,                     // 0-360, colours the generated cover art
  num: "08",                    // big number on the cover
  glyph: "⌘"                    // small symbol on the cover
}
```

Home, archive, search, filters, and counts all update themselves.

> The table of contents in the sidebar is generated from the `h2`/`h3` elements inside `.prose` — no manual anchors needed.
> Code blocks get a copy button automatically if you use the existing `.code-block` markup.

## Add a link

Append to the `links` array in `assets/js/data.js`:

```js
{
  name: "Tool name",
  url: "https://example.com",
  domain: "example.com",
  note: "One sentence on what it is actually good for.",
  cat: "Utilities",   // a new category creates a new shelf + chip
  hue: 170            // monogram tint
}
```

`index.html` shows six hand-picked links by name — edit the `picks` array near the bottom of `site.js` to change them.

## Theme

Dark is the default. The toggle stores the choice in `localStorage` (`shortcut-theme`). All colours are CSS custom properties at the top of `style.css`; change `--accent` to rebrand the whole site in one line.

## Deploy

The folder is the site. Drag it into Netlify, Cloudflare Pages, or a GitHub Pages repo — no configuration required.

For GitHub Pages: push the folder, then enable Pages on the branch root.

## Browser support

Evergreen Chrome, Edge, Firefox, Safari. Uses `color-mix()` and `:has`-free CSS; the layout degrades gracefully without JS (post pages are fully static; only the filtered lists need scripting).
