"use client";

import { Canvas } from "@react-three/fiber";

/**
 * Thin wrapper around R3F's <Canvas> so the heavy import lives behind
 * next/dynamic in LazyCanvas. Kept in its own module so dynamic() can
 * resolve it to a single chunk.
 */

export type CanvasProps = {
  cameraPosition?: [number, number, number];
  children?: React.ReactNode;
};

export default function CanvasWrapper({
  cameraPosition,
  children,
}: CanvasProps) {
  return (
    <Canvas
      // The scene is decorative; never let it steal pointer events from the
      // UI above it.
      style={{ pointerEvents: "none" }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        // Clear to transparent so the CSS background layers show through.
        preserveDrawingBuffer: false,
      }}
      dpr={[1, 1.5]}
      camera={{ position: cameraPosition, fov: 45, near: 0.1, far: 100 }}
    >
      {children}
    </Canvas>
  );
}
