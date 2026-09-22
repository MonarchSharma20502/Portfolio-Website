"use client";

import { motion } from "framer-motion";

/**
 * Infinite horizontal marquee strip. Used as a kinetic divider between
 * sections so the page keeps moving while you scroll.
 *
 * `dup` renders the content twice; the negative translateX loop makes it
 * seamless. Pure transform animation.
 */
export default function Marquee({
  items,
  className = "",
  duration = 26,
  reverse = false,
}: {
  items: string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  const content = (
    <motion.div
      className="flex shrink-0 items-center gap-10 pr-10"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="font-mono text-sm uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
            {item}
          </span>
          <span aria-hidden="true" className="text-accent">
            ✦
          </span>
        </span>
      ))}
    </motion.div>
  );

  return (
    <div
      aria-hidden="true"
      className={`group relative flex overflow-hidden border-y border-slate-200/70 py-4 dark:border-slate-800/70 ${className}`}
    >
      {content}
      {/* Edge fades so the strip never shows a hard seam */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-slate-950" />
    </div>
  );
}
