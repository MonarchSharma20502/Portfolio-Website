import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Projects() {
  const featured = profile.projects.filter((p) => p.featured);
  const rest = profile.projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="section">
      <Reveal>
        <p className="section-title">04 / Projects</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Things I have built
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Infrastructure automation, Kubernetes deployments and CI/CD
          experiments. This list is generated from my public GitHub
          repositories.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <Reveal key={project.name} className="card group flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold transition group-hover:text-accent">
                {project.name}
              </h3>
              <GitHubLink repo={project.repo} />
            </div>

            <p className="mt-3 flex-1 leading-relaxed text-slate-600 dark:text-slate-300">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <Reveal>
            <h3 className="mt-16 font-mono text-sm font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              More experiments
            </h3>
          </Reveal>

          <Reveal>
            <ul className="mt-6 divide-y divide-slate-200 dark:divide-slate-800">
              {rest.map((project) => (
                <li
                  key={project.name}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3"
                >
                  <div className="min-w-0">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium transition hover:text-accent"
                    >
                      {project.name}
                    </a>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-wrap justify-end gap-2">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </>
      )}
    </section>
  );
}

function GitHubLink({ repo }: { repo: string }) {
  return (
    <a
      href={repo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View repository on GitHub"
      className="text-slate-400 transition hover:text-accent"
    >
      <svg
        role="img"
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.1 4.7 18.1 5 18.1 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
      </svg>
    </a>
  );
}
