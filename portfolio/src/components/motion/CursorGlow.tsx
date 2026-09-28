"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A soft light that trails the cursor. Transform-only, so it stays cheap.
 * Disabled for touch devices and reduced-motion users.
 */
export default function CursorGlow() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 110, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 110, damping: 22, mass: 0.5 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    setEnabled(true);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[65] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <div
        className="-ml-[320px] -mt-[320px] h-[640px] w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(56 189 248 / 0.09), transparent 62%)",
        }}
      />
    </motion.div>
  );
}
