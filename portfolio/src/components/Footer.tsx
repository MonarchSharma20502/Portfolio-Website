import { profile } from "@/lib/profile";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:px-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {year} {profile.name}. Built with Next.js &amp; Tailwind CSS.
        </p>

        <div className="flex items-center gap-5">
          <a
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 transition hover:text-accent dark:text-slate-400"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 transition hover:text-accent dark:text-slate-400"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-sm text-slate-500 transition hover:text-accent dark:text-slate-400"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
