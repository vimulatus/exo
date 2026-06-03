# Harness iframe runs `allow-scripts allow-same-origin`

The Harness renders each Variant in a sandboxed iframe (ADR 0001). The Variant needs
`allow-scripts` to run at all. The open question was whether to also grant
`allow-same-origin`, which keeps the `srcdoc` document in the parent's origin instead of an
opaque one.

We grant `allow-same-origin`. Recording (ADR 0002) is an optional rrweb capture that runs
in the **parent**, observing the iframe's `contentDocument` — and reading another
document's DOM is a same-origin operation. With an opaque origin the parent cannot reach
into the iframe, so in-iframe recording is impossible. Granting `allow-same-origin` is the
only way to keep recording on the platform side rather than bundling a recorder into every
generated Variant.

The default sandbox is therefore `allow-scripts allow-same-origin`, and notably **not**
`allow-popups`, `allow-top-navigation`, `allow-forms`, or `allow-modals` — a Variant is a
single isolated component, not an app, and has no reason to navigate, submit, or open
windows.

**Trade-off accepted:** `allow-scripts` together with `allow-same-origin` lets the Variant
reach `parent` and, in principle, the platform DOM. This is acceptable because Variants are
AI-generated, throwaway, and run in isolation — one Variant per iframe, never alongside
designer credentials in the Test runner context, and nothing downstream consumes their
code. The `done()` bridge already trusts the iframe to report completion.

**Fallback:** if a future Experiment ever renders genuinely untrusted Variant code, drop
`allow-same-origin` (the `sandbox` prop is overridable per-Harness). That re-isolates the
origin at the cost of in-iframe recording for that Experiment — an acceptable exchange,
since recording is already optional per Experiment.
