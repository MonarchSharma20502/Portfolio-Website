"use client";

import { useEffect, useState } from "react";
import { useMountedReducedMotion } from "@/lib/motion";

/**
 * Client + reduced-motion boundary for the WebGL canvas.
 *
 * The R3F <Canvas> is imported dynamically after mount. This module is
 * rendered from the lazily-loaded scene components, but keeping the canvas
 * import dynamic as well guarantees no three.js code can leak into the
 * initial bundle through this path.
 *
 * Reduced-motion users get nothing rendered at all — the cheapest animation
 * is the one you never run, and the 2D CSS layers still provide background
 * motion for them.
 *
 * A `key` is derived from the reduced-motion state so the canvas is fully
 * unmounted (not just re-rendered) if the preference changes mid-session.
 */

export type LazyCanvasProps = {
  className?: string;
  cameraPosition?: [number, number, number];
  children?: React.ReactNode;
};

export default function LazyCanvas({
  className,
  cameraPosition = [0, 0, 6],
  children,
}: LazyCanvasProps) {
  const reduceMotion = useMountedReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [Canvas, setCanvas] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setMounted(true);
    import("./Canvas").then((mod) => setCanvas(() => mod.default));
  }, []);

  if (!mounted || reduceMotion || !Canvas) return null;

  return (
    <div className={className} aria-hidden="true">
      <Canvas key={reduceMotion ? "reduced" : "full"} cameraPosition={cameraPosition}>
        {children}
      </Canvas>
    </div>
  );
}
