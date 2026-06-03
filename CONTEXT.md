# Exo

A platform where designers define UI usability experiments, an AI agent generates
multiple component variants (pulling designs from Figma), and anonymous test users
complete scenarios against those variants while the system records scores, timing,
and (optionally) session recordings.

## Language

**Experiment**:
A study a designer defines to compare UI approaches for one component (e.g. "keyboard
shortcuts for the data-entry table"). Owns the fixed details, the varying dimension,
the variants, the scenarios, the scoring criteria, and a pool of Design references.

**Variant brief**:
The designer-authored title + description defining one Variant's approach (the "details
that can vary"). May @-mention Design references (`@design1`); the system resolves them
into design context at generation. Agent generates one Variant per brief.

**Design reference**:
A named pointer (`design1`, `design2`, …) to a Figma file/node, attached at the
Experiment level and pulled via the Figma MCP. Variant briefs cite them by handle
(`@design1`), which the system resolves into the agent's context.

**Component under test**:
The single UI component an Experiment varies and measures. Each Variant is a
self-contained HTML/CSS/JS document rendered in an isolated sandboxed iframe — not a
React component, not a full application. Throwaway: nothing downstream consumes it.
_Avoid_: MVP, app, prototype

**Harness**:
The platform-owned shell that loads a Variant in a sandboxed iframe and injects
`window.exo = { data, done }` before the Variant runs. Owns timing (mount → `done()`),
scoring UI, and recording — all outside the Variant.

**Variant**:
One generated implementation of the Component under test, generated once at the
Experiment level and run against every Scenario's data in turn. An Experiment has two
or more. A/B testing = comparing variants.
_Avoid_: MVP

**Scenario**:
A concrete task a test user must complete within a Variant (e.g. "enter these 5 rows").
Owns a frozen data Fixture and a Success criterion. Every Variant runs against it.
_Avoid_: test, task (overloaded)

**Data schema**:
The shape of the data the Component operates on (e.g. `{ rows: {name, qty, price}[] }`),
part of the Experiment's fixed details and defined before generation. Variants generate
against it; Scenarios supply conforming Fixtures.

**Fixture**:
A concrete, frozen instance of the Data schema that a Scenario feeds into every Variant
(agent-drafted, designer-approved). Shared across Variants within a Scenario; varies
across Scenarios (e.g. empty-state vs filled-state). Injected as `window.exo.data`.

**Criterion**:
A predefined dimension a test user scores after a Scenario (e.g. Ease of Use,
Intuitiveness).

**Success criterion**:
The designer-defined condition that marks a Scenario complete. The agent translates
it into a runtime check inside every Variant; when met, the Variant signals completion
and timing stops.

**Test user**:
An anonymous person who opens a share link and completes Scenarios. No login.
_Avoid_: user (overloaded with designer)

**Designer**:
The authenticated person who creates Experiments and reviews Variants.

**Cell**:
One (Scenario × Variant) pairing — the atomic unit a Test user runs and scores. The
test user never perceives "variants" or "methods"; they just get a randomized sequence
of Cells.

**Test method**:
A cell-assignment policy, invisible to the Test user. _Within-subjects_ (default): assign
the full grid (every Cell). _Between-subjects_: assign one round-robin Variant's Cells
(that Variant × all Scenarios). Same traversal, scoring, and Result either way — only the
assigned Cell set differs.

**Session**:
One Test user's pass through an Experiment — the assigned Cells, traversed in fully
randomized order (spreads learning across both axes), each scored on completion.

**Result**:
The measured outcome of one Cell for one Session: a 1–5 Likert score per Criterion,
time-on-task (mount → `done()`), optional comment, optional recording. Interpreted as
directional/qualitative signal, not statistical significance (N ≈ 10, max 50).

**Recording**:
An optional rrweb capture of a Test user's interaction within a Cell's iframe, stored
per Cell and replayed by the Designer. Toggled per Experiment.

**Share link**:
The single, reusable, anonymous URL where Test users run an Experiment. Active only
while the Experiment is `Live`; the designer can pause (stop accepting Sessions) or close.

## Lifecycle

An **Experiment** moves: `Draft` (spec: component, fixed details, Data schema, Design
references, Variant briefs) → `Generating` (agent produces Variants) → `Review` (iterate
+ approve Variants; finalize Scenarios + Fixtures) → `Live` (Share link collects Sessions)
→ `Closed` (frozen; results only).

## Relationships

- An **Experiment** has one **Component under test**
- An **Experiment** has two or more **Variants**
- An **Experiment** has one or more **Scenarios** and one or more **Criteria**
- An **Experiment** has a pool of **Design references**; **Variant briefs** cite them
- A **Scenario** × a **Variant** = a **Cell**; a **Session** runs assigned Cells in
  randomized order, producing one **Result** per Cell

## Example dialogue

> **Designer:** "I want to test two keyboard-shortcut schemes on the data-entry table."
> **Exo:** "So one **Experiment**, one **Component under test** (the table), two
> **Variant briefs** — 'vim-keys' and 'arrow+tab'. What's the **Data schema** the table
> operates on?"
> **Designer:** "Rows of `{name, qty, price}`. I want to test it empty and pre-filled."
> **Exo:** "Two **Scenarios** then — each with its own **Fixture** (empty array vs 5
> rows), both conforming to that schema, shared identically across both **Variants**.
> Each user gets the 2×2 grid of **Cells** in random order and scores each on your
> **Criteria** after completing it."

## Flagged ambiguities

- "MVP" in the original brief meant **Variant** (a component version), NOT a minimum
  viable product / running app. Resolved: use **Variant**.
- "Scoring each time" meant per **Cell** (Scenario × Variant), not per Scenario or per
  Variant alone. Resolved via the Cell model.
