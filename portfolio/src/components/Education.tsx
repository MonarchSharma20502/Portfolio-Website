import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

/**
 * Education and certifications. Renders nothing if both lists are empty, so
 * the section never shows an empty shell while the data is still being filled.
 */
export default function Education() {
  const hasEducation = profile.education.length > 0;
  const hasCerts = profile.certifications.length > 0;

  if (!hasEducation && !hasCerts) {
    return null;
  }

  return (
    <section id="education" className="section">
      <Reveal>
        <p className="section-title">05 / Education &amp; Certifications</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Education &amp; certifications
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        {hasEducation && (
          <Reveal className="space-y-6">
            {profile.education.map((edu, i) => (
              <div key={`${edu.institution}-${i}`} className="card group">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-accent">{edu.institution}</h3>
                {edu.location && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span aria-hidden="true">📍</span>
                    {edu.location}
                  </p>
                )}
                {edu.degree && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {edu.degree}
                  </p>
                )}
                <p className="mt-3 font-mono text-xs text-accent">
                  {edu.start} — {edu.end ?? "Present"}
                </p>
              </div>
            ))}
          </Reveal>
        )}

        {hasCerts && (
          <Reveal>
            <div className="card">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Certifications
              </h3>
              <ul className="mt-4 space-y-3">
                {profile.certifications.map((cert, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <span className="mt-0.5 text-accent" aria-hidden="true">
                      ✓
                    </span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
