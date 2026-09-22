"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated infrastructure "topology" — a fixed SVG mesh of nodes and links
 * drawn as <path> elements, with a pulse travelling the links and the whole
 * mesh drifting slowly as the page scrolls.
 *
 * Inspired by the animated SVG "background paths" pattern (21st.dev /
 * Kokonut UI) but re-cast as a live network diagram, which fits a
 * Cloud / DevOps portfolio: it reads as services, clusters and pipelines
 * rather than decoration.
 *
 * Cheap by design: a handful of paths, transform/opacity only, and the
 * travelling pulse is pure stroke-dashoffset animation.
 */
export default function TopologyBackground() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Slow parallax drift + subtle counter-rotation on scroll.
  const y = useTransform(scrollY, [0, 4000], [0, -160]);
  const rotate = useTransform(scrollY, [0, 4000], [0, 6]);

  useEffect(() => setMounted(true), []);

  // Node positions on a 1000x600 viewBox. Hand-placed so the mesh looks
  // engineered rather than random, with a clear hub on the left.
  const nodes = [
    { x: 150, y: 150, r: 5 },
    { x: 380, y: 96, r: 3.5 },
    { x: 620, y: 150, r: 5 },
    { x: 850, y: 96, r: 3.5 },
    { x: 265, y: 320, r: 4 },
    { x: 500, y: 300, r: 6 },
    { x: 735, y: 320, r: 4 },
    { x: 150, y: 480, r: 3.5 },
    { x: 400, y: 500, r: 4 },
    { x: 650, y: 470, r: 3.5 },
    { x: 870, y: 500, r: 4 },
  ];

  const links: { d: string; delay: number }[] = [
    { d: "M150 150 C 260 110, 290 96, 380 96", delay: 0 },
    { d: "M380 96 C 490 110, 520 130, 620 150", delay: 0.6 },
    { d: "M620 150 C 730 110, 760 96, 850 96", delay: 1.2 },
    { d: "M150 150 C 200 230, 220 270, 265 320", delay: 0.3 },
    { d: "M265 320 C 370 300, 430 300, 500 300", delay: 0.9 },
    { d: "M500 300 C 600 300, 660 310, 735 320", delay: 1.5 },
    { d: "M265 320 C 200 400, 180 440, 150 480", delay: 0.4 },
    { d: "M500 300 C 470 400, 440 450, 400 500", delay: 1.0 },
    { d: "M735 320 C 690 400, 680 440, 650 470", delay: 1.6 },
    { d: "M400 500 C 520 490, 580 480, 650 470", delay: 0.5 },
    { d: "M650 470 C 760 480, 810 490, 870 500", delay: 1.1 },
    { d: "M620 150 C 660 220, 700 260, 735 320", delay: 0.7 },
    { d: "M380 96 C 420 200, 460 260, 500 300", delay: 1.3 },
  ];

  return (
    <motion.div
      aria-hidden="true"
      style={{ y, rotate }}
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.55] dark:opacity-[0.4]"
      >
        <defs>
          <linearGradient id="topo-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.05" />
            <stop offset="45%" stopColor="rgb(56 189 248)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(129 140 248)" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="topo-node">
            <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base mesh: faint static links so the topology is always legible */}
        <g
          fill="none"
          stroke="currentColor"
          className="text-slate-300 dark:text-slate-700"
          strokeWidth="1"
          opacity="0.35"
        >
          {links.map((l, i) => (
            <path key={`base-${i}`} d={l.d} />
          ))}
        </g>

        {/* Animated layer: a pulse of light travelling each link */}
        {mounted && !reduceMotion && (
          <g fill="none" stroke="url(#topo-line)" strokeWidth="1.6">
            {links.map((l, i) => (
              <motion.path
                key={`pulse-${i}`}
                d={l.d}
                strokeDasharray="14 260"
                initial={{ strokeDashoffset: 274 }}
                animate={{ strokeDashoffset: [274, 0] }}
                transition={{
                  duration: 4.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: l.delay,
                  repeatDelay: 2.6,
                }}
              />
            ))}
          </g>
        )}

        {/* Nodes: a soft halo plus a crisp core */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.x} cy={n.y} r={n.r * 3.2} fill="url(#topo-node)" />
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              className="fill-sky-400/70 dark:fill-sky-300/60"
            />
            {mounted && !reduceMotion && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                className="fill-sky-400/0"
                stroke="rgb(56 189 248)"
                strokeOpacity="0.5"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: [1, 3.4], opacity: [0.6, 0] }}
                transition={{
                  duration: 3,
                  ease: "easeOut",
                  repeat: Infinity,
                  delay: (i % 5) * 0.7,
                  repeatDelay: 4,
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            )}
          </g>
        ))}
      </svg>
    </motion.div>
  );
}
