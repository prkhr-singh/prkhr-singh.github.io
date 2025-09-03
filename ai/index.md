---
layout: default
title: AI Experiments
permalink: /ai/
---

# AI Experiments

I’m experimenting with AI assistants to build, maintain, and extend this site, and to explore personal data projects. Below is a quick summary of how I’m using these tools and links to individual experiments.

## How this site was built with Codex and Gemini CLI

- Workflow: I use `Codex CLI` (an agentic coding assistant) to scaffold pages, wire navigation, refactor content, and keep everything consistent across the Jekyll setup. Changes are applied directly in this repository and previewed locally.
- Generation: I use `Gemini CLI` for content generation/refinement where helpful (summaries, intros, and draft copy), keeping edits transparent and minimally intrusive.
- Publishing: Everything is versioned in Git and deployed via GitHub Pages. The site keeps a simple structure (Markdown pages, minimal theme) so AI edits stay readable and maintainable.
- Intent: Keep the stack lightweight and auditable while using AI tools to speed up tedious tasks and enable new experiments.

## Experiment: The Digital Self (AI Autobiography)

An AI‑generated autobiography composed from my tweet export (5,384 tweets, 2011–2025). The goal was to see how well a model can reconstruct a narrative arc and a “voice” from a long personal social feed.

- Data: Personal tweet archive exported from X/Twitter.
- Method: Prompted a local LLM workflow to synthesize a multi‑chapter narrative; lightly edited formatting for readability.
- Framing: Treat as a creative reconstruction, not an authoritative record. It may emphasize patterns, compress timelines, or infer intent.
- Read it: [The Digital Self — An AI Autobiography]({{ '/ai/the-digital-self/' | relative_url }})

### Notes on privacy and limitations

- Content reflects public posts; private context is intentionally absent.
- Outputs may contain inaccuracies or over‑generalizations. When in doubt, prefer original sources over AI‑synthesized narrative.

