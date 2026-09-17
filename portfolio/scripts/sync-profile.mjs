/**
 * scripts/sync-profile.mjs
 *
 * Refreshes portfolio/data/profile.json from live public data so the website
 * stays in sync with GitHub (and optionally LinkedIn) without manual edits.
 *
 * Sources:
 *  - GitHub REST API (public, no auth needed for 60 req/hour per IP):
 *      /users/:user            -> name, bio, location, hireable, followers...
 *      /users/:user/repos      -> repo list (name, description, stars, topics)
 *  - LinkedIn (OPTIONAL): LinkedIn has no public anonymous API. If you want
 *      experience/education to auto-sync, export your LinkedIn profile as JSON
 *      (Settings → Data privacy → Download your data) and point
 *      LINKEDIN_JSON_URL at the raw file. Otherwise those fields are left
 *      untouched and only GitHub-driven fields are refreshed.
 *
 * Runs locally and in CI (see .github/workflows/sync.yml).
 *
 * Usage:
 *   node scripts/sync-profile.mjs              # refresh + write
 *   node scripts/sync-profile.mjs --dry-run    # report changes only
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFILE_PATH = join(__dirname, "..", "data", "profile.json");
const DRY_RUN = process.argv.includes("--dry-run");

const GITHUB_USER =
  process.env.GITHUB_USERNAME || "MonarchSharma20502";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""; // optional, raises rate limit
const LINKEDIN_JSON_URL = process.env.LINKEDIN_JSON_URL || ""; // optional

const API = "https://api.github.com";
const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

/** Fetch JSON, exit softly on network/API errors so CI never fails the deploy. */
async function getJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { ...headers, ...opts.headers } });
  if (!res.ok) {
    console.warn(`⚠  ${url} -> HTTP ${res.status}`);
    return null;
  }
  return res.json();
}

/** GitHub returns some fields (name, location) in ALL CAPS for some profiles.
 *  Restore normal casing so the site does not shout at visitors. */
function unYell(str) {
  if (typeof str !== "string") return str;
  const trimmed = str.trim();
  if (!trimmed) return str;
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
    return trimmed
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return trimmed;
}

/** Sort repos by popularity (stars, then forks, then recency). */
function rankRepos(repos) {
  return [...repos]
    .filter((r) => !r.fork && !r.archived && !r.disabled)
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count ||
        b.forks_count - a.forks_count ||
        new Date(b.pushed_at) - new Date(a.pushed_at)
    );
}

/** Convert a raw repo into the Project shape used by the site. */
function repoToProject(repo) {
  const tech = [
    ...(repo.topics || []),
    repo.language ? repo.language : [],
  ].flat();
  return {
    name: repo.name,
    description:
      repo.description?.trim() ||
      `${repo.name} — see the repository for details.`,
    tech: [...new Set(tech)].slice(0, 6),
    repo: repo.html_url,
    featured: false,
  };
}

/** Merge refreshed fields into the existing profile without losing hand-curated
 *  content (about text, skill groups, experience, education, etc.). */
function mergeProfile(existing, fresh) {
  return {
    ...existing,
    ...fresh,
    // Preserve hand-curated keys that automated sources should not overwrite.
    about: existing.about,
    skills: existing.skills,
    experience: existing.experience,
    education: existing.education,
    certifications: existing.certifications,
  };
}

async function main() {
  console.log(`→ GitHub user: ${GITHUB_USER}${DRY_RUN ? " (dry run)" : ""}`);

  const existing = JSON.parse(readFileSync(PROFILE_PATH, "utf8"));
  const fresh = {};

  // ---- GitHub user profile -------------------------------------------------
  const user = await getJSON(`${API}/users/${GITHUB_USER}`);
  if (user) {
    fresh.username = user.login;
    fresh.name = unYell(user.name) || user.login;
    fresh.location = unYell(user.location) || existing.location;
    fresh.company = unYell(user.company) || existing.company;
    fresh.hireable = Boolean(user.hireable);
    fresh.github = {
      username: user.login,
      url: user.html_url,
    };
    if (user.email) fresh.email = user.email;
    if (user.avatar_url && existing.avatar?.startsWith("http")) {
      fresh.avatar = user.avatar_url;
    }
    fresh.stats = {
      ...(existing.stats || {}),
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      // GitHub does not expose contribution counts in the REST API; keep the
      // last known value and let the README explain how to refresh it.
      contributionsLastYear: existing.stats?.contributionsLastYear ?? null,
      achievements: existing.stats?.achievements || [],
    };
    console.log(
      `  profile: ${fresh.name} · ${user.public_repos} repos · ${user.followers} followers`
    );
  }

  // ---- GitHub repositories -------------------------------------------------
  const repos = await getJSON(
    `${API}/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`
  );
  if (Array.isArray(repos)) {
    const ranked = rankRepos(repos);
    const auto = ranked.map(repoToProject);

    // Keep any project the user explicitly featured in profile.json, then
    // append auto-discovered repos the curated list does not already name.
    const curatedNames = new Set(
      (existing.projects || []).map((p) => p.name)
    );
    const merged = [
      ...(existing.projects || []),
      ...auto.filter((p) => !curatedNames.has(p.name)),
    ].slice(0, 12);

    fresh.projects = merged;
    console.log(`  repos: ${ranked.length} active -> ${merged.length} listed`);
  }

  // ---- LinkedIn (optional) -------------------------------------------------
  // LinkedIn profiles cannot be scraped anonymously. To auto-sync work history,
  // export your data as JSON and expose it at a raw URL via LINKEDIN_JSON_URL.
  if (LINKEDIN_JSON_URL) {
    try {
      const li = await getJSON(LINKEDIN_JSON_URL, { headers: {} });
      if (li) {
        // Shape depends on the export; map conservatively and never delete.
        if (Array.isArray(li.experience) && li.experience.length) {
          fresh.experience = li.experience.map((e) => ({
            company: e.companyName ?? e.company ?? existing.company,
            title: e.title ?? e.position ?? existing.role,
            start: e.startDate ?? "",
            end: e.endDate ?? null,
            current: !e.endDate,
            summary: e.description ?? "",
            highlights: Array.isArray(e.bullets) ? e.bullets : [],
          }));
          console.log(`  linkedin: ${fresh.experience.length} roles`);
        }
      }
    } catch (err) {
      console.warn(`⚠  LinkedIn sync skipped: ${err.message}`);
    }
  } else {
    console.log("  linkedin: skipped (set LINKEDIN_JSON_URL to enable)");
  }

  const next = mergeProfile(existing, fresh);
  const before = JSON.stringify(existing, null, 2);
  const after = JSON.stringify(next, null, 2);

  if (before === after) {
    console.log("✓ No changes — profile is already up to date.");
    return;
  }

  if (DRY_RUN) {
    console.log("✓ Changes detected (dry run — nothing written):");
    console.log(after);
    return;
  }

  writeFileSync(PROFILE_PATH, after + "\n", "utf8");
  console.log(`✓ Wrote ${PROFILE_PATH}`);
}

main().catch((err) => {
  console.error("✖ sync failed:", err.message);
  process.exit(1);
});
