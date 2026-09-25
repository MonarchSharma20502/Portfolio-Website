import { profile } from "@/lib/profile";
import Reveal from "./Reveal";
import SectionLabel from "./motion/SectionLabel";
import DepthCard from "./motion/DepthCard";
import SpotlightBorder from "./motion/SpotlightBorder";

export default function Skills() {
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
        {profile.skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.06}>
            <SpotlightBorder className="h-full rounded-2xl">
              <DepthCard
                className="h-full rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-colors duration-300 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                max={5}
              >
                <div className="depth-content relative">
                  <h3 className="font-mono text-sm font-semibold text-accent">
                    {group.category}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-full bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700"
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </DepthCard>
            </SpotlightBorder>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
