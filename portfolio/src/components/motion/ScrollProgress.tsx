"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin progress bar pinned to the top of the viewport showing how far the
 * visitor has scrolled. Sits above the navbar.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent via-indigo-400 to-emerald-400"
      style={{ scaleX }}
    />
  );
}
