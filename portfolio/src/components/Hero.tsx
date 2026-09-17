import { profile } from "@/lib/profile";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-16 sm:px-8"
    >
      {/* Decorative animated background blobs */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-blob dark:bg-accent/10" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl animate-blob dark:bg-indigo-500/10 [animation-delay:3s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-blob dark:bg-emerald-500/10 [animation-delay:6s]" />
      </div>

      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 py-20 md:grid-cols-[1.4fr_1fr]">
        <div className="animate-fade-in-up">
          <p className="font-mono text-sm font-medium text-accent">
            {profile.role}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {profile.tagline}
          </p>

          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span aria-hidden="true">📍</span>
            {profile.location}
            {profile.hireable && (
              <span className="chip ml-2 border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Open to opportunities
              </span>
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary">
              Get in touch
            </a>
            <a
              href={profile.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              View GitHub →
            </a>
          </div>

          <div className="mt-8 flex items-center gap-5">
            <a
              href={profile.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-slate-500 transition hover:text-accent dark:text-slate-400"
            >
              <GitHubIcon />
            </a>
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-slate-500 transition hover:text-accent dark:text-slate-400"
            >
              <LinkedInIcon />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Send email"
              className="text-slate-500 transition hover:text-accent dark:text-slate-400"
            >
              <MailIcon />
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-accent via-indigo-400 to-emerald-400 opacity-70 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt={`Portrait of ${profile.name}`}
              width={224}
              height={224}
              className="relative h-48 w-48 rounded-full border-4 border-white object-cover shadow-xl dark:border-slate-900 sm:h-56 sm:w-56"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.1 4.7 18.1 5 18.1 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.8" width="19" height="14.4" rx="2" />
      <path d="m3 6.5 9 6.2 9-6.2" />
    </svg>
  );
}
