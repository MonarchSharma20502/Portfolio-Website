"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, useMountedReducedMotion } from "@/lib/motion";

// Cache motion(Tag) at module scope — recreating it inside render remounts
// the subtree and restarts animations on every parent update.
const motionCache = new Map<string, React.ElementType>();
function getMotionTag(Tag: React.ElementType): React.ElementType {
  const key =
    typeof Tag === "string" ? Tag : (Tag as { displayName?: string })?.displayName ?? "custom";
  if (!motionCache.has(key)) motionCache.set(key, motion(Tag as React.ElementType));
  return motionCache.get(key) as React.ElementType;
}

/**
 * Reveals children with a fade-in-up once they scroll into view.
 *
 * Keeps the original IntersectionObserver behaviour (so content is visible
 * even if motion fails) and layers a Framer Motion entrance on top for
 * spring-based easing and optional stagger via `delay`.
 *
 * Respects prefers-reduced-motion via the MotionConfig in the layout.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  y = 18,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [supported, setSupported] = useState(false);
  // useReducedMotion() is false during SSR, which would bake opacity:0 into
  // the server HTML. useMountedReducedMotion() pins it to false until mount
  // so the server and first client render agree.
  const reduce = useMountedReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;
    setSupported(true);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    // Safety net: anything already scrolled past (or above the viewport) must
    // never stay hidden. Framer's whileInView may not fire for it.
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top < window.innerHeight * 0.88) {
      el.classList.add("is-visible");
    }

    return () => observer.disconnect();
  }, [once]);

  // Blur-to-sharp rise: a touch of defocus while the element settles, so
  // entrances read as coming into focus rather than simply sliding. Filter
  // is composited, so it never triggers layout.
  const variants: Variants =
    reduce
      ? { hidden: {}, visible: {} }
      : {
          hidden: { opacity: 0, y, filter: "blur(6px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.7, ease: EASE, delay },
          },
        };

  const MotionTag = getMotionTag(Tag);

  return (
    <MotionTag
      ref={ref}
      // Keep the original class so the CSS fallback still applies.
      className={`reveal ${supported ? "" : "is-visible"} ${className}`}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-12% 0px" }}
    >
      {children}
    </MotionTag>
  );
}
