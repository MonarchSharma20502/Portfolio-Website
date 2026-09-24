"use client";

import { useMountedReducedMotion } from "@/lib/motion";

/**
 * Shimmering gradient text. A soft band of light sweeps across the letters
 * on a loop — the "shimmer text" pattern popularised by HextaUI / Spell.
 *
 * Pure CSS background-position animation, so it costs nothing on the main
 * thread. The sweep is disabled for reduced-motion users; the gradient fill
 * stays, so the heading keeps its look.
 *
 * Use sparingly: one heading per viewport.
 */
export default function ShimmerText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useMountedReducedMotion();

  return (
    <span
      className={`relative inline-block bg-gradient-to-r from-accent via-indigo-500 to-accent bg-clip-text text-transparent ${className}`}
      style={{
        // Animate the gradient across the text. The keyframes live in
        // globals.css so they can be disabled from the reduced-motion query.
        animation: reduce ? "none" : "shimmer-sweep 6s ease-in-out infinite",
        backgroundSize: "220% 100%",
      }}
    >
      {children}
    </span>
  );
}
