# Property Comparisons

This folder stores one record per property assessed.

## Folder Structure

```text
property-comparisons/
  _template-in-person.md       ← copy this when writing a new in-person assessment
  comparison-matrix.csv        ← AI scores for all properties; drives the dashboard
  <slug>/
    report.md                  ← AI analysis: floor plan, listing data, photos
    summary.json               ← machine-readable AI scores (feeds dashboard)
    in-person.md               ← qualitative assessment from actual inspection visit
    assets/
      floorplan.jpg
      photo-01.jpg
      ...
```

## Two Assessment Layers

### 1. AI Assessment (`report.md` + `summary.json`)

Generated from listing data: floor plan dimensions, photos, description, NBN type, listing history. Produces scores on 8 dimensions (see `criteria.md` for rubric). Scores are set before the property is visited.

**Limitation:** Cannot capture room feel, lifestyle fit, laundry quality, WIR usability, outdoor habit-fit, or the cumulative impression of a floor plate.

### 2. Contract / Legal Watchpoints

For properties where Section 32 / contract files are available, record legal and contract-specific issues separately from lifestyle fit. These are not "home feels good" scores; they are go/no-go risk notes for conveyancer review.

New comparison columns:

| Column | Meaning |
|---|---|
| `assessment_layer` | Whether the row is AI-only, AI plus in-person, or comp-only. |
| `legal_risk_score` | 10 = cleaner contract/title read; 1 = serious unresolved legal/title fit risk. |
| `contract_watchpoints` | Plain-English issues to ask conveyancer/agent about. |
| `pre_visit_confidence` | Confidence in the AI assessment before an inspection. |
| `public_listing_url` | Main public listing used for the pre-visit assessment. |

### 3. In-Person Assessment (`in-person.md`)

Written after physically visiting the property. Uses the template in `_template-in-person.md`.

The most important section is **Criteria Deltas** — where the in-person visit reveals something the AI assessment got wrong or missed entirely. These deltas feed back into `criteria.md > Section 3: Personal Learnings`, which improves all future AI assessments.

**How the feedback loop works:**
1. AI scores property from listing data
2. You visit, fill in `in-person.md`, note the deltas
3. New/adjusted criteria get added to `criteria.md > Criteria Evolution Log`
4. Future AI assessments incorporate those criteria
5. Retrospective re-scores of old properties happen if a new criterion is materially important

## Adding a New Property

1. Create `property-comparisons/<slug>/` folder
2. Run AI analysis → produce `report.md` and `summary.json` using the criteria in `criteria.md`
3. Add one row to `comparison-matrix.csv`
4. Add photos/floorplan to `assets/`
5. After visiting: copy `_template-in-person.md` → `<slug>/in-person.md`, fill in
6. Add any new criteria to `criteria.md > Criteria Evolution Log`

## Current Properties

| Slug | Address | AI Score | Personal Score | Status |
|---|---|---|---|---|
| `1-buick-crescent-mill-park` | 1 Buick Crescent, Mill Park | 82/100 | 85/100 | Primary target — auction 23 May 2026 |
| `31-st-hellier-street-heidelberg-heights` | 31 St Hellier Street, Heidelberg Heights | 76/100 | 65/100 | Sold $997k (2 May 2026). Comp only. |
| `10-northbridge-road-highton` | 10 Northbridge Road, Highton | 82/100 | TBD | Shortlisted for Saturday visit. Best paper fit of the three new Geelong options; covenant/overlays need conveyancer review. |
| `23-arbour-grove-belmont` | 23 Arbour Grove, Belmont | 70/100 | TBD | Shortlisted but common-property/body-corporate question may conflict with hard criteria. |
| `44-waurnvale-drive-belmont` | 44 Waurnvale Drive, Belmont | 70/100 | TBD | Shortlisted as value/space benchmark; older shell and 650m2 land are likely lifestyle mismatches. |
