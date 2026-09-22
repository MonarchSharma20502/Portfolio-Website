"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * Scroll-velocity marquee.
 *
 * The strip always slides, but its speed and skew respond to how fast the
 * page is scrolling — scroll hard and it races and leans into the motion,
 * stop and it settles back to a calm drift. Reverses direction when you
 * scroll up. This is the "text scroll animation" pattern from reuno-ui /
 * 21st.dev, tuned to the site's motion language.
 *
 * All transform-based: translateX, skewX. No layout properties.
 */
export default function VelocityMarquee({
  items,
  className = "",
  baseDuration = 30,
}: {
  items: string[];
  className?: string;
  baseDuration?: number;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth the raw scroll velocity into something usable.
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const velocityFactor = useTransform(smoothVelocity, [-3000, 3000], [-4, 4], {
    clamp: false,
  });

  // Direction flips with scroll direction.
  const directionFactor = useRef(1);
  const x = useTransform(
    [baseX, velocityFactor],
    ([latestX, latestV]: number[]) => {
      if (latestV < 0) directionFactor.current = -1;
      else if (latestV > 0) directionFactor.current = 1;
      // Wrap within -50%..0% so the duplicated content is seamless.
      let value = latestX + directionFactor.current * latestV * 0.16;
      value = ((value % 50) + 50) % 50;
      return `${value - 50}%`;
    }
  );

  const skew = useTransform(smoothVelocity, [-3000, 3000], [3, -3], {
    clamp: true,
  });

  if (reduce) {
    // Reduced motion: static, legible, no movement.
    return (
      <div
        aria-hidden="true"
        className={`relative flex overflow-hidden border-y border-slate-200/70 py-4 dark:border-slate-800/70 ${className}`}
      >
        <div className="flex shrink-0 items-center gap-10 pr-10">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-mono text-sm uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
                {item}
              </span>
              <span aria-hidden="true" className="text-accent">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex overflow-hidden border-y border-slate-200/70 py-4 dark:border-slate-800/70 ${className}`}
    >
      <motion.div
        style={{ x, skewX: skew }}
        className="flex shrink-0 items-center gap-10 pr-10"
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono text-sm uppercase tracking-[0.25em] text-slate-400 dark:text-slate-600">
              {item}
            </span>
            <span aria-hidden="true" className="text-accent">
              ✦
            </span>
          </span>
        ))}
      </motion.div>
      {/* Edge fades so the strip never shows a hard seam */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-slate-950" />
    </div>
  );
}
