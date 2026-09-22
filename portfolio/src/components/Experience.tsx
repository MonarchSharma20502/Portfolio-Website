"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { profile } from "@/lib/profile";
import { fadeUp, none, staggerContainer, viewportOnce } from "@/lib/motion";
import Reveal from "./Reveal";
import SectionLabel from "./motion/SectionLabel";

export default function Experience() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && reduceMotion;
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (profile.experience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="section">
      <SectionLabel
        index="03 / Experience"
        title="Where I have worked"
        className="mb-10"
      />

      <div ref={trackRef} className="relative mt-10">
        {/* Track base */}
        <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-200 dark:bg-slate-800" />
        {/* Accent line that draws itself in as the timeline scrolls into view */}
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-0 top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-accent to-indigo-400"
        />

        <motion.div
          data-reveal
          variants={reduce ? none : staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-8"
        >
          {profile.experience.map((job) => (
            <motion.div
              key={`${job.company}-${job.title}`}
              data-reveal
              variants={reduce ? none : fadeUp}
              className="relative pl-6"
            >
              <motion.span
                variants={
                  reduce
                    ? none
                    : {
                        hidden: { scale: 0, opacity: 0 },
                        visible: {
                          scale: 1,
                          opacity: 1,
                          transition: { type: "spring", stiffness: 300, damping: 18 },
                        },
                      }
                }
                className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent ring-4 ring-white dark:ring-slate-950"
              />

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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
