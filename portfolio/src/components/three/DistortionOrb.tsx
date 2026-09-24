"use client";

import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Distortion orb — the hero centerpiece.
 *
 * An icosahedron is displaced in the vertex shader by a sum of sines whose
 * phases advance over time, so the surface breathes. The fragment shader
 * uses a fresnel term so the silhouette glows and the body stays dark —
 * the object reads as energy rather than as plastic.
 *
 * Distortion is driven by a uniform so the parent can amplify it on
 * pointer hover without recompiling the shader.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDistortion;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDistort;

  // 3D simplex noise (Ashima Arts, MIT). Kept inline so the component is
  // self-contained and tree-shakeable.
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // Two octaves of noise at different frequencies and speeds.
    float n1 = snoise(position * 1.1 + vec3(uTime * 0.22));
    float n2 = snoise(position * 2.6 - vec3(uTime * 0.15));
    float distort = (n1 * 0.7 + n2 * 0.3) * uDistortion;

    vec3 displaced = position + normal * distort;

    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    vDistort = distort;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGlow;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDistort;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
    fresnel = pow(fresnel, 2.2);

    // Body stays deep, edges glow.
    vec3 color = mix(uColor * 0.55, uGlow, fresnel);

    // A slow gradient sweep across the surface so it is never flat.
    float band = sin(vDistort * 9.0 + uTime * 0.6) * 0.5 + 0.5;
    color += uGlow * band * 0.18;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const DistortionOrbMaterial = shaderMaterial(
  {
    uTime: 0,
    uDistortion: 0.34,
    uColor: new THREE.Color("#0e7490"),
    uGlow: new THREE.Color("#38bdf8"),
  },
  vertexShader,
  fragmentShader
);

export type DistortionOrbProps = {
  radius?: number;
  distortion?: number;
  color?: string;
  glow?: string;
  hoverBoost?: number;
};

export default function DistortionOrb({
  radius = 1.35,
  distortion = 0.34,
  color = "#0e7490",
  glow = "#38bdf8",
  hoverBoost = 0.22,
}: DistortionOrbProps) {
  const hoverRef = useRef(0);

  const material = useMemo(() => {
    const m = new DistortionOrbMaterial();
    m.uniforms.uDistortion.value = distortion;
    (m.uniforms.uColor.value as THREE.Color).set(color);
    (m.uniforms.uGlow.value as THREE.Color).set(glow);
    return m;
  }, [distortion, color, glow]);

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Spring the distortion toward the hover target.
    const target = distortion + hoverRef.current * hoverBoost;
    material.uniforms.uDistortion.value +=
      (target - material.uniforms.uDistortion.value) * Math.min(delta * 4.0, 1.0);

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x += delta * 0.035;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => (hoverRef.current = 1)}
      onPointerOut={() => (hoverRef.current = 0)}
    >
      <icosahedronGeometry args={[radius, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
