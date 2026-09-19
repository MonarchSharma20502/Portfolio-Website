# Monarch Sharma — Portfolio Website

An interactive, attractive single-page portfolio for **Monarch Sharma** (Cloud / DevOps Engineer),
built with **Next.js + TypeScript + Tailwind CSS** and deployed as a static site on **GitHub Pages**.

The best part: the content is **not hard-coded in the pages**. Everything lives in one JSON file and a
scheduled GitHub Actions workflow keeps that file in sync with GitHub (and optionally LinkedIn), so the
website updates itself without you editing a single line of code.

---

## 1. Project structure

```
.
├── .github/workflows/
│   ├── deploy.yml          # Builds the site and publishes it to GitHub Pages
│   └── sync.yml            # Daily job that refreshes profile.json from GitHub/LinkedIn
├── portfolio/
│   ├── data/
│   │   ├── profile.json    # ← THE single source of truth (all site content)
│   │   └── profile.raw.json# Raw extracted facts + provenance (reference only)
│   ├── public/
│   │   └── avatar.png      # Profile photo
│   ├── scripts/
│   │   └── sync-profile.mjs# The auto-sync script (GitHub API + optional LinkedIn)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx  # Fonts, SEO metadata, JSON-LD Person schema, theme bootstrap
│   │   │   ├── page.tsx    # Composes the sections in order
│   │   │   └── globals.css # Tailwind + theme tokens + reveal animations
│   │   ├── components/
│   │   │   ├── Navbar.tsx      # Sticky nav, scroll-spy, mobile menu, theme toggle
│   │   │   ├── Hero.tsx        # Name, role, headline, CTA + social links
│   │   │   ├── About.tsx       # Bio, focus areas, currently exploring, philosophy
│   │   │   ├── Stats.tsx       # Live GitHub numbers (repos, followers, contributions)
│   │   │   ├── Skills.tsx      # Skills grouped by category
│   │   │   ├── Experience.tsx  # Work history timeline
│   │   │   ├── Projects.tsx    # Featured projects + "more experiments" list
│   │   │   ├── Contact.tsx     # Email / GitHub / LinkedIn channels
│   │   │   ├── Footer.tsx      # Links + copyright
│   │   │   └── Reveal.tsx      # Scroll-in fade animation wrapper
│   │   └── lib/
│   │       └── profile.ts  # Types profile.json and exports it to the components
│   ├── next.config.mjs     # output: "export" → static HTML for GitHub Pages
│   └── package.json
└── README.md               # ← you are here
```

---

## 2. How the data flows

```
   GitHub API ─┐
               ├─→  scripts/sync-profile.mjs  ─→  data/profile.json
   LinkedIn*  ─┘                                        │
                                                        │  typed by
                                                        ▼
                                              src/lib/profile.ts
                                                        │
                                                        ▼
                                             React components (Hero, Projects, …)
                                                        │
                                                        ▼
                                              Static site on GitHub Pages
```

\* LinkedIn has no public anonymous API — see section 5 for how to enable it.

**Why this matters:** to change anything on the site you edit `data/profile.json` (or let the sync
workflow do it for you). No component ever contains your name, projects or links directly.

---

## 3. The components and what they do

| Component | Purpose |
|-----------|---------|
| `Navbar` | Sticky top bar with smooth-scroll links, a scroll-spy that highlights the current section, a mobile hamburger menu and a dark/light theme toggle. |
| `Hero` | The opening view: photo, name, role, headline and buttons to email, GitHub and LinkedIn. |
| `About` | Short bio, focus areas, what you are currently exploring and your learning philosophy. |
| `Stats` | Four numbers pulled live from the GitHub API (public repos, followers, following, contributions). |
| `Skills` | Skill chips grouped by category (Cloud, Containers, CI/CD, Languages, Tools, AI tooling). |
| `Experience` | A vertical timeline of roles with highlights. Renders nothing if the list is empty. |
| `Projects` | Featured project cards (description + tech chips + repo link) plus a compact list of further repositories. |
| `Contact` | A closing panel with Email / GitHub / LinkedIn cards and a "Say hello" button. |
| `Footer` | Repeated social links and a self-updating copyright year. |
| `Reveal` | A small wrapper that fades content in as it scrolls into view; fully disabled when the visitor prefers reduced motion. |

Accessibility: semantic landmarks (`<main>`, `<nav>`, `<footer>`), real heading order, keyboard-friendly
navigation, visible focus states, `aria-label`s on icon-only links and a theme that is set before first
paint to avoid a flash.

---

## 4. Run it locally

Requirements: **Node.js 18+** and npm.

```bash
cd portfolio
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # static export into portfolio/out
npm run lint     # ESLint
npm run sync     # refresh profile.json from the GitHub API now
npm run sync -- --dry-run   # preview changes without writing
```

---

## 5. The automation (the part you asked for)

Two GitHub Actions workflows live in `.github/workflows/`.

### `sync.yml` — keeps the site up to date
- Runs **every day at 06:00 UTC** and on manual dispatch.
- Executes `portfolio/scripts/sync-profile.mjs`, which calls the public **GitHub REST API**:
  - `/users/MonarchSharma20502` → name, location, company, hireable status, avatar, followers/following/public repos.
  - `/users/MonarchSharma20502/repos` → repositories, ranked by stars/forks/recency, merged into the project list.
- **Hand-curated content (bio, skills, experience, education) is never overwritten** — the script only
  refreshes GitHub-sourced fields and appends newly discovered repos.
- If anything changed, the workflow **commits `profile.json`** as `github-actions[bot]` and pushes.
- That push then triggers `deploy.yml`, so a profile change on GitHub reaches the live site with no
  manual work. **This is the "tracks my GitHub automatically" behaviour.**

**Optional secrets** (Settings → Secrets and variables → Actions):

| Secret | Why |
|--------|-----|
| `GITHUB_TOKEN` | Already provided by Actions; passing it raises the API rate limit from 60 to 5000 requests/hour. |
| `LINKEDIN_JSON_URL` | A raw URL to an exported LinkedIn JSON profile (Settings → Data privacy → Download your data). When set, the script maps `experience` from it. LinkedIn cannot be scraped anonymously, so this is opt-in. |

### `deploy.yml` — publishes the site
- Triggers on every push to `main` and on manual dispatch.
- `npm ci` → `npm run build` (static export) → uploads `portfolio/out` → deploys to GitHub Pages.

### One-time GitHub Pages setup
1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. (Optional) Set the repository variable `NEXT_PUBLIC_SITE_URL` for a custom domain.

The site will then be live at `https://monarchsharma20502.github.io/<repo-name>`.

---

## 6. How the CI/CD pipeline works (in detail)

A plain-English walkthrough of what runs, where, and when.

### Where does it run? (Not Docker)

Both workflows run on **GitHub-hosted `ubuntu-latest` runners** — ephemeral virtual machines that
GitHub provisions on demand and destroys as soon as the job finishes. There is **no Docker container,
no self-hosted server and no process running on your laptop**; nothing needs to be kept online.

The **deployment target** is **GitHub Pages**, GitHub's free static-site hosting. Because the repo is
configured with **Source: GitHub Actions** (`build_type: workflow`), the workflow needs the
`pages: write` and `id-token: write` permissions defined at the top of `deploy.yml` and uses the
official `actions/deploy-pages@v4` action to publish.

### When does it trigger?

| Workflow | Trigger | Defined in |
|----------|---------|------------|
| `deploy.yml` | Every **push to `main`**, plus manual **Run workflow** | `.github/workflows/deploy.yml` |
| `sync.yml` | **Cron `0 6 * * *`** (daily at 06:00 UTC), plus manual **Run workflow** | `.github/workflows/sync.yml` |

`deploy.yml` also declares a `concurrency` group named `pages` with `cancel-in-progress: true`, so if
you push twice in quick succession the older run is cancelled and only the newest code is published.

### How does it detect changes?

Two completely different mechanisms:

1. **Deploy pipeline — event-driven.** GitHub fires a `push` webhook the instant commits land on `main`.
   There is no polling and no diffing; the build starts immediately. This is why a normal
   `git push` is all you ever need to publish.
2. **Sync pipeline — scheduled, then a git diff.** `sync.yml` wakes up at 06:00 UTC, refreshes
   `profile.json` from the GitHub API, and then explicitly checks whether the file actually changed:
   ```yaml
   if git diff --quiet portfolio/data/profile.json; then
     echo "No changes to commit."
   else
     git add portfolio/data/profile.json
     git commit -m "chore(data): auto-sync profile from GitHub/LinkedIn [skip ci]"
     git push
   fi
   ```
   Nothing is committed when nothing changed — that check *is* the change detection.

### The whole flow

```mermaid
flowchart TD
    A["You push to main<br/>OR cron fires at 06:00 UTC"] --> B{Which trigger?}
    B -->|push to main| C[deploy.yml]
    B -->|cron| S[sync.yml]
    S --> S1[Fetch GitHub / LinkedIn stats]
    S1 --> S2{profile.json changed?}
    S2 -->|No| Z1[Done — nothing committed]
    S2 -->|Yes| S3["Commit + push<br/>(message ends in [skip ci])"]
    C --> D["ubuntu-latest runner<br/>(NOT Docker)"]
    D --> E["checkout → setup-node 20<br/>→ npm ci → npm run build"]
    E --> F[Static export into portfolio/out]
    F --> G[upload-pages-artifact]
    G --> H[deploy-pages v4]
    H --> I["GitHub Pages<br/>monarchsharma20502.github.io"]
```

### One caveat to remember

The bot's auto-sync commit ends in `[skip ci]`, so a stats refresh (a new repo, a new follower) does
**not** redeploy the site on its own. Those updated numbers appear on the live site the next time you
push to `main`, or whenever you manually run **Actions → "Deploy to GitHub Pages" → Run workflow**
(the `workflow_dispatch` trigger). If you would rather have stat changes publish automatically, remove
`[skip ci]` from the commit message in `sync.yml` — at the cost of one extra deploy per day whenever
the numbers move.

---

## 7. Where the data came from

| Source | Used for |
|--------|----------|
| GitHub profile README + REST API | Name, role, bio, location, stats, repositories, projects, tech stack — **verified** |
| LinkedIn public profile URL | The contact link only (the profile is behind an auth wall) |
| Résumé (`Monarch Resume.pdf`) | Could not be parsed — it is a scanned image with no text layer |

**Needs your confirmation before publishing:** work experience dates/details, education and
certifications are currently empty or marked as unverified in `data/profile.raw.json`. Tell me the
correct values and I will add them to `profile.json`.

---

## 8. Deploy (Vercel alternative)

Prefer Vercel? Import the repository, set the root directory to `portfolio`, and deploy — no
configuration needed. Remove `output: "export"` from `next.config.mjs` if you want Vercel's
image optimization and server features.

---

## 9. Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · GitHub Actions · GitHub Pages
