---
layout: default
title: How this site was built
permalink: /ai/how-this-site-was-built/
---

# How this site was built

A lightweight, auditable workflow using a coding assistant for changes and an LLM for copy, deployed via GitHub Pages.

- **Platform**: Hosted on **GitHub Pages** for simplicity and low cost. The site is static, lightweight, and easy to maintain.  
- **Framework**: Built with **Jekyll**, which keeps everything as Markdown + layouts. This makes the site auditable and easy to version-control.  
- **Coding assistant**: I use **Codex CLI** (agentic coding assistant) to scaffold new pages, wire navigation, adjust layouts, and keep the Jekyll setup consistent.  
- **Content editing**: I use **ChatGPT** to refine and edit text (draft copy, summaries, rewrites) while keeping the voice authentic and edits transparent.  
- **Domain & DNS**: Registered and managed via **Cloudflare**, which also handles DNS and provides extra reliability/security.  
- **Exploration**: Testing **Vercel** and other modern platforms for possible app hosting and future experiments alongside the static site.  
- **Publishing**: Everything is versioned in Git and deployed automatically with GitHub Pages. Changes remain simple, clear, and auditable.  
- **Intent**: Keep the stack minimal and future-proof—lightweight enough to be low maintenance, but flexible enough to integrate AI tools and new experiments over time.  