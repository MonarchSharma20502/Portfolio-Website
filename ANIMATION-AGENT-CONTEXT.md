# Animation Agent — Project Context

> Project-specific facts for the Animation-Agent. The agent file already covers
> animation philosophy, easing, durations, accessibility, performance and
> library choice — this file contains **only what it cannot know**: the project,
> the data, and this machine's quirks. Read it once, then start.

---

## 1. Goal

A **second, super-interactive version** of the existing portfolio — same data,
same person, heavily animated and 3D. Reference for the *vibe* (not to copy):
**https://moncy.dev**. The current site is deliberately minimal: a single
`Reveal` component doing a fade-in-up on scroll is the only motion.

## 2. Do not break the live site

- Live: **https://monarchsharma20502.github.io/Portfolio-Website/**
- Deploys automatically from every push to `main` (GitHub Actions).
- Work goes on the **`animated-portfolio`** branch (already created and checked
  out). Do not push to `main` until the new version is verified.

## 3. Data — one source of truth

| What | Where |
|---|---|
| All content | `portfolio/data/profile.json` |
| Types + import | `portfolio/src/lib/profile.ts` |
| Provenance per fact | `portfolio/data/profile.raw.json` |

**Monarch Sharma** — Cloud / DevOps Engineer, Jaipur, India.

Experience (verified by Monarch):

| Title | Company | Dates |
|---|---|---|
| Cloud Engineer | SEPL | Jun 2026 — Present |
| Azure Cloud Engineer | Celebal Technologies | Apr 2024 — Feb 2026 |
| Machine Learning & Data Science Analyst | Zeetron Networks | May 2023 — Jun 2023 |

> ⚠️ Zeetron is an **ML / Data Science** role (Python, pandas, NumPy,
> Matplotlib, SciPy, model building, deployment) — it was wrongly entered as
> "Cloud / DevOps Intern" once. Do not revert this.

Content came **directly from Monarch**, not LinkedIn (LinkedIn needs a login;
the resume is a scanned image with no text layer). Do not silently "correct"
content — ask him.

`portfolio/scripts/sync-profile.mjs` runs daily via GitHub Actions and
refreshes `profile.json` from the GitHub API, but **preserves hand-curated
keys** (`about`, `skills`, `experience`, `education`, `certifications`), so
content edits are safe.

## 4. Stack

Next.js **14.2.35** (App Router) · React 18.3.1 · TypeScript 5.5.3 ·
Tailwind **3.4.6** · `output: "export"` static site on GitHub Pages.

`next.config.mjs`:

```js
output: "export",
basePath: isProd ? "/Portfolio-Website" : "",
assetPrefix: isProd ? "/Portfolio-Website/" : "",
images: { unoptimized: true },
```

Consequences:

- **No server, no API routes, no Image optimization.** Animated components need
  `"use client"`.
- **`basePath` is applied at build time.** Any GLTF / texture / HDR loaded by
  URL must resolve under `/Portfolio-Website/...` in production or it 404s.
  Prefer importing assets so Next handles the prefix.
- A past bug was an `og:image` URL with the basePath **doubled**
  (`/Portfolio-Website/Portfolio-Website/avatar.png`). Watch for this.

Page order (`portfolio/src/app/page.tsx`):
`Navbar → Hero → About → Stats → Skills → Experience → Projects → Education → Contact → Footer`

Components in `portfolio/src/components/`:
`About Contact Education Experience Footer Hero Navbar Projects Reveal Skills Stats`

`Reveal.tsx` is the only existing animation — IntersectionObserver fade-in-up,
respecting `prefers-reduced-motion` via `globals.css`. Keep that behaviour.

## 5. Environment quirks

**Portable Node — do not call `npm` directly.** `npm.ps1` is blocked by the
PowerShell execution policy. Node is at
`C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe`. Invoke CLIs
through it instead:

```powershell
& 'C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe' node_modules/next/dist/bin/next build
```

For package installs use `node_modules/npm/bin/npm-cli.js`.

**Terminal output capture breaks often** — `run_in_terminal` returns
"Command produced no output" for commands that clearly ran. Reliable pattern:
write a `.ps1` that does the work and `Out-File`s results to a `.txt`, run it
via a VS Code task, then `read_file` the `.txt`.

**`next build` hangs** in this workspace, leaving stuck `node` processes that
hold output files open. If a build produces nothing for a couple of minutes:

```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }
```

then delete `portfolio/out` and `portfolio/.next` and rebuild.

**VS Code appends a scratch entry to `.vscode/tasks.json` on every task run** —
the file has ~30 entries and always shows as modified. Ignore it; it is not a
real change.

Other tools: Git `C:\Program Files\Git\cmd\git.exe`,
GitHub CLI `C:\Program Files\GitHub CLI\gh.exe`
(`gh run list --repo MonarchSharma20502/Portfolio-Website --limit 3`).
GitHub Pages caches aggressively — verify deploys with a cache-busting URL
(`?cb=<timestamp>`) or you will see stale content.

## 6. Verify before done

- [ ] `next build` exits 0 (watch the hang)
- [ ] `portfolio/out/index.html` regenerated with new content
- [ ] 3D assets load in the **production** build, not just `next dev`
- [ ] Site still usable; `prefers-reduced-motion` honoured
- [ ] Committed to **`animated-portfolio`** only; `main` untouched
- [ ] Scratch `.ps1` / `.txt` files deleted

## 7. Open questions for Monarch

1. Enhance the existing app, or a separate one alongside it?
2. Which sections get 3D — hero only, or the whole page?
3. Any model in mind, or abstract shapes / particles (he is a Cloud & DevOps
   engineer)?
4. Is a heavier bundle acceptable? Three.js adds ~600KB+ gzipped.
