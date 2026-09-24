"use client";

import { useEffect, useState } from "react";
import { useMountedReducedMotion } from "@/lib/motion";
import LazyCanvas from "./LazyCanvas";
import ScrollScene from "./ScrollScene";

/**
 * ScrollSceneCanvas — the persistent 3D layer behind the whole page.
 *
 * This is what makes the site feel three-dimensional as you scroll: a fixed
 * full-viewport canvas whose contents rotate, tilt and recede continuously
 * with scroll progress. Because it is fixed and behind the content, every
 * section passes over the same rotating field, which is what creates the
 * sense of a single camera move through one continuous 3D space.
 *
 * It is deliberately sparse — a low-density particle field only. Sections
 * supply their own foreground content; this layer supplies depth.
 *
 * <ParticleField> is imported dynamically inside the effect so that three.js
 * stays out of the initial bundle; this module itself must remain free of
 * static three imports.
 */

function isSmallScreen() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export default function ScrollSceneCanvas() {
  const reduceMotion = useMountedReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [Field, setField] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setMounted(true);
    // Load the GPU field only after mount, off the critical path.
    import("./ParticleField").then((mod) => setField(() => mod.default));
  }, []);

  if (!mounted || reduceMotion || !Field) return null;

  const small = isSmallScreen();

  return (
    <LazyCanvas
      className="pointer-events-none fixed inset-0 -z-[5]"
      cameraPosition={[0, 0, 7]}
    >
      <ScrollScene amplitude={small ? 0.4 : 0.85}>
        <Field
          count={small ? 260 : 620}
          radius={9}
          size={20}
          colorNear="#a5b4fc"
          colorFar="#38bdf8"
        />
      </ScrollScene>
    </LazyCanvas>
  );
}
