---
name: pnpm audit fix workspace behavior
description: Caveats when fixing vulnerabilities in this pnpm workspace.
---

After running `pnpm audit --fix`, inspect `pnpm-workspace.yaml` and the regenerated lockfile. The command can reorder workspace settings and remove explanatory comments, and broad override ranges can resolve to a newer major than the dependency originally used. Preserve existing workspace safety settings and narrow overrides to patched versions that stay within the compatible major where possible.

**Why:** A broad Undici override selected a later major, and automatic workspace serialization removed security-policy comments; both required manual review to keep the fix compatible and preserve project guardrails.

**How to apply:** Run the package-manager fix for each manifest, regenerate the shared lockfile, then audit all lockfile resolutions and restore any important configuration comments before testing the app.
