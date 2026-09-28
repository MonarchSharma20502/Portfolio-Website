"use client";

import { useRef } from "react";
import { useMountedReducedMotion } from "@/lib/motion";
/**
 * Spotlight border — a ring of light that follows the cursor around the
 * card's edge, plus a soft inner glow. The "spotlight card" pattern
 * (21st.dev / Magic UI) re-cast with the site's accent colour.
 *
 * The trick: a radial gradient positioned by CSS variables (--spot-x/y),
 * clipped to a 1px border ring via a padding + mask technique, so only the
 * border glows while the card content stays untouched.
 *
 * Pointer-events are ignored and the effect is flat for reduced-motion.
 */
export default function SpotlightBorder({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useMountedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group/spot relative ${className}`}
    >
      {/* Border ring: the gradient shows only through the 1px padding. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] p-px opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: reduce
            ? undefined
            : `radial-gradient(340px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(56 189 248 / 0.75), transparent 65%)`,
          // Hide the gradient everywhere except the 1px ring.
          WebkitMask: [
            "linear-gradient(#000 0 0) content-box",
            "linear-gradient(#000 0 0)",
          ].join(", "),
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Soft inner glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: reduce
            ? undefined
            : `radial-gradient(300px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(56 189 248 / 0.10), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
