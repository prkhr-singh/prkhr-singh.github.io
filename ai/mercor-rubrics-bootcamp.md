layout: default
title: "I tried a data‑labeling bootcamp. Here’s what I learned."
permalink: /ai/mercor-rubrics/
description: "Notes from Mercor’s rubrics bootcamp: where labeling fits in the AI value chain, limits of binary rubrics, and small experiments I want to run."
summary: "Notes from Mercor’s rubrics bootcamp: where labeling fits in the AI value chain, limits of binary rubrics, and small experiments I want to run."
---

# I tried a data‑labeling bootcamp. Here’s what I learned.

Field notes from completing Mercor’s Rubrics Bootcamp (an onboarding exercise before real projects).

## TL;DR

- Labeling is the assembly line of modern AI. It rewards consistency, clarity, and stamina more than creative leaps.
- Rubrics that force a single true/false decision are fast to scale but leak signal in messy, real tasks.
- Good prompt engineering begins with good rubrics. Criteria, counter‑examples, and boundaries matter more than clever wording.
- The paradox: you “automate yourself out of the job” by designing better rubrics and evaluators. That is also how you stay valuable for longer.

## What I did

An onboarding set of practice tasks where you  learn to **design**  rules for rating model output.

**What makes a good prompt.** A good prompt is a compact rubric: clear goal, scoped inputs, explicit output format, acceptance criteria, and 2–3 positive/negative examples. A weak prompt is vague, mixes objectives, or omits boundaries—so evaluation becomes subjective.

**Thinking linearly to scaffold evaluation.** Decompose the task into steps and criteria, write operational definitions, propose a simple decision tree, call out edge cases, and define a minimal set of measurable checks (e.g., keyword present, fact count, reading level). This turns “vibes” into verifiable steps.

**Building a robust rubric.** Convert the scaffold into checklist items with: a verifiable, self‑contained evaluation; assign weight to each criterion; link to the source and add rationale; note criterion type and dependencies.

## Where labeling fits in the AI value chain

1. **Data creation**: instructions, examples, and preferences used for fine‑tuning and RLAIF/RLHF.
2. **Evaluation**: human labels and rubric‑driven checks for model quality and safety.
3. **Operations**: calibration, reviewer training, inter‑rater agreement, spot audits, appeals.

Labeling is not the glamorous part, yet it quietly determines what a model learns and what we call “good.”

## What surprised me

- **Binary comfort zone**: Tasks are framed to end in a verifiable decision. Real work often needs graded or multi‑dimensional judgment.
- **Person–task fit**: Conscientious, systems‑minded people thrive; others chafe. It is a different muscle from strategy or invention.
- **Prompt engineering ≠ magic words**: The best prompts are distilled rubrics with crisp scope, acceptance criteria, and examples.

## What felt missing

- **Expressing uncertainty**: No place to say “unsure” or “partially meets.”
- **Capturing why**: Explanations were optional, so edge‑case wisdom did not accumulate.
- **Disagreement as data**: Reviewers differed, but the pipeline treated one answer as ground truth.

## A personal note

It was mechanical. That is not a bug. It made me respect the quiet skill in building repeatable evaluation systems and the people who keep them running. I also gained a deeper appreciation for prompt engineering as rubric design in disguise.

---

*Disclaimer: These notes are based on a short onboarding exercise, not paid production work. Opinions are my own.*
