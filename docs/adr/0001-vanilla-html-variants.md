# Variants are throwaway vanilla HTML/CSS/JS, not React

A Variant is the artifact a test user interacts with. Because nothing downstream
consumes a Variant's code — it exists only to test the behaviour and UI of a component
during usability testing — we generate each Variant as a single self-contained
HTML/CSS/JS document rendered in a sandboxed iframe, rather than as a React component or
a deployable app.

The Harness injects `window.exo = { data, done }` into the iframe before the Variant
runs: `data` is the Scenario's frozen Fixture (plain JSON), and calling `done()` signals
the Success criterion was met (bridged to the parent via `postMessage`, which stops the
timer). The Variant only ever targets `window.exo`.

**Considered options:** React single-file + in-browser transpile; arbitrary npm deps via
Sandpack; server-side esbuild bundle per Variant. All were rejected as unnecessary weight
given the artifacts are throwaway and tested in isolation — vanilla HTML removes
transpilation, bundling, and dependency resolution entirely, and makes generation more
reliable (one file, no imports). The trade-off accepted: Variants cannot pull rich npm
libraries (e.g. a specific date-picker package); the agent hand-rolls within plain
HTML/CSS/JS. If a future Experiment genuinely needs library-based components, that
Experiment can graduate to a Sandpack-based renderer without changing the domain model.
