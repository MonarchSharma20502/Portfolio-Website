"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * Magnetic wrapper: pulls its child toward the cursor while hovered, then
 * springs back on leave. Transform-only, so it stays cheap.
 *
 * Use it around links / buttons that should feel alive without changing
 * their markup or styling.
 *
 * Disabled for reduced-motion users (the pull is pure decoration).
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  /** 0 = no pull, 1 = follows the cursor exactly. */
  strength?: number;
}) {
  const reduce = useMountedReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Distance from the element's centre, scaled by `strength`.
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.span>
  );
}
