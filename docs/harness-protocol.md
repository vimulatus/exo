# Harness ↔ Variant protocol

The Harness (`src/components/harness.tsx`) renders a Variant in a sandboxed iframe and
owns everything outside the Variant: data injection, timing, recording, scoring. A Variant
is a self-contained HTML/CSS/JS document (ADR 0001) that only ever targets `window.exo`.

## `window.exo` contract

The Harness injects, **before any Variant script runs**:

```ts
window.exo = {
  data,                       // the Scenario's frozen Fixture (plain JSON)
  done(detail?: unknown),     // signal the Success criterion was met
};
```

`data` is read-only as far as the Variant is concerned; `done()` may be called once the
Variant determines the Success criterion is satisfied. `detail` is optional and forwarded
verbatim to the parent.

## Data injection — embedded, not messaged

`data` is **embedded** into the iframe document at build time (`buildHarnessSrcdoc`), not
delivered by `postMessage`. This guarantees `window.exo.data` exists before the Variant's
own code executes — a `postMessage` would race the Variant. The bootstrap `<script>` is
placed as the first node inside `<head>` so it runs ahead of any Variant script in
document order.

Fixture content is serialized as a JS string literal and parsed at runtime
(`JSON.parse("…")`), with `<` escaped to `<`, so Fixtures containing `</script>` or
other markup cannot break out of the script or inject DOM.

## Mount signal — the iframe `load` event

The mount→`done()` timer starts on the iframe's native `load` event (`onReady`), not on a
message. The Harness owns the iframe, so `load` is the reliable mount signal: it fires once
the `srcdoc` document — bootstrap included — has loaded, which is also the moment the iframe
DOM is ready for the recording hook below. An `exo:ready` *message* was rejected: an inline
`srcdoc` can parse and dispatch it before React's effect attaches the parent listener, so
the event would be silently lost.

## iframe → parent messages

The single iframe → parent message is `exo:done`. It carries a `source: "exo"` discriminator;
the parent additionally checks `event.source === iframe.contentWindow`, so foreign
`postMessage` calls (extensions, other frames) cannot spoof completion. `EXO_SOURCE`, the
message type, and the `isExoMessage` type guard live in `src/lib/harness/protocol.ts`.

| Message                                       | When                                     | Parent reaction                             |
| --------------------------------------------- | ---------------------------------------- | ------------------------------------------- |
| `{ source: "exo", type: "exo:done", detail }` | Variant called `window.exo.done(detail)` | stop the timer, record the event (`onDone`) |

There are **no parent → iframe messages** in the current contract — data is embedded, and
nothing else needs to be pushed in.

## Recording hook

Recording (ADR 0002) is an optional rrweb capture that runs in the **parent**, observing
the iframe's `contentDocument`. Reading another document's DOM requires same-origin, which
for a `srcdoc` iframe means the `sandbox` attribute must include `allow-same-origin`. See
ADR 0003 for the sandbox decision and its trade-off.

## Usage

```tsx
<Harness
  html={variantHtml}
  data={fixture}
  onReady={() => startTimer()}
  onDone={(detail) => recordResult(detail)}
/>
```
