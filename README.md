# morrisjb.com

Personal site — built as plain static HTML, hosted on Cloudflare Pages, source in this GitHub repo.

## File layout

```
.
├── index.html          # Home page
├── about.html          # About me
├── cv.html             # CV
├── thoughts.html       # Index of all essays
├── styles.css          # All styling lives here
├── logo.svg            # J. Morris wordmark (used as an asset, not in the header)
├── favicon.ico         # Browser tab icon (multi-resolution: 16/32/48/64/128/256)
├── apple-touch-icon.png # 512px PNG for iOS home-screen icons
└── posts/
    └── welcome.html    # Sample inaugural post — keep, edit, or delete
```

## Editing

Every page is a single self-contained HTML file. You can edit them directly in the GitHub web UI:

1. Click the file in GitHub.
2. Click the pencil icon (top-right of the file view).
3. Edit the content.
4. Scroll down, write a short commit message, click **Commit changes**.

Cloudflare Pages will redeploy automatically within ~30 seconds.

### Where to edit what

| To change | Edit |
|---|---|
| Hero greeting / bio on the home page | `index.html` — the `<section class="hero">` block |
| Recent posts list on the home page | `index.html` — the `<ul class="posts">` block |
| Topic tags on the home page | `index.html` — the `<ul class="tag-list">` block |
| About me content | `about.html` |
| CV experience, skills, education | `cv.html` |
| Full essay archive | `thoughts.html` |
| Colours, fonts, spacing | `styles.css` (variables at the top, under `:root`) |

Comments inside each HTML file marked `<!-- TIP: ... -->` flag the sections most likely to need editing.

## Adding a new post

1. In the `posts/` folder, copy `welcome.html` and rename it to something like `2026-06-my-essay.html`.
2. Open the new file and edit four things:
   - The `<title>` in the `<head>`
   - The `<meta name="description">`
   - The `article-meta`, `article-title`, and `article-subtitle` inside `<article-header>`
   - The body content inside `<div class="article-content">`
3. Add a new `<li class="post-item">` entry near the top of:
   - `index.html` (under "Recent thoughts") — so it appears on the homepage
   - `thoughts.html` (under the right year) — so it appears in the full archive

Commit, and Cloudflare deploys.

## The styling

All visual choices live in `styles.css` and use CSS variables at the top. The easiest tweaks:

- `--bg` — background colour (currently a warm cream)
- `--text` — body text colour
- `--accent` — the oxblood used for link underlines and the dot ornaments in the site title
- `--max-width` — how wide the reading column is

The site uses a single typeface (Newsreader, loaded from Google Fonts). If you want to swap it, change the `<link>` tag in each HTML `<head>` and the `font-family` in `styles.css`.

## Hosting

Hosted on Cloudflare Pages — connected to this GitHub repo. Pushing to `main` triggers a build; the site goes live at `morrisjb.com` (and at the Cloudflare preview URL for other branches).

No build step is required — the files in this repo are exactly what's served.
