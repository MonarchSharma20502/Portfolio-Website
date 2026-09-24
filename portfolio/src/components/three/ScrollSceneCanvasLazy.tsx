"use client";

import { Suspense, lazy } from "react";

/**
 * Client boundary for the persistent WebGL layer.
 *
 * The lazy() call MUST live inside a Client Component. When lazy() is called
 * directly in a Server Component (layout.tsx), the Next.js App Router treats
 * the resulting lazy component as a flight client reference and emits every
 * chunk it could ever need - including the entire three.js bundle - as an
 * eager <script> in the initial HTML. Hoisting the call into this "use client"
 * module keeps the split intact: three.js is only fetched once the component
 * actually renders in the browser.
 */

const ScrollSceneCanvas = lazy(
  () => import("@/components/three/ScrollSceneCanvas")
);

export default function ScrollSceneCanvasLazy() {
  return (
    <Suspense fallback={null}>
      <ScrollSceneCanvas />
    </Suspense>
  );
}
