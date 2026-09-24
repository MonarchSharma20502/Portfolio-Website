import { profile } from "@/lib/profile";
import Reveal from "./Reveal";
import SectionLabel from "./motion/SectionLabel";
import OrbitSkills from "./motion/OrbitSkills";

export default function Skills() {
  const orbitItems = profile.skills.flatMap((g) => g.items).slice(0, 14);

  return (
    <section id="skills" className="section">
      <SectionLabel index="02 / Skills" title="Technologies I work with" />

      <Reveal>
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

      {/* Rotating 3D ring of the full toolset. Falls back to a flat grid
          under reduced-motion, so nothing is locked behind the animation. */}
      <Reveal className="mt-16">
        <h3 className="text-center font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          The full toolset, in orbit
        </h3>
        <OrbitSkills items={orbitItems} className="mt-8" />
      </Reveal>
    </section>
  );
}
