"use client";

import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * GPU particle field — the "cloud" of the portfolio.
 *
 * Points are placed in a spherical shell, given a per-point scale and a
 * gentle sinusoidal drift in the vertex shader. The fragment shader draws
 * each point as a soft radial dot whose alpha falls off with camera
 * distance, so the field reads as depth rather than as flat confetti.
 *
 * Everything happens on the GPU: no per-frame JS allocation, no layout
 * work. Transform/opacity only.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  attribute float aScale;
  attribute float aPhase;

  varying float vDepth;
  varying float vTwinkle;

  void main() {
    vec3 p = position;

    // Slow ambient drift — never synchronous across the field.
    p.x += sin(uTime * 0.22 + aPhase * 6.2831) * 0.22;
    p.y += cos(uTime * 0.18 + aPhase * 4.7123) * 0.22;
    p.z += sin(uTime * 0.15 + aPhase * 3.1415) * 0.22;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation: nearer points are bigger.
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mvPosition.z);

    vDepth = -mvPosition.z;
    vTwinkle = 0.6 + 0.4 * sin(uTime * 1.1 + aPhase * 12.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorNear;
  uniform vec3 uColorFar;

  varying float vDepth;
  varying float vTwinkle;

  void main() {
    // Round, soft point: distance from the point's own centre.
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;

    float soft = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.28, 0.0, d);

    // Fade the far half of the field so it becomes atmosphere, not noise.
    float depthFade = smoothstep(11.0, 3.5, vDepth);

    vec3 color = mix(uColorFar, uColorNear, depthFade);
    float alpha = (soft * 0.55 + core * 0.45) * depthFade * vTwinkle;

    gl_FragColor = vec4(color, alpha);
  }
`;

const ParticleFieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uSize: 26,
    uPixelRatio: 1,
    uColorNear: new THREE.Color("#7dd3fc"),
    uColorFar: new THREE.Color("#38bdf8"),
  },
  vertexShader,
  fragmentShader
);

export type ParticleFieldProps = {
  count?: number;
  radius?: number;
  size?: number;
  colorNear?: string;
  colorFar?: string;
};

export default function ParticleField({
  count = 1100,
  radius = 7.5,
  size = 26,
  colorNear = "#7dd3fc",
  colorFar = "#38bdf8",
}: ParticleFieldProps) {
  const material = useMemo(() => {
    const m = new ParticleFieldMaterial();
    m.uniforms.uSize.value = size;
    (m.uniforms.uColorNear.value as THREE.Color).set(colorNear);
    (m.uniforms.uColorFar.value as THREE.Color).set(colorFar);
    m.transparent = true;
    m.depthWrite = false;
    m.blending = THREE.AdditiveBlending;
    return m;
  }, [size, colorNear, colorFar]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Even distribution over a sphere (Marsaglia's method).
      let u = 0;
      let v = 0;
      let s = 0;
      do {
        u = Math.random() * 2 - 1;
        v = Math.random() * 2 - 1;
        s = u * u + v * v;
      } while (s >= 1);

      const r = radius * (0.45 + Math.random() * 0.55);
      const f = 2 * Math.sqrt(1 - s);
      positions[i * 3 + 0] = u * f * r;
      positions[i * 3 + 1] = v * f * r;
      positions[i * 3 + 2] = 0.5 * (1 - 2 * s) * r;

      scales[i] = 0.35 + Math.random() * 1.0;
      phases[i] = Math.random();
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count, radius]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = Math.min(
      state.gl.getPixelRatio(),
      1.5
    );
    if (ref.current) {
      // The whole field turns very slowly — a planet, not a screensaver.
      ref.current.rotation.y += 0.0006;
    }
  });

  return (
    <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
  );
}
