# Editing Website Content Manually

Everything on the site is driven by **one file**. You almost never need to
touch React/TypeScript code to change content.

```
portfolio/data/profile.json   <-- the only file you edit
        |
        v
portfolio/src/lib/profile.ts  (imports the JSON, adds siteUrl, exports types)
        |
        v
portfolio/src/components/*.tsx (Hero, About, Skills, Experience,
                                Projects, Education, Contact)
```

No component hardcodes text. Each one reads from `profile.json`, so "adding
something to a section" means editing JSON.

---

## 1. Edit the data

Open `portfolio/data/profile.json` and edit the relevant array (see the
field map below). Save the file.

### Optional / empty fields

These are **omitted from the page entirely** when left blank — no empty box
or stray label is shown:

- `education[].degree` — leave `""` to show only the institution and dates
- `education[].location` — leave `""` to hide the location line
- `experience[].end` — set to `null` on a current job; it renders as "Present"

### Field map: JSON key -> section on the page

| Section | Keys in `profile.json` |
|---|---|
| Hero | `name`, `role`, `tagline`, `location`, `email`, `hireable` |
| About | `about` (array of paragraphs), `quote`, `focus`, `currentlyLearning`, `philosophy`, `mindset` |
| Skills | `skills` (array of `{ category, items[] }`) |
| Experience | `experience` (array of job objects) |
| Projects | `projects` (array of project objects) |
| Education & Certifications | `education` (array), `certifications` (array of strings) |
| Contact | `email`, `github.url`, `linkedin.url` |

### Copy-paste templates

**A job** (add to `experience`):

```json
{
  "company": "Company Name",
  "title": "Your Title",
  "start": "Jan 2026",
  "end": null,
  "current": true,
  "summary": "One-line description of the role.",
  "highlights": [
    "Achievement one.",
    "Achievement two.",
    "Achievement three."
  ]
}
```

**A school or course** (add to `education`):

```json
{
  "institution": "Institution Name",
  "location": "City, State, Country",
  "degree": "B.Tech in Computer Science & Engineering",
  "start": "2021",
  "end": "2025",
  "current": false
}
```

**A certification** (add to `certifications` — plain strings):

```json
"AZ-500 — Microsoft Azure Security Technologies"
```

**A skill** (add a string to the right `items` array, or add a whole new
group object to `skills`):

```json
{
  "category": "New Category",
  "items": ["Skill One", "Skill Two"]
}
```

**A project** (add to `projects`):

```json
{
  "name": "Project Name",
  "description": "What it does and what it demonstrates.",
  "tech": ["Kubernetes", "Azure"],
  "repo": "https://github.com/MonarchSharma20502/Project-Name",
  "featured": true
}
```

> `featured: true` puts the project in the main grid.
> `featured: false` moves it under "More experiments".

---

## 2. Rebuild

Open a terminal **in the `portfolio/` folder** and run:

```powershell
cd "C:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website\portfolio"

# REQUIRED once per terminal session. Without these the build either cannot
# find node (it spawns child processes) or stalls partway through.
$env:PATH = "C:\Users\monar\node-portable\node-v22.11.0-win-x64;$env:PATH"
$env:NODE_ENV = "production"
$env:CI = "true"

npm run build
```

This regenerates `portfolio/out/`, the static site. You will see
`✓ Generating static pages (XX/XX)` when it finishes (about 40 seconds).

**If the build hangs** after printing the Next.js banner and never exits, the
three environment lines above were not set. `CI=true` is the one most often
forgotten — without it the build stalls on telemetry.

**In VS Code without a terminal:** press `Ctrl+Shift+B` and choose **build**.
(The task sets the environment for you.)

---

## 3. Refresh the browser

The local server (`_work/serve-out.js`) reads files from disk on **every
request**. After a rebuild, just **reload the browser tab** at
<http://localhost:4322> — no server restart needed.

### If the server is not running

```powershell
# Stop whatever is bound to 4322
Get-NetTCPConnection -LocalPort 4322 |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Start it again. The working directory MUST be portfolio\out.
cd "C:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website\portfolio\out"
& "C:\Users\monar\node-portable\node-v22.11.0-win-x64\node.exe" "C:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website\_work\serve-out.js" 4322
```

The server strips the `/Portfolio-Website` basePath automatically, so both
<http://localhost:4322/> and <http://localhost:4322/Portfolio-Website/>
serve the same site.

### Quick check that the new content shipped

```powershell
$html = "C:\Users\monar\OneDrive - Surbhi Electronet Private Limited (SEPL)\Desktop\Portfolio Website\portfolio\out\index.html"
(Get-Item $html).LastWriteTime          # should be just now
[System.IO.File]::ReadAllText($html) -match "Your New Text"
```

---

## Warnings

**1. Do not run `npm run sync` after hand-editing.**
`portfolio/scripts/sync-profile.mjs` refreshes data from the live GitHub API.
It deliberately preserves `about`, `skills`, `experience`, `education` and
`certifications`, but it **overwrites** `name`, `location`, `company`,
`email` and `projects` from your real GitHub repos. Preview first with:

```powershell
npm run sync -- --dry-run
```

**2. Do not commit to `main`.**
`main` auto-deploys to GitHub Pages. Keep content changes on
`animated-portfolio` and merge when you are ready to publish.

**3. Keep valid JSON.**
A trailing comma or missing quote breaks the whole build. VS Code shows a red
squiggle and refuses to let you save a malformed file in most cases — pay
attention to it.
