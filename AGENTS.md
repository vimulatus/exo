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
3. **Verification bar.** A slice is done when `tsc` is clean, Biome (`bun run lint`) is
   clean, and the flow has been run manually. Add targeted tests only for pure logic
   (timing, cell randomization, score aggregation) — not for UI.
4. **Git.** Short-lived branch per slice → PR → merge. Minimal conventional commits, one
   concern each (no body).
