import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Stats() {
  const items = [
    { label: "Public repositories", value: profile.stats.publicRepos },
    { label: "GitHub followers", value: profile.stats.followers },
    { label: "Following", value: profile.stats.following },
    {
      label: "Contributions in the last year",
      value: profile.stats.contributionsLastYear,
    },
  ] as const;

  return (
    <section id="stats" className="section py-12">
      <Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <li key={item.label} className="card text-center">
              <p className="font-mono text-3xl font-bold text-accent">
                {item.value}
              </p>
              <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
