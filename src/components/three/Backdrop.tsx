"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, CanvasTexture, Color, Group, Points } from "three";

function glowTexture(inner = "rgba(255,255,255,1)", outer = "rgba(255,255,255,0)") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function Starfield({ count }: { count: number }) {
  const ref = useRef<Points>(null);
  const sprite = useMemo(() => glowTexture(), []);
  const { pos, col } = useMemo(() => {
    const r = rng(7);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new Color("#ffffff"), new Color("#bcd4ff"), new Color("#ffe9c4"), new Color("#9db8ff")];
    for (let i = 0; i < count; i++) {
      // a deep shell around the whole journey
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const rad = 140 + r() * 260;
      pos[i * 3] = rad * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = rad * Math.cos(ph) * 0.7;
      pos[i * 3 + 2] = rad * Math.sin(ph) * Math.sin(th) - 60;
      const c = palette[Math.floor(r() * palette.length)];
      const b = 0.4 + r() * 0.6;
      col[i * 3] = c.r * b;
      col[i * 3 + 1] = c.g * b;
      col[i * 3 + 2] = c.b * b;
    }
    return { pos, col };
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.004;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={2.4} sizeAttenuation vertexColors map={sprite} alphaMap={sprite} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

/** Drifting motes near the flight path: they give the camera move its sense of speed. */
export function Dust({ count }: { count: number }) {
  const sprite = useMemo(() => glowTexture(), []);
  const pos = useMemo(() => {
    const r = rng(99);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (r() - 0.5) * 34;
      a[i * 3 + 1] = (r() - 0.5) * 16;
      a[i * 3 + 2] = 24 - r() * 110;
    }
    return a;
  }, [count]);
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} sizeAttenuation color="#aac4ff" map={sprite} alphaMap={sprite} transparent opacity={0.55} depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}

export function Nebula() {
  const group = useRef<Group>(null);
  const tex = useMemo(() => glowTexture(), []);
  const clouds = [
    { p: [-120, 40, -150], s: 260, c: "#2c4fd6", o: 0.16 },
    { p: [140, -30, -230], s: 320, c: "#6b3fd0", o: 0.12 },
    { p: [-40, -70, -60], s: 200, c: "#0f7a8f", o: 0.1 },
    { p: [90, 70, -20], s: 220, c: "#3a5bd8", o: 0.08 },
  ] as const;
  return (
    <group ref={group}>
      {clouds.map((n, i) => (
        <sprite key={i} position={[n.p[0], n.p[1], n.p[2]]} scale={[n.s, n.s, 1]}>
          <spriteMaterial map={tex} color={n.c} opacity={n.o} transparent depthWrite={false} blending={AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}
