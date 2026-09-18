import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Contact() {
  const channels = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: "✉️",
    },
    {
      label: "GitHub",
      value: `@${profile.github.username}`,
      href: profile.github.url,
      icon: "🐙",
    },
    {
      label: "LinkedIn",
      value: "Monarch Sharma",
      href: profile.linkedin.url,
      icon: "💼",
    },
  ] as const;

  return (
    <section id="contact" className="section">
      <Reveal>
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 sm:p-12">
          <p className="section-title">06 / Contact</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Let&rsquo;s connect
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-slate-600 dark:text-slate-300">
            Whether it is about cloud infrastructure, automation, Kubernetes or
            a role — my inbox is always open.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="card group hover:border-accent"
              >
                <span className="text-2xl" aria-hidden="true">
                  {channel.icon}
                </span>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  {channel.label}
                </p>
                <p className="mt-1 break-words text-sm font-medium transition group-hover:text-accent">
                  {channel.value}
                </p>
              </a>
              ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              Say hello
            </a>
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
