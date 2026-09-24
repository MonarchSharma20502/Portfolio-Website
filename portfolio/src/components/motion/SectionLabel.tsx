"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * Section heading with a scroll-linked underline.
 *
 * As the heading scrolls into view, an accent rule draws itself across from
 * left to right, tracking the scroll position rather than just firing once —
 * so scrubbing back up reverses it. This is the "scroll choreography" pattern
 * from 21st.dev's componentry, applied to a section label.
 *
 * The heading text itself is always rendered; only the rule is animated, so
 * nothing here can hide content.
 */
export default function SectionLabel({
  index,
  title,
  className = "",
}: {
  index: string;
  title: string;
  className?: string;
}) {
  const reduce = useMountedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "start 55%"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          {index}
        </span>
        <span className="relative h-px flex-1 overflow-hidden bg-slate-200 dark:bg-slate-800">
          <motion.span
            aria-hidden="true"
            style={reduce ? { scaleX: 1 } : { scaleX }}
            className="absolute inset-0 origin-left bg-gradient-to-r from-accent to-indigo-400"
          />
        </span>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
