import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <p className="section-title">02 / Skills</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Technologies I work with
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Grouped by domain. This list reflects the tooling used across my
          repositories and the areas I focus on day to day.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {profile.skills.map((group) => (
          <Reveal key={group.category} className="card">
            <h3 className="font-mono text-sm font-semibold text-accent">
              {group.category}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
