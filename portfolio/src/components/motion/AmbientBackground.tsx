"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Ambient background layer: a faint engineering "dot field" plus two aurora
 * blobs that drift as the page scrolls. Fixed, behind everything, cheap.
 *
 * A separate cursor-following light is provided by <CursorGlow />.
 */
export default function AmbientBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 3200], [0, -220]);
  const y2 = useTransform(scrollY, [0, 3200], [0, 170]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Dot field — static, very faint, reads as a topology grid */}
      {mounted && (
        <div
          className="absolute inset-0 opacity-70 dark:opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(100 116 139 / 0.22) 1px, transparent 1.4px)",
            backgroundSize: "30px 30px",
            // Fade the field toward the edges so it never competes with text.
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 85%)",
          }}
        />
      )}

      <motion.div
        style={{ y: y1 }}
        className="absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[120px] dark:bg-accent/[0.06]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-48 top-[38%] h-[30rem] w-[30rem] rounded-full bg-indigo-400/10 blur-[120px] dark:bg-indigo-500/[0.05]"
      />
    </div>
  );
}
