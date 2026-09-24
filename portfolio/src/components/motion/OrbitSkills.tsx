"use client";

import { useEffect, useRef, useState } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * OrbitSkills — a slowly rotating 3D ring of technology names.
 *
 * Skills are placed on a ring that rotates around the X axis. The ring is
 * real 3D: each chip is positioned with rotateX/translateZ inside a
 * preserve-3d container, so chips at the back are genuinely behind the
 * front ones and foreshorten as they travel around.
 *
 * The rotation is a single CSS keyframe on the container, so it costs
 * nothing per frame. Reduced motion disables it and the chips fall back to
 * a flat, fully readable grid.
 */

export default function OrbitSkills({
  items,
  className = "",
  radius = 140,
}: {
  items: string[];
  className?: string;
  radius?: number;
}) {
  const reduceMotion = useMountedReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted || reduceMotion) {
    return (
      <div className={className}>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="chip">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const step = 360 / items.length;

  return (
    <div className={className} style={{ perspective: "900px" }}>
      <div
        ref={ringRef}
        className="orbit-ring relative mx-auto h-72 w-72"
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => {
          const angle = i * step;
          return (
            <div
              key={item}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotateX(${angle}deg) translateZ(${radius}px) translateY(-50%)`,
                transformStyle: "preserve-3d",
              }}
            >
              <span className="chip whitespace-nowrap bg-white/80 shadow-sm backdrop-blur dark:bg-slate-900/80">
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
