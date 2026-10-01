"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE, useMountedReducedMotion } from "@/lib/motion";

/** The two curtain surfaces. Opaque gradients that read as a physical
 *  blind rather than a flat colour, so the parting lands as a seam of
 *  light. `section-wipe` is the reduced-motion kill switch (globals.css). */
const PANEL =
  "section-wipe pointer-events-none absolute inset-0 z-20 " +
  "bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 " +
  "dark:from-slate-900 dark:via-slate-800 dark:to-slate-900";

/**
 * SectionReveal — the page-level scroll choreography.
 *
 * Each section arrives as its own scene:
 *
 *   1. A curtain of two panels parts vertically as the section enters the
 *      viewport and re-closes as it leaves. It is scroll-linked
 *      (useScroll + useTransform), so the seam tracks the user's scroll
 *      speed and direction — scrub back up and the curtain closes again.
 *      That continuous, scroll-following motion is what makes the page
 *      read as scenes arriving, rather than one long document.
 *   2. Behind it the body rises into focus — large enough to feel
 *      cinematic, but triggered once, so settled content never fidgets.
 *   3. A thin accent rail on the left edge fills over the section's whole
 *      journey through view.
 *
 * The panels are driven with clipPath rather than y, so they can never
 * paint outside the section's bounds — no overflow, no extra scrollbar,
 * no covering a neighbouring section. Everything else here is
 * transform/opacity/filter only, so nothing can shift layout.
 *
 * Reduced motion: no panels, no rail, static content — nothing is ever
 * gated behind animation.
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
  // The parting. The two panels are staggered slightly (0.38 vs 0.44) so
  // the seam widens asymmetrically and reads as light, not as two slabs.
  // inset() clips inward from one edge, so each panel retracts *inside*
  // the section bounds and can never overlap a neighbour.
  const topClip = useTransform(
    scrollYProgress,
    [0, 0.38],
    ["inset(0 0 0 0)", "inset(0 0 100% 0)"]
  );
  const bottomClip = useTransform(
    scrollYProgress,
    [0, 0.44],
    ["inset(0 0 0 0)", "inset(100% 0 0 0)"]
  );

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
    <div ref={ref} className={`relative ${className}`}>
      {/* Curtain: the top panel retracts upward, the bottom one downward. */}
      <motion.div aria-hidden="true" className={PANEL} style={{ clipPath: topClip }} />
      <motion.div aria-hidden="true" className={PANEL} style={{ clipPath: bottomClip }} />
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
        initial={{ opacity: 0, y: 46, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.0, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
