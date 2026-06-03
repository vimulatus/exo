<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working agreement

How we build Exo together. See `CONTEXT.md` for the domain and `docs/adr/` for decisions.

1. **Docs first.** Before any Next.js-touching slice, read the relevant guide in
   `node_modules/next/dist/docs/`, note version-specific gotchas/deprecations, and cite
   what informed the code. Do not rely on training-data assumptions about Next.js 16.
2. **Plan per slice.** Post a short plan (files touched + approach), get approval, then
   build and self-review. No end-to-end milestone execution without checkpoints.
3. **Verification — a slice is not done until it is proven.** Inspection is not
   verification; exercise what you built and observe the result.
   - **Types and lint are hard blockers.** `tsc` clean and Biome clean (`bun run lint`)
     are non-negotiable — any typecheck or lint error means the slice is not done.
   - **UI must be verified to render** with `agent-browser` in an **isolated session**:
     `agent-browser --session <name> open <url>`, then `snapshot` / `screenshot` /
     `console` to confirm it renders and the console is error-free. Run bare
     `agent-browser` (or `agent-browser skills get core --full`) first to read its docs —
     do not guess commands.
   - **Behaviour must be verified by interfacing with what you made.** For functions/logic,
     run them in a throwaway script and assert the output matches expectations; for flows,
     drive them in the browser. Never claim it works from reading the code alone.
   - Add targeted tests for pure logic (timing, cell randomization, score aggregation) —
     not for UI.
4. **Git.** Short-lived branch per slice → PR → merge. Minimal conventional commits, one
   concern each (no body).
