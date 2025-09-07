---
layout: default
title: AI Experiments
permalink: /ai/
---

# AI Experiments

I’m experimenting with AI assistants to build, maintain, and extend this site, and to explore personal data projects. Below is a quick summary of how I’m using these tools and links to individual experiments.

## How this site was built

- **Platform**: Hosted on **GitHub Pages** for simplicity and low cost. The site is static, lightweight, and easy to maintain.  
- **Framework**: Built with **Jekyll**, which keeps everything as Markdown + layouts. This makes the site auditable and easy to version-control.  
- **Coding assistant**: I use **Codex CLI** (agentic coding assistant) to scaffold new pages, wire navigation, adjust layouts, and keep the Jekyll setup consistent.  
- **Content editing**: I use **ChatGPT** to refine and edit text (draft copy, summaries, rewrites) while keeping the voice authentic and edits transparent.  
- **Domain & DNS**: Registered and managed via **Cloudflare**, which also handles DNS and provides extra reliability/security.  
- **Exploration**: Testing **Vercel** and other modern platforms for possible app hosting and future experiments alongside the static site.  
- **Publishing**: Everything is versioned in Git and deployed automatically with GitHub Pages. Changes remain simple, clear, and auditable.  
- **Intent**: Keep the stack minimal and future-proof—lightweight enough to be low maintenance, but flexible enough to integrate AI tools and new experiments over time.  

## Experiment: The Digital Self (AI Autobiography)

An AI‑generated autobiography composed from my tweet export (5,384 tweets, 2011–2025). The goal was to see how well a model can reconstruct a narrative arc and a “voice” from a long personal social feed.

- Data: Personal tweet archive exported from X/Twitter.
- Method: Prompted a local LLM workflow to synthesize a multi‑chapter narrative; lightly edited formatting for readability.
- Framing: Treat as a creative reconstruction, not an authoritative record. It may emphasize patterns, compress timelines, or infer intent.
- Read it: [The Digital Self — An AI Autobiography]({{ '/ai/the-digital-self/' | relative_url }})

### Notes on privacy and limitations

- Content reflects public posts; private context is intentionally absent.
- Outputs may contain inaccuracies or over‑generalizations. When in doubt, prefer original sources over AI‑synthesized narrative.

