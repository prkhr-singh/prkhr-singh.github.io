# Prakhar Singh — Personal Website (Jekyll + Minimal)

This is a minimal, fast, and low-maintenance personal site using **GitHub Pages** and the **Minimal** theme.

## Quick Deploy (no local Ruby setup needed)

1. Create a new GitHub repository. If you want a user site, name it **`<your-username>.github.io`**.  
   Otherwise any repo name works; we'll use GitHub Pages with “Deploy from a branch.”
2. Upload all the files in this folder to the root of the repo.
3. In GitHub: **Settings → Pages**  
   - Source: **Deploy from a branch**  
   - Branch: **main** (or default branch) / **root**  
4. Open the URL shown in the Pages panel once it’s deployed.

### Optional: connect your custom domain
- Buy `prakharsingh.com` (or your choice). In **Settings → Pages**, add it under **Custom domain**.  
- Set **CNAME** at your domain registrar to your GitHub Pages hostname (e.g., `username.github.io`) and enable HTTPS.

## Editing content
- Add/edit pages in Markdown (`.md`): `index.md`, `about.md`, `work.md`, `personal.md` (and optionally `writing.md` for blog posts).
- New posts go in `_posts/` with filenames like `YYYY-MM-DD-title.md`.
- Your CV PDF lives at `assets/cv/Prakhar_Singh_CV.pdf`. Link to it from the Work page.

## SEO & AI readability
- `jekyll-seo-tag`, `jekyll-feed`, and `jekyll-sitemap` are enabled.
- Person **JSON-LD** is injected via `_includes/head-custom.html`.
