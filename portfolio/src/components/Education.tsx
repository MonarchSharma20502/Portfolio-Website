import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

// The classic four-square Microsoft mark, inline so it stays crisp at any
// size and needs no extra asset. Shown next to Microsoft-issued certs only.
function MicrosoftLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={className} aria-hidden="true">
      <rect x="1" y="1" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="1" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="1" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}

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
    <section id="education" className="section relative">
      <Reveal>
        <p className="section-title">05 / Education &amp; Certifications</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Education &amp; certifications
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        {hasEducation && (
          <Reveal className="flex h-full flex-col justify-between gap-6">
            {profile.education.map((edu, i) => (
              <div key={`${edu.institution}-${i}`} className="card group flex-1">
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
          <Reveal className="h-full">
            <div className="card flex h-full flex-col">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                Certifications
              </h3>
              <ul className="mt-4 grid flex-1 content-evenly gap-x-4 gap-y-3 sm:grid-cols-2">
                {profile.certifications.map((cert, i) => {
                  const isMicrosoft = cert.startsWith("AZ-");
                  const spansFull = i === profile.certifications.length - 1;
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-3 rounded-xl border border-slate-300/70 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-200 ${
                        spansFull ? "sm:col-span-2" : ""
                      }`}
                    >
                      {isMicrosoft ? (
                        <MicrosoftLogo className="h-5 w-5 shrink-0" />
                      ) : (
                        <span
                          className="grid h-5 w-5 shrink-0 place-items-center text-accent"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}
                      <span>{cert}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
