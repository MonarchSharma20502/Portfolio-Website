"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

/**
 * Scroll-driven camera rig.
 *
 * Instead of moving the camera in world space (which would fight the page
 * layout), the rig tilts and dollies the *scene group* so the object
 * appears to rotate and recede as the visitor scrolls. The motion is
 * smoothed with a critically-damped lerp so fast scrolls settle instead of
 * snapping.
 *
 * Reads `window.scrollY` directly rather than Framer's useScroll: the canvas
 * is fixed and full-viewport, so document scroll progress is exactly the
 * signal we want, and this avoids a React re-render per frame.
 *
 * Note: this module must not statically import `three` — it is rendered
 * inside the lazily-loaded WebGL subtree and a static import would pull
 * three.js back into the initial bundle. The group ref is typed loosely.
 */

export type ScrollSceneProps = {
  children: React.ReactNode;
  /** Multiplier applied to the scroll-driven rotation. */
  amplitude?: number;
  className?: string;
};

export default function ScrollScene({
  children,
  amplitude = 1,
}: ScrollSceneProps) {
  const group = useRef<any>(null);
  const { viewport } = useThree();
  const target = useRef({ rot: 0, tilt: 0, dolly: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const p = Math.min(window.scrollY / max, 1);
      // Full turns across the page: rotation, pitch, and a dolly-out.
      target.current.rot = p * Math.PI * 2 * amplitude;
      target.current.tilt = (p - 0.5) * 0.9 * amplitude;
      target.current.dolly = p * 2.6 * amplitude;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amplitude]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const t = target.current;
    // Critically-damped follow. Frame-rate independent.
    const k = 1 - Math.pow(0.0015, delta);
    g.rotation.y += (t.rot - g.rotation.y) * k;
    g.rotation.x += (t.tilt - g.rotation.x) * k;
    g.position.z += (t.dolly - g.position.z) * k;
  });

  // Scale the scene to the viewport so it behaves consistently across sizes.
  const s = 1 / Math.max(viewport.width / 12, 1);
  return (
    <group ref={group} scale={s}>
      {children}
    </group>
  );
}
