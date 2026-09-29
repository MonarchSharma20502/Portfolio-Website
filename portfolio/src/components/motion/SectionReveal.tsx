"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE, useMountedReducedMotion } from "@/lib/motion";

/**
 * SectionReveal — the page-level scroll choreography.
 *
 * Each section of the page is wrapped in this, so the whole block arrives
 * as one composed movement rather than a pile of independent fades:
 *
 *   1. A thin accent rail on the left edge fills as the section scrolls
 *      through the viewport — scrub back up and it empties again.
 *   2. The section body settles in from a slight lift with a blur-to-sharp
 *      pass, so it reads as coming into focus rather than sliding.
 *
 * The rail is scroll-linked (useScroll + useTransform), the body is
 * triggered once. Both are transform/opacity only, so nothing here can
 * shift layout or cause a scrollbar.
 *
 * Reduced motion: the rail renders full and the body is static — content
 * is never gated behind animation.
 */
export default function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useMountedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Measure from "section enters at the bottom" to "section leaves at the
    // top" so the rail tracks the section's whole journey through view.
    offset: ["start end", "end start"],
  });
  const railScale = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.06, 0.9, 1], [0, 1, 1, 0.35]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {/* Scroll-progress rail on the section's left edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px overflow-hidden bg-slate-200/70 sm:block dark:bg-slate-800/70"
      >
        <motion.span
          style={{ scaleY: railScale, opacity: railOpacity }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent to-indigo-400"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
