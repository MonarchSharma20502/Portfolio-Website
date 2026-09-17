import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <p className="section-title">01 / About</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          A bit about me
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.5fr_1fr]">
        <Reveal className="space-y-4">
          {profile.about.map((paragraph, i) => (
            <p
              key={i}
              className="leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {paragraph}
            </p>
          ))}

          <blockquote className="border-l-4 border-accent pl-4 font-mono text-sm text-slate-700 dark:text-slate-200">
            “{profile.quote}”
          </blockquote>
        </Reveal>

        <Reveal className="space-y-4">
          <div className="card">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Focus areas
            </h3>
            <ul className="mt-3 space-y-2">
              {profile.focus.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <span className="text-accent" aria-hidden="true">
                    ▸
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Currently exploring
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.currentlyLearning.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Learning philosophy
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {profile.philosophy}
            </p>
            <p className="mt-3 font-mono text-sm text-accent">{profile.mindset}</p>
          </div>
        </Reveal>
        {/* end about sidebar */}
      </div>
    </section>
  );
}
