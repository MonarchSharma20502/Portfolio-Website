"use client";

import { useEffect, useState } from "react";
import { useMountedReducedMotion } from "@/lib/motion";
import LazyCanvas from "./LazyCanvas";
import ScrollScene from "./ScrollScene";

/**
 * HeroScene — the WebGL layer behind the hero.
 *
 * A distortion orb wrapped in a particle cloud, both inside a scroll-driven
 * rig so the whole arrangement turns and dollies as the visitor scrolls past
 * the hero. The canvas sits behind the hero content and the orb is placed
 * stage-right so it never sits under the headline.
 *
 * <DistortionOrb> and <ParticleField> are imported dynamically after mount so
 * that three.js stays out of the initial bundle; this module must remain free
 * of static three imports.
 */

function isSmallScreen() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export default function HeroScene() {
  const reduceMotion = useMountedReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [Orb, setOrb] = useState<React.ComponentType<any> | null>(null);
  const [Field, setField] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      import("./DistortionOrb").then((m) => m.default),
      import("./ParticleField").then((m) => m.default),
    ]).then(([orb, field]) => {
      setOrb(() => orb);
      setField(() => field);
    });
  }, []);

  if (!mounted || reduceMotion || !Orb || !Field) return null;

  const small = isSmallScreen();

  return (
    <LazyCanvas
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      cameraPosition={[0, 0, 6]}
    >
      <ScrollScene amplitude={small ? 0.5 : 1}>
        {/* Orb stage-right so it never sits under the headline. */}
        <group position={[2.6, 0.2, 0]}>
          <Orb radius={small ? 1.0 : 1.35} />
        </group>
        <Field count={small ? 450 : 1100} radius={7.5} size={26} />
      </ScrollScene>
    </LazyCanvas>
  );
}
