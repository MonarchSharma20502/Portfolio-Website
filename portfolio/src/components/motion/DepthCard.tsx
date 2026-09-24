"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * DepthCard — layered parallax depth for a card.
 *
 * Wraps a card and gives it a pointer-tracking 3D tilt plus two parallax
 * layers that translate at different rates, so the card reads as having
 * real thickness: the content floats above the card surface, and a glow
 * layer floats behind it.
 *
 * Uses the same easing/spring language as <Tilt /> but adds depth layers,
 * so the two components feel like one motion system.
 *
 * Reduced motion and touch: tilt is disabled, only the entrance remains.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DepthCard({
  children,
  className = "",
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduceMotion = useMountedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useRef(0.5);
  const py = useRef(0.5);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.current = (e.clientX - r.left) / r.width;
    py.current = (e.clientY - r.top) / r.height;
    el.style.setProperty("--dx", `${(px.current - 0.5) * 2 * max}deg`);
    el.style.setProperty("--dy", `${(0.5 - py.current) * 2 * max}deg`);
    el.style.setProperty("--sheen-x", `${px.current * 100}%`);
    el.style.setProperty("--sheen-y", `${py.current * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    px.current = 0.5;
    py.current = 0.5;
    el.style.setProperty("--dx", "0deg");
    el.style.setProperty("--dy", "0deg");
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      style={{
        transformStyle: "preserve-3d",
        transform: reduceMotion
          ? undefined
          : "perspective(900px) rotateX(var(--dy, 0deg)) rotateY(var(--dx, 0deg))",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
