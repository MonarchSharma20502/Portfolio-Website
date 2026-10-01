"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { EASE, useMountedReducedMotion } from "@/lib/motion";

/**
 * SectionReveal — the page-level scroll choreography.
 *
 * Each section settles in as one composed movement: a quiet rise from
 * opacity 0 that is tied directly to the section's position in the
 * viewport. Because the entrance is driven by useScroll progress rather
 * than a one-shot trigger, it tracks the user's scroll speed and
 * direction — scroll back up and the section recedes again. That
 * continuous, scroll-following motion is what makes the page read as
 * scenes arriving one by one, rather than one long document.
 *
 * Deliberately there is no masking panel or clip-path here. A covering
 * slab reads as a hard edit between shots; this is meant to read as
 * content smoothly coming into view, so it is opacity + transform only.
 *
 *   1. The section body rises into view (opacity + y), following scroll
 *      progress.
 *   2. A thin accent rail on the left edge fills as the section scrolls
 *      through the viewport — scrub back up and it empties again.
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Measure from "section enters at the bottom" to "section leaves at the
    // top" so the rail tracks the section's whole journey through view.
    offset: ["start end", "end start"],
  });

  // The entrance. Held at opacity 0 / y 40 while the section is below the
  // fold, resolving to settled over the first part of its entry. The small
  // dead zone at the start keeps the section from beginning to rise while
  // it is still entirely off-screen.
  const bodyOpacity = useTransform(scrollYProgress, [0.02, 0.22], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.02, 0.22], [40, 0]);

  const railScale = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);
  const railOpacity = useTransform(scrollYProgress, [0, 0.06, 0.9, 1], [0, 1, 1, 0.35]);

  // Safety net: scroll-linked values are driven by useScroll, which only
  // updates on scroll/resize. If this component mounts while the section is
  // already in view (deep link, refresh mid-page) the values would stay at
  // their initial 0 until the first scroll. Forcing an early update makes
  // such a section visible immediately.
  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top < window.innerHeight * 0.9) {
      scrollYProgress.set(Math.min(0.3, scrollYProgress.get() + 0.3));
    }
  }, [reduce, scrollYProgress]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
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
        ref={bodyRef}
        style={{ opacity: bodyOpacity, y: bodyY }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
