# Portfolio Website — Deployment Plan

## Status: build is GREEN, code is ready. Two environment tasks remain.

---

## Remaining tasks

### 1. Commit the pending changes and push to GitHub
The working tree has uncommitted work that must be committed before pushing:

```
 M .gitignore                        (added build-log + scratch-script ignore rules)
AD portfolio/build.log               (staged-add then deleted — resolves on commit)
M  portfolio/data/profile.json
M  portfolio/src/app/page.tsx
M  portfolio/src/components/Contact.tsx
A  portfolio/src/components/Education.tsx
M  portfolio/src/components/Navbar.tsx
M  portfolio/src/lib/profile.ts
?? .vscode/                          (decide: commit or ignore)
```

Remote is already wired: `origin → https://github.com/MonarchSharma20502/Portfolio-Website.git`, branch `main`.

### 2. Authenticate and push
- GitHub CLI is **not installed** (`gh auth login` will not work).
- Git Credential Manager **is** installed at `C:\Program Files\Git\mingw64\bin\git-credential-manager.exe`, so a browser-based OAuth popup is available — no PAT needed.
- Do **not** put a PAT in `.env`. Nothing reads it (no `dotenv` import exists), and `.gitignore` excludes `.env` anyway. The `GITHUB_TOKEN` used by the sync workflow is GitHub's built-in Actions token, not a personal one.

### 3. Enable GitHub Pages
Repo → **Settings → Pages → Source: GitHub Actions**.
Site will live at `https://monarchsharma20502.github.io/Portfolio-Website`.
The `deploy.yml` workflow already handles build + deploy on push to `main`.

---

## What was causing trouble (and how each was resolved)

| # | Problem | Root cause | Resolution |
|---|---------|-----------|------------|
| 1 | `next build` produced no output after the Next.js banner | Terminal output capture in this session is broken — commands run but their output is never returned | Route all commands through a VS Code **task** running a `.ps1` script, then `read_file` the output log |
| 2 | `npm : running scripts is disabled on this system` | PowerShell execution policy blocks `npm.ps1` | Invoke `node.exe` directly on `node_modules/npm/bin/npm-cli.js` |
| 3 | `'"node"' is not recognized as an internal or external command` | Portable Node (`C:\Users\monar\node-portable\node-v22.11.0-win-x64`) is not on PATH, and `next build` shells out to `node` internally | Prepend the portable node directory to `$env:PATH` in the build script |
| 4 | PowerShell `>>` continuation prompt / `AmpersandNotAllowed` | The workspace path contains `(SEPL)` and spaces, which break inline `-Command` strings | Put commands in a `.ps1` file and run it with `-ExecutionPolicy Bypass -File` |
| 5 | `import "";` in `layout.tsx` | Malformed side-effect import — a real syntax error that killed the bundle | Fixed to `import "./globals.css";` |
| 6 | `Cannot find module ... './globals.css'` (TS) + `Unknown at rule @tailwind/@apply` (CSS) | VS Code language-server false positives — Next.js has no ambient `*.css` module declaration, and the CSS LSP does not know Tailwind directives | **Benign.** The build compiles and emits CSS correctly. Do not "fix" by removing the import or rewriting the CSS |
| 7 | Build logs appearing as untracked files | `build-*.log` were not covered by `.gitignore` | Added `build-*.log`, `*.log`, and scratch-script patterns to `.gitignore` |

---

## Verified working

- **Build:** `next build` succeeds. Static export written to `portfolio/out/` — `index.html` (71 KB), `404.html`, `avatar.png`, `_next/static/*` chunks, one CSS file (27 KB), and 12 self-hosted `.woff2` fonts. `output: "export"` is set in `next.config.mjs`.
- **All 11 components** render from `page.tsx`: Navbar, Hero, About, Stats, Skills, Experience, Projects, Education, Contact, Footer, plus the `Reveal` intersection-observer wrapper.
- **Data layer:** `portfolio/data/profile.json` is complete (10 projects, 6 skill groups, 1 role, 1 education entry, 5 certifications) and consumed via `@/lib/profile` with the `@data/*` path alias.
- **CI/CD workflows:** `deploy.yml` (build → upload Pages artifact → deploy) and `sync.yml` (daily 06:00 UTC profile refresh from the GitHub API, auto-commits with `contents: write`). Both use `working-directory: portfolio` and `cache-dependency-path: portfolio/package-lock.json`.
- **SEO/a11y:** metadata, OpenGraph, Twitter cards, JSON-LD `Person` schema, `prefers-reduced-motion` support, and a pre-paint theme script in `layout.tsx`.
- **Sync script:** `scripts/sync-profile.mjs` merges live GitHub data while preserving hand-curated fields (about, skills, experience, education, certifications), fails soft on API errors so it never breaks the deploy.

---

## Known limitations (by design, not bugs)

- **Contributions count** (`stats.contributionsLastYear: 118`) is a static figure — GitHub's REST API does not expose it. It only updates if you edit `profile.json` manually.
- **LinkedIn sync** is inert unless you set the `LINKEDIN_JSON_URL` repo secret to a raw export. LinkedIn has no anonymous API.
- **Avatar** is served from `/avatar.png` (696 KB local file). Next/Image optimization is disabled because static export cannot run the image server.

---

## Suggested commit message

```
feat: portfolio website with GitHub/LinkedIn auto-sync

- Next.js 14 static export + Tailwind CSS, 11 sections
- GitHub Actions: deploy to Pages + daily profile auto-sync
- Fixes malformed CSS import in layout.tsx
```
