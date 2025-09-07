---
layout: null
sitemap: false
---
{% raw %}
# Repo Guide for Agents

Single‑file context to work effectively on this site.

## Purpose
- Personal website for Prakhar Singh, deployed on GitHub Pages with a minimal, fast stack.
- Content: work highlights, personal pursuits, AI experiments, and occasional posts.

## Tech Stack
- Static site: Jekyll (GitHub Pages build)
- Theme: `pages-themes/minimal@v0.2.0` (remote theme)
- Plugins: `jekyll-remote-theme`, `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap`
- Domain: `CNAME` → `prakharsingh.com`

Local preview (optional):
- `Gemfile` pins `github-pages` for local parity. Run `bash bin/serve` (requires Ruby + Bundler) to preview at `http://127.0.0.1:4000`.

## Structure Overview
- `_config.yml`: Site metadata, theme, plugins, SEO/analytics tokens, social links, `logo`, `favicon`.
- `_layouts/`
  - `default.html`: Base layout, header + nav + content section + footer.
  - `post.html`: Post layout (title, date, content).
- `_includes/`
  - `head-custom.html`: Font Awesome, favicon tags, verification + analytics snippets.
  - `digital_self_bio.md`: Long include used by `ai/the-digital-self.md`.
- `assets/`
  - `css/overrides.css`: Light typography + two‑column rules + subpage header compacting.
  - `og.png`: Current Open Graph image; also used as default favicon.
  - `cv/Prakhar_Singh_CV.pdf`: CV file linked from Work page.
- Pages
  - `index.md`: Home (links to About, Work, Personal, AI).
  - `about.md`: About page.
  - `work.md`: Work highlights + CV subsection linking to the PDF.
  - `personal.md`: Personal Pursuits. Includes a Writing subsection listing recent posts.
  - `writing.md`: All posts list (not in top nav, still useful as an archive).
  - `ai/index.md`, `ai/the-digital-self.md`: AI Experiments.
  - `404.md`: Friendly not‑found page.
- Posts: `_posts/YYYY-MM-DD-title.md`
- Root extras: `robots.txt`, `sitemap.xml` (see note below), `google82a9247e862f3f74.html` (verification).

## Layout & Presentation
- Two‑column layout on desktop (header left, content right) with explicit CSS in `assets/css/overrides.css` to prevent overlap.
- Mobile stacks naturally.
- Homepage‑only hero: The logo, short description, and social links are rendered only on `/`.
  - Implementation: `default.html` sets `is_home = page.url == '/'` and conditionally renders hero blocks.
  - Non‑home pages add `body.subpage` class for compact header; CSS hides hero bits defensively.
- Nav (in `default.html`): `Home`, `About`, `Work`, `Personal`, `AI`.
  - If you change permalinks, update the nav links accordingly.

## Content Model
- Homepage (`index.md`) links to sections; copy may change freely.
- Personal (`personal.md`) acts as a hub for non‑work content and embeds a Writing subsection:
  - Uses `{% for post in site.posts limit:5 %}` to show recent posts and links to the full archive at `/writing/`.
- Writing archive (`writing.md`) still lists all posts and uses `layout: default` (not in top nav).
- Work (`work.md`) contains CV subsection with a direct link to the PDF.

## SEO & Analytics
- Enabled: `jekyll-seo-tag`, `jekyll-feed`, `jekyll-sitemap`.
- `robots.txt` references `{{ site.url }}/sitemap.xml`.
- Custom `sitemap.xml` file also exists. Avoid duplication:
  - Prefer the plugin and remove `sitemap.xml`, OR
  - Keep `sitemap.xml` and remove `jekyll-sitemap` in `_config.yml`.
- Verification/analytics:
  - Set in `_config.yml`: `google_site_verification`, `bing_site_verification`, `google_analytics_id` (GA4), or `plausible_domain`.
  - `head-custom.html` injects tags/snippets only when IDs are present.

## Social & Favicon
- Social links are configured in `_config.yml` under `author.links`.
  - Example entries use Font Awesome 5 classes (linked in `head-custom.html`).
  - X/Twitter icon uses `fab fa-twitter` for FA5 compatibility.
  - Substack uses `fas fa-newspaper`.
- Favicon: `_config.yml` `favicon` → defaults to `site.logo` if missing.
  - To use a photo: add `assets/favicon.png` (prefer square 32–64px) and set `favicon: "/assets/favicon.png"`.

## Common Tasks
1) Add a new post
- Create `_posts/YYYY-MM-DD-title.md` with front matter:
  ---
  layout: post
  title: "Title here"
  date: YYYY-MM-DD
  ---
  Content in Markdown.

2) Add a new page
- Create `page-name.md` with:
  ---
  layout: default
  title: Page Title
  permalink: /page-name/
  ---
  Content…
- Update the nav in `_layouts/default.html` if it should be top‑level.

3) Update social links
- Edit `_config.yml` → `author.links` (label, icon, url). Use FA5 icon classes.

4) Change favicon / OG image
- Replace `assets/og.png` (OG) and/or add `assets/favicon.png`. Update `_config.yml` `logo` and `favicon`.

5) Move/organize CV
- The canonical link is in `work.md` under the CV subsection and points to `assets/cv/Prakhar_Singh_CV.pdf`.
- If you rename the file, update that link.

6) Analytics / verification
- Paste tokens into `_config.yml`; the tags will be injected automatically.

## Gotchas & Conventions
- Front matter must be wrapped with `---` at both start and end; missing the opening `---` will render YAML as page text.
- Nav is hard‑coded in `default.html`. Ensure links reflect actual permalinks.
- `page.url == '/'` logic controls homepage‑only elements; keep this in mind when changing permalinks of `index.md`.
- Font Awesome 5 is loaded via CDN in `head-custom.html`; use FA5 icon names.
- Keep CSS tweaks lightweight in `assets/css/overrides.css` to preserve theme simplicity.

## Open TODOs / Decisions
- Sitemap duplication: choose either `jekyll-sitemap` plugin or the custom `sitemap.xml` file.
- Optional footer polish: Replace the theme boilerplate with a minimal personalized footer and RSS link.
- Optional redirects: If `/writing/` should redirect to `/personal/#writing`, add a redirect solution (`jekyll-redirect-from` or manual meta refresh).

## Quick Commands (local)
- Serve: `bash bin/serve` (after installing Ruby + Bundler)
- Posts list URL: `/writing/`
- Feed: `/feed.xml`

This document should give a future agent everything needed to navigate, modify, and extend the site safely and consistently.
{% endraw %}
