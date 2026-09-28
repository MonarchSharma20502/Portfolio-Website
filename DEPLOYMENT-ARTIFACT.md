# Deployment & the Build Artifact

A focused reference on **what `deploy.yml` actually produces**, what that artifact is good for,
and the silent couplings that can break a deploy. Companion to `README.md` section 6 (which covers
the pipeline at a high level); this file goes deeper on the artifact itself and the failure modes.

Everything below was verified against the repo as of 2026-09-28.

---

## 1. What artifact is generated?

A **GitHub Pages deployment artifact**: a single `artifact.tar` containing the entire static export
from `portfolio/out/`, uploaded under the fixed name **`github-pages`**.

The chain that produces it:

```
npm run build            next build with output: "export"
     |                    writes plain HTML/CSS/JS to portfolio/out/
     v
portfolio/out/           pre-rendered HTML, /_next/static/* chunks,
     |                    public assets, sitemap - basePath already baked in
     v
actions/upload-pages-artifact@v3     tars the folder -> artifact.tar
     |                                uploaded as workflow artifact "github-pages"
     v
actions/deploy-pages@v4              downloads artifact.tar, publishes to Pages
```

The relevant steps in `.github/workflows/deploy.yml`:

```yaml
- name: Build static site
  working-directory: portfolio
  run: npm run build

- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: portfolio/out
```

Two jobs, run in order. The `deploy` job has **no `actions/checkout` step** - that is the tell that
it operates purely on the artifact. It never reads your source repository.

---

## 2. Your local `out/` is irrelevant to the deploy

The deployed site is **always rebuilt from source** on a fresh `ubuntu-latest` runner. Nothing in the
workflow uploads your local build output, and it could not even if it wanted to - the root
`.gitignore` excludes it:

```
# Next.js build output
.next/
out/
```

So `portfolio/out/` never enters git, never reaches the runner, and has no influence on what is
published.

**Practical consequences:**

- You cannot "fix" a broken deploy by rebuilding locally. If the live site is wrong, the fix has to
  be a commit to `main` (or a manual `workflow_dispatch` run).
- You can delete your local `out/` and `.next/` folders at any time without affecting anything.
- A clean local build is *reassuring*, not *sufficient*. It proves your machine can build, not that
  GitHub's runner will produce the same output.

The one thing local builds *are* good for: catching environment-specific problems before you push,
since the runner's Node version, env vars and clean install differ from yours.

---

## 3. The artifact is the *output*, not the source

`artifact.tar` is a snapshot of **compiled output**: minified JS in `/_next/static/`, pre-rendered
HTML for every route, asset URLs with the `/Portfolio-Website` prefix already baked in. It contains
no TypeScript, no JSX, no `profile.json` in source form.

### Why you would want it

It is the ground truth for "what is actually live." Your source can look correct while the build
silently produced something different - a stale dependency, a changed env var, a config value that
altered asset paths. Reading the artifact shows you exactly what visitors receive, with no guessing
from source.

### How to get it

1. Open the **Actions** tab in the repo.
2. Click the workflow run you care about.
3. At the bottom of the summary page, under **Artifacts**, download `github-pages`.
4. Untar it:

   ```bash
   tar -xf artifact.tar
   ```

   (On Windows, `tar` is available in PowerShell on Windows 10+; or use 7-Zip / WSL.)

### What to check once you have it

| Symptom on the live site | What to look for in the artifact |
|---|---|
| No CSS / JS / images loading | Open `index.html`, look at the `/_next/static/...` URLs. They must start with `/Portfolio-Website/`. If the prefix is missing, `basePath` was not active at build time. |
| Old content showing after a push | Compare the HTML text and the chunk hashes in `/_next/static/` against the previous artifact. Identical hashes = the build output did not change, so the problem is upstream of the build. |
| 404s on deep links | Confirm the exported HTML files exist for each route and that `trailingSlash` behavior matches your links. |
| SEO / link previews broken | Check the `<meta>` tags and the absolute `og:image` URL. |

---

## 4. The one fragile coupling: `path: portfolio/out`

`next build` writes the export to a directory chosen by Next config; the workflow **hardcodes** that
same directory. If the two ever disagree, the build fails.

```yaml
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: portfolio/out   # <- must match where next build actually wrote the files
```

**Where does Next write it?** `portfolio/next.config.mjs` sets **no `distDir`**, so Next uses its
default. For `output: "export"` that default is `out`:

```js
const nextConfig = {
  reactStrictMode: true,
  output: "export",                        // static export, written to ./out
  basePath: isProd ? `/${repo}` : "",      // "/Portfolio-Website" in production only
  assetPrefix: isProd ? `/${repo}/` : "",
  ...
};
```

So today the coupling is `out` (Next's default) <-> `portfolio/out` (workflow path), and it is
correct. Nothing to fix right now.

**The failure mode if it breaks:** `upload-pages-artifact` fails the step when the path is missing,
so you get a red build rather than a silently bad deploy. The catch is that the error message points
at the *artifact step*, not at your config - which is why this coupling is worth remembering when it
happens. If you ever set `distDir: "export"` (or similar) in `next.config.mjs`, update
`path:` in the same change.

---

## 5. The three-way `basePath` coupling (the subtler trap)

`basePath` and `assetPrefix` in `next.config.mjs` are gated on `NODE_ENV === "production"`:

```js
basePath: isProd ? `/${repo}` : "",
```

That single line means **three separate things must agree on the `/Portfolio-Website` prefix**, and
two of them are implicit:

| # | Where | Prefix present? | Why |
|---|---|---|---|
| 1 | Production build on the GitHub runner | **Yes** | `next build` runs with `NODE_ENV=production` |
| 2 | Your local `npm run dev` | **No** | dev mode is not production |
| 3 | Your local static server (`_work/serve-out.js`) | **Stripped** | it removes `/Portfolio-Website` to match #2's output |

This is why `_work/serve-out.js` contains this line:

```js
// Strip the GitHub Pages basePath when present, since out/ already contains it.
urlPath = urlPath.replace(/^\/Portfolio-Website/, "");
```

The local server exists to serve the *production* export (which has the prefix baked in) at a URL
without the prefix. If you ever change the repo name or the `basePath` logic, that regex needs
updating in lockstep - otherwise every asset request 404s and the site loads unstyled.

**Rule of thumb:** any change to the repo name, `basePath`, or `assetPrefix` requires touching
`next.config.mjs` **and** `_work/serve-out.js` in the same commit.

---

## 6. Finding: `NEXT_PUBLIC_SITE_URL` is set but never read

`deploy.yml` passes this env var into the build:

```yaml
NEXT_PUBLIC_SITE_URL: ${{ vars.NEXT_PUBLIC_SITE_URL || format('https://{0}.github.io/{1}', github.repository_owner, github.event.repository.name) }}
```

The intent is sensible: let a custom domain override the default Pages URL. But **nothing in the app
reads it.** A workspace-wide search for `NEXT_PUBLIC_SITE_URL` finds only two hits, both in config
docs (`deploy.yml` and `README.md`) - zero references in `portfolio/src/`.

The site URL is instead hardcoded in two places:

- `portfolio/src/lib/profile.ts`:
  ```ts
  siteUrl: "https://monarchsharma20502.github.io/Portfolio-Website",
  ```
- `portfolio/src/app/layout.tsx`:
  ```ts
  metadataBase: new URL("https://monarchsharma20502.github.io/Portfolio-Website"),
  ```

So setting the `NEXT_PUBLIC_SITE_URL` repository variable today does **nothing**. The README's
"(Optional) Set the repository variable `NEXT_PUBLIC_SITE_URL` for a custom domain" instruction is
currently misleading.

### Why it matters

`siteUrl` feeds SEO metadata and the Open Graph image URL. In `layout.tsx` there is a comment
explaining a real gotcha:

```ts
// profile.avatar is site-absolute ("/Portfolio-Website/avatar.png"). Next.js
// prepends basePath to relative metadata image URLs and then resolves them
// against metadataBase, which would double the prefix and 404 in link previews.
// A full absolute URL is used verbatim instead.
const avatarUrl = `${profile.siteUrl}${profile.avatar}`;
```

If you ever move to a custom domain, you must update **both** hardcoded URLs or link previews will
point at the old `github.io` address. To make the env var actually work as documented, `profile.ts`
would read `process.env.NEXT_PUBLIC_SITE_URL` with the current value as the fallback - a small,
safe change. (Not done here since you only asked for documentation.)

---

## 7. Quick reference: what lives where

| Thing | Location | Notes |
|---|---|---|
| Workflow definition | `.github/workflows/deploy.yml` | build + deploy, two jobs |
| Next config | `portfolio/next.config.mjs` | `output: "export"`, `basePath` prod-only |
| Export output (local) | `portfolio/out/` | gitignored; never affects the deploy |
| Local static server | `_work/serve-out.js` | strips `/Portfolio-Website`; `node serve-out.js 4322` from `portfolio/out` |
| Site URL (hardcoded) | `portfolio/src/lib/profile.ts`, `portfolio/src/app/layout.tsx` | env var override is currently inert |
| Artifact name | `github-pages` | downloadable from any workflow run summary |

---

## 8. Mental model, one paragraph

A push to `main` triggers `deploy.yml`, which checks out the source on a throwaway Linux VM, runs
`npm ci` and `npm run build`, and gets a fresh `portfolio/out/`. It tars that folder into
`artifact.tar` and uploads it as the `github-pages` artifact. A second job downloads that artifact -
never the source - and publishes its contents to GitHub Pages. Your local `out/` is gitignored and
therefore irrelevant; the artifact is compiled output rather than source, which is exactly why it is
the right thing to inspect when the live site does not match what you expect. The two couplings to
remember are `path: portfolio/out` (must match where Next writes the export) and the three-way
`basePath` agreement between the production build, dev mode, and the local static server.
