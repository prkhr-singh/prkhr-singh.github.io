#!/usr/bin/env python3
"""Validate work/cards.json, check it for confidential content, and regenerate llms.txt.

Usage:
  python3 bin/build-portfolio.py            # validate + lint + write llms.txt
  python3 bin/build-portfolio.py --check    # validate + lint only (non-zero exit on errors)
  python3 bin/build-portfolio.py --figures  # also print every number found, for human review

Confidentiality lint has two layers:
  1. Generic patterns in this file (currency amounts, $/M/K/B magnitudes, "million", etc.).
  2. A private blocklist (names, vendors, internal codenames) kept OUTSIDE this public repo at
     ~/.config/prakhar-portfolio/blocklist.txt, because listing those terms here would leak them.
Figures that are deliberately withheld are written as "<redacted>".
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARDS = os.path.join(ROOT, "work", "cards.json")
LLMS = os.path.join(ROOT, "llms.txt")
BLOCKLIST = os.path.expanduser("~/.config/prakhar-portfolio/blocklist.txt")

ROLES = {
    "Uber Eats — ANZ Strategy & Planning",
    "Uber — APAC Consumer Strategy",
    "NRI India — Consulting",
    "NRI India — Automotive Industry Consulting",
}
STATUSES = {"adopted", "launched", "delivered", "in progress", "not launched"}
ROLE_FIT = {"Strategy & Ops", "BizOps", "Product Ops", "Consulting", "Growth & Monetization", "Chief of Staff"}
THEMES = {"Strategy", "Research", "Analysis", "Measurement", "Project management", "Execution"}
REQUIRED = ["id", "title", "period", "role", "company", "markets", "geos", "industries", "themes", "skills",
            "tools", "role_fit", "headline", "trigger", "problem", "what_i_did", "artifacts", "outcome",
            "outcome_status", "learning", "related", "merged_from", "rank"]
RETIRED = ["reach_out_when", "domains", "method_and_execution", "impact_or_learning", "ownership"]
TEXT_FIELDS = ["title", "headline", "trigger", "problem", "artifacts", "outcome", "learning"]

GENERIC = [
    # Public consumer prices "$0" and "$0.99" (delivery-fee promotions) are allowed.
    (r"[$€£¥]\s?(?!0(\.99)?(?![\d.]))\d", "currency amount"),
    (r"\b(USD|AUD|NZD|JPY|TWD|INR|SGD)\s?\d", "currency amount"),
    (r"\b\d+(\.\d+)?\s?(k|K|m|M|bn|B)\b", "magnitude suffix (k/M/B)"),
    (r"\b(million|billion|thousand)s?\b", "magnitude word"),
    (r"\b\d+(\.\d+)?\s?%\s+(market\s+)?(share|category position)\b", "share level"),
    (r"\b(over|above|below|under|ahead of|vs\.?|versus)\s+plan\b", "plan comparison"),
]


def card_text(c):
    parts = [str(c.get(k, "")) for k in TEXT_FIELDS]
    parts += [b.get("summary", "") + " " + b.get("detail", "") for b in c.get("what_i_did", [])]
    parts += c.get("skills", []) + c.get("tools", [])
    return "\n".join(parts)


def load_blocklist():
    if not os.path.exists(BLOCKLIST):
        return None
    terms = []
    for line in open(BLOCKLIST, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#"):
            terms.append(line)
    return terms


def validate(data):
    errs, warns = [], []
    ids = set()
    for c in data["cards"]:
        cid = c.get("id", "?")
        if cid in ids:
            errs.append(f"{cid}: duplicate id")
        ids.add(cid)
        for k in REQUIRED:
            if k not in c:
                errs.append(f"{cid}: missing field '{k}'")
        for k in RETIRED:
            if k in c:
                errs.append(f"{cid}: retired field '{k}' present")
        if c.get("role") not in ROLES:
            errs.append(f"{cid}: unknown role label {c.get('role')!r}")
        if c.get("outcome_status") not in STATUSES:
            errs.append(f"{cid}: bad outcome_status {c.get('outcome_status')!r}")
        bad_fit = set(c.get("role_fit", [])) - ROLE_FIT
        if bad_fit:
            errs.append(f"{cid}: unknown role_fit {sorted(bad_fit)}")
        bad_theme = set(c.get("themes", [])) - THEMES
        if bad_theme:
            errs.append(f"{cid}: unknown themes {sorted(bad_theme)}")
        did = c.get("what_i_did", [])
        if not (3 <= len(did) <= 4) or not all(isinstance(b, dict) and b.get("summary") and b.get("detail") for b in did):
            errs.append(f"{cid}: what_i_did must be 3-4 {{summary, detail}} items")
        if len(c.get("headline", "").split()) > 45:
            warns.append(f"{cid}: headline over 45 words")
    for c in data["cards"]:
        for r in c.get("related", []):
            if r not in ids:
                warns.append(f"{c['id']}: related id {r} not found")
    return errs, warns


def lint(data):
    errs = []
    terms = load_blocklist()
    if terms is None:
        print(f"WARNING: private blocklist not found at {BLOCKLIST}; only generic checks ran.", file=sys.stderr)
        terms = []
    blobs = [(c["id"], card_text(c)) for c in data["cards"]]
    blobs.append(("profile", json.dumps(data.get("profile", {}), ensure_ascii=False)))
    for cid, text in blobs:
        for pat, why in GENERIC:
            for m in re.finditer(pat, text):
                errs.append(f"{cid}: {why}: '{m.group(0)}'")
        for t in terms:
            if re.search(r"(?<![\w-])" + re.escape(t) + r"(?![\w-])", text, re.IGNORECASE):
                errs.append(f"{cid}: private term: '{t}'")
    return errs


def figures(data):
    for c in data["cards"]:
        text = card_text(c)
        hits = sorted(set(m.group(0) for m in re.finditer(r"[^.;\n]{0,40}\b\d[\d.,]*\s?(%|x|pp|points?)?[^.;\n]{0,30}", text)))
        red = text.count("<redacted>")
        if hits or red:
            print(f"\n{c['id']} — {c['title']}  (<redacted> x{red})")
            for h in hits:
                print("   ·", h.strip())


def render_llms(data):
    p = data.get("profile", {})
    out = [f"# {data['title']}", ""]
    for line in [data.get("note"), data.get("usage_policy"), data.get("ordering"),
                 "Structured version: https://prakharsingh.com/work/cards.json",
                 "Browse and filter: https://prakharsingh.com/work/portfolio/"]:
        if line:
            out.append(f"> {line}")
    out.append("")
    if p:
        out += ["## Profile", f"- Headline: {p.get('headline', '')}"]
        if p.get("thread"):
            out.append(f"- Career thread: {p['thread']}")
        for s in p.get("strengths", []):
            out.append(f"- Strength: {s['strength']} (cards: {', '.join(s.get('cards', []))})")
        if p.get("ai_use"):
            out.append(f"- How I work with AI: {p['ai_use']}")
        if p.get("tools"):
            out.append(f"- Tools: {', '.join(p['tools'])}")
        out.append("")
        if p.get("timeline"):
            out.append("## Career timeline")
            for t in p["timeline"]:
                out.append(f"- {t}")
            out.append("")
        if p.get("education"):
            out.append("## Education")
            for e in p["education"]:
                out.append(f"- {e}")
            out.append("")
    for c in sorted(data["cards"], key=lambda c: c["rank"]):
        out += [f"## {c['id']} — {c['title']}",
                f"- Rank: {c['rank']}",
                f"- Period: {c['period']}",
                f"- Role: {c['role']}",
                f"- Markets: {', '.join(c['markets'])}",
                f"- Tags: {' · '.join([c['company']] + c['geos'] + c['industries'] + c['themes'])}",
                f"- Relevant to: {', '.join(c['role_fit'])}",
                f"- Skills: {', '.join(c['skills'])}"]
        if c["tools"]:
            out.append(f"- Tools: {', '.join(c['tools'])}")
        out += [f"- Headline: {c['headline']}",
                f"- Context: {c['trigger']}",
                f"- Problem: {c['problem']}",
                "- What I did:"]
        out += [f"  - {b['summary']}: {b['detail']}" for b in c["what_i_did"]]
        out += [f"- Artifacts: {c['artifacts']}",
                f"- Outcome ({c['outcome_status']}): {c['outcome']}",
                f"- What I learned: {c['learning']}"]
        if c["related"]:
            out.append(f"- Related: {', '.join(c['related'])}")
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def main():
    data = json.load(open(CARDS, encoding="utf-8"))
    errs, warns = validate(data)
    errs += lint(data)
    for w in warns:
        print("warn:", w)
    for e in errs:
        print("ERROR:", e)
    if "--figures" in sys.argv:
        figures(data)
    n_red = sum(card_text(c).count("<redacted>") for c in data["cards"])
    print(f"{len(data['cards'])} cards · {len(errs)} errors · {len(warns)} warnings · {n_red} <redacted> markers")
    if errs:
        sys.exit(1)
    if "--check" not in sys.argv:
        open(LLMS, "w", encoding="utf-8").write(render_llms(data))
        print(f"wrote {os.path.relpath(LLMS, ROOT)}")


if __name__ == "__main__":
    main()
