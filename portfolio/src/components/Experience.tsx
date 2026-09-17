import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Experience() {
  if (profile.experience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="section">
      <Reveal>
        <p className="section-title">03 / Experience</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Where I have worked
        </h2>
      </Reveal>

      <div className="mt-10 space-y-8">
        {profile.experience.map((job) => (
          <Reveal
            key={`${job.company}-${job.title}`}
            className="relative border-l-2 border-slate-200 pl-6 dark:border-slate-800"
          >
            <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent" />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {job.start} — {job.end ?? "Present"}
              </span>
            </div>

            <p className="mt-1 font-mono text-sm text-accent">{job.company}</p>

            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
              {job.summary}
            </p>

            {job.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {job.highlights.map((highlight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-1 text-accent" aria-hidden="true">
                      ▸
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
