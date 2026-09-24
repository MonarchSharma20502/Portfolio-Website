"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * ParallaxLayer — scroll-driven depth for a section.
 *
 * Translates a decorative layer as the section scrolls through the viewport,
 * at a `speed` fraction of the scroll distance. Pair two layers with
 * opposite speeds to create the parallax gap that reads as depth.
 *
 * Transform only — no layout properties are animated.
 */

export default function ParallaxLayer({
  children,
  className = "",
  speed = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  /** Fraction of the scroll distance to travel. Negative reverses. */
  speed?: number;
}) {
  const reduceMotion = useMountedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -160 * speed]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
