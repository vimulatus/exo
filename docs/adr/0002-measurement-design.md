# Measurement design: per-Cell Likert on a randomized grid, directional-only

Usability runs are capped at ~10 test users (max 50). Every measurement decision follows
from that constraint, so we record them together.

- **Per-Cell absolute Likert, not comparative ranking.** A Cell is one (Scenario ×
  Variant). After completing a Cell the Test user rates it 1–5 on each Criterion (+ an
  optional comment), and we capture time-on-task (mount → `done()`). Ranking was
  considered (lowest cognitive load, strong relative signal) but rejected: it forces
  variants of a Scenario to be shown together, which blocks the randomization below and
  couples scoring to within-subjects only.

- **Fully randomized Scenario × Variant grid.** Because each Cell is scored
  independently, Sessions traverse the whole grid in random order
  (`(s1,v3) → (s3,v1) → …`). This spreads learning/carryover across *both* axes rather
  than clustering it — better than per-axis counterbalancing, and only possible because
  scoring is per-Cell.

- **Test method is just a cell-assignment policy.** The Test user never perceives
  "variants" or "methods" — they get a randomized sequence of Cells. Within-subjects
  assigns the full grid; between-subjects assigns one round-robin Variant's Cells. Same
  traversal, scoring, and Result either way, so between-subjects costs almost nothing to
  support despite being statistically useless at this N.

- **Results are directional/qualitative, never significance-tested.** At n≈10 the payload
  is score deltas, comments, timing, and recordings — not p-values or "winner" claims. The
  UI must not imply statistical significance.

**Consequence:** identical Fixtures are reused across a Variant pair in within-subjects
mode, so time-on-task carries learning bias; treat it as soft signal. Per-Variant
equivalent fixtures are a deferred refinement.
