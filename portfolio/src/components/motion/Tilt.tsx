"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * Pointer-tracking 3D tilt. Transform-only, so it stays cheap.
 * Disabled for touch devices and reduced-motion users via the parent
 * (pointer: fine check happens on hover only).
 */
export default function Tilt({
  children,
  className = "",
  max = 8,
  scale = 1.02,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 150,
    damping: 15,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 150,
    damping: 15,
  });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    // Feed the cursor position to the .sheen gradient (inherited by children).
    el.style.setProperty("--sheen-x", `${x * 100}%`);
    el.style.setProperty("--sheen-y", `${y * 100}%`);
  };

  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
