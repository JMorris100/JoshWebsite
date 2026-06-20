# morrisjb.com

Personal site — plain static HTML, hosted on Cloudflare Pages, source in this GitHub repo.

## File layout

```
.
├── index.html           # Home page
├── about.html           # About me
├── cv.html              # CV
├── thoughts.html        # "Recent Posts" — the full essay archive
├── styles.css           # All styling lives here
├── jmorrisfavicon.png   # Browser tab icon
├── appletouchicon.png   # iOS home-screen icon
└── posts/
    └── welcome.html     # Sample inaugural post — keep, edit, or delete
```

> Note: the nav label is **Recent Posts**, but the page itself is `thoughts.html`.
> Keeping the filename means none of your existing links break.

## Header, logo and nav

The header is the same on every page: a **JM** monogram (inline SVG, top-left)
that links home, and three nav links top-right — **About**, **CV**, **Recent Posts**.

The logo is drawn as live text in an SVG, so it stays crisp at any size and
picks up the site's text colour. To resize it, change `height` on `.brand svg`
in `styles.css`. To change the letters, edit the `<text>` inside the `<svg>` in
each HTML file's header.

## Editing

Every page is a single self-contained HTML file. Edit directly in the GitHub web UI:

1. Click the file in GitHub.
2. Click the pencil icon (top-right of the file view).
3. Edit the content.
4. Scroll down, write a short commit message, click **Commit changes**.

Cloudflare Pages redeploys automatically within ~30 seconds.

### Where to edit what

| To change | Edit |
|---|---|
| Welcome line / intro on the home page | `index.html` — the `<section class="hero">` block |
| Recent posts list on the home page | `index.html` — the `<ul class="posts">` block |
| Topic tags on the home page | `index.html` — the `<ul class="tag-list">` block |
| About me content | `about.html` |
| CV experience, skills, education | `cv.html` |
| Full essay archive | `thoughts.html` |
| Colours, fonts, spacing | `styles.css` (variables at the top, under `:root`) |

Comments marked `<!-- TIP: ... -->` flag the sections most likely to need editing.

## Adding a new post

1. In `posts/`, copy `welcome.html` and rename it, e.g. `2026-06-my-essay.html`.
2. Edit four things in the new file:
   - The `<title>` in the `<head>`
   - The `<meta name="description">`
   - The `article-meta`, `article-title`, and `article-subtitle` in `.article-header`
   - The body inside `<div class="article-content">`
3. Add a new `<li class="post-item">` near the top of:
   - `index.html` (under "Recent posts") — so it shows on the homepage
   - `thoughts.html` (under the right year) — so it shows in the archive

Commit, and Cloudflare deploys.

## The palette

All visual choices live in `styles.css` under `:root`. The easiest tweaks:

- `--bg` — page background (white)
- `--surface` — light-grey tint for tags and surfaces
- `--text` — body text (deep slate-navy)
- `--accent` — the light blue used for labels, dividers, and link underlines
- `--max-width` — width of the reading column

Type is **Newsreader** (serif, used for the wordmark and headlines) paired with
**Inter** (sans, used for nav, labels, and body), both loaded from Google Fonts.
To swap either, change the `<link>` in each HTML `<head>` and the `font-family`
rules in `styles.css`.

## Hosting

Hosted on Cloudflare Pages, connected to this GitHub repo. Pushing to `main`
triggers a build; the site goes live at `morrisjb.com`. No build step — the
files in the repo are exactly what's served.
