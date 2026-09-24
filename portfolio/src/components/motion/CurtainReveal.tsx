"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * CurtainReveal — a cinematic section transition.
 *
 * Two panels sweep apart in 3D space, revealing the section behind them.
 * The panels carry a subtle gradient and are lit at the seam so the split
 * reads as light, not as two flat colours sliding.
 *
 * The panels are absolutely positioned inside the section and scaled from
 * the seam, so there is no layout shift and no overflow.
 *
 * Reduced motion: the panels are not rendered at all.
 */

export default function CurtainReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useMountedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const panel = "absolute inset-0 z-20 origin-center bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900";

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex"
        aria-hidden="true"
        initial="visible"
        whileInView="hidden"
        viewport={{ once: true, margin: "-25% 0px" }}
        variants={{ hidden: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.div
          className={panel}
          variants={{
            visible: { scaleX: 1 },
            hidden: { scaleX: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
          }}
          style={{ originX: 0 }}
        />
        <motion.div
          className={panel}
          variants={{
            visible: { scaleX: 1 },
            hidden: { scaleX: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
          }}
          style={{ originX: 1 }}
        />
      </motion.div>
      {children}
    </div>
  );
}

