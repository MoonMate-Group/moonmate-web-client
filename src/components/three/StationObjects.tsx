"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending, BufferAttribute, ExtrudeGeometry, Group, InstancedMesh, Mesh, Object3D, Path, Shape, Vector3,
} from "three";
import { scrollState } from "@/lib/scroll";
import { rig } from "./CameraRig";
import { stations } from "./stations";

const glow = { toneMapped: false } as const;

/** Grow a station's geometry in as the camera approaches, and shrink it away as it leaves. */
function useNearby(ref: React.RefObject<Group | null>, index: number) {
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const t = Math.min(1, Math.max(0, 1 - (Math.abs(rig.coord - index) - 0.3) / 0.7));
    const e = t * t * (3 - 2 * t);
    g.visible = e > 0.002;
    g.scale.setScalar(e);
  });
}

/* ───────────────────────────── 01 · Financial decision network ───────────────────────────── */

export function FinanceNetwork({ reduced }: { reduced: boolean }) {
  const root = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const pulseGeo = useRef<BufferAttribute>(null);
  useNearby(root, 1);

  const { nodes, lineArr, edges } = useMemo(() => {
    const N = 150, R = 2.3, golden = Math.PI * (3 - Math.sqrt(5));
    const nodes: Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const rad = R * (0.9 + (((i * 37) % 10) / 10) * 0.2);
      nodes.push(new Vector3(Math.cos(i * golden) * r, y, Math.sin(i * golden) * r).multiplyScalar(rad));
    }
    const edges: [number, number][] = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (nodes[i].distanceTo(nodes[j]) < 1.05) edges.push([i, j]);
    const lineArr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => {
      nodes[a].toArray(lineArr, k * 6);
      nodes[b].toArray(lineArr, k * 6 + 3);
    });
    return { nodes, lineArr, edges };
  }, []);

  const nodeArr = useMemo(() => {
    const a = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => n.toArray(a, i * 3));
    return a;
  }, [nodes]);

  const PULSES = 42;
  const pulseArr = useMemo(() => new Float32Array(PULSES * 3), []);
  const pulseEdge = useMemo(() => Array.from({ length: PULSES }, (_, i) => (i * 7919) % edges.length), [edges.length]);

  useFrame((s, dt) => {
    if (!root.current?.visible) return;
    if (spin.current) spin.current.rotation.y += dt * (reduced ? 0.03 : 0.12) + scrollState.velocity * 0.0006;
    const t = s.clock.elapsedTime;
    for (let k = 0; k < PULSES; k++) {
      const [a, b] = edges[pulseEdge[k]];
      const f = (t * 0.45 + k * 0.173) % 1;
      pulseArr[k * 3] = nodes[a].x + (nodes[b].x - nodes[a].x) * f;
      pulseArr[k * 3 + 1] = nodes[a].y + (nodes[b].y - nodes[a].y) * f;
      pulseArr[k * 3 + 2] = nodes[a].z + (nodes[b].z - nodes[a].z) * f;
    }
    if (pulseGeo.current) pulseGeo.current.needsUpdate = true;
  });

  const o = stations[1].obj;
  return (
    <group ref={root} position={o}>
      <pointLight color="#6ea8ff" intensity={30} distance={14} decay={2} />
      <group ref={spin}>
        <points>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[nodeArr, 3]} /></bufferGeometry>
          <pointsMaterial color="#8fbaff" size={0.1} sizeAttenuation transparent blending={AdditiveBlending} depthWrite={false} {...glow} />
        </points>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[lineArr, 3]} /></bufferGeometry>
          <lineBasicMaterial color="#6ea8ff" transparent opacity={0.28} blending={AdditiveBlending} depthWrite={false} {...glow} />
        </lineSegments>
        <points frustumCulled={false}>
          <bufferGeometry><bufferAttribute ref={pulseGeo} attach="attributes-position" args={[pulseArr, 3]} /></bufferGeometry>
          <pointsMaterial color="#ffffff" size={0.16} sizeAttenuation transparent blending={AdditiveBlending} depthWrite={false} {...glow} />
        </points>
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshBasicMaterial color="#d9c9a3" wireframe transparent opacity={0.35} {...glow} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshBasicMaterial color="#cfe0ff" {...glow} />
        </mesh>
      </group>
      {[0.2, 1.2].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + r, 0, r]}>
          <torusGeometry args={[3.1 + i * 0.35, 0.012, 8, 160]} />
          <meshBasicMaterial color="#9ec2ff" transparent opacity={0.5} {...glow} />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────────── 02 · Defence sovereign core ───────────────────────────── */

export function DefenceCore({ reduced }: { reduced: boolean }) {
  const root = useRef<Group>(null);
  const rings = useRef<Mesh[]>([]);
  const core = useRef<Mesh>(null);
  const shell = useRef<Mesh>(null);
  const scan = useRef<Mesh>(null);
  useNearby(root, 2);

  useFrame((s, dt) => {
    if (!root.current?.visible) return;
    const t = s.clock.elapsedTime;
    const k = reduced ? 0.25 : 1;
    const v = scrollState.velocity * 0.0008;
    rings.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.x += dt * (0.25 + i * 0.12) * k + v;
      m.rotation.y += dt * (0.18 - i * 0.07) * k;
    });
    if (core.current) core.current.rotation.y += dt * 0.3 * k;
    if (shell.current) shell.current.rotation.y -= dt * 0.08 * k;
    if (scan.current) {
      const f = (t * 0.35) % 1;
      scan.current.position.y = -2.4 + f * 4.8;
      const sc = Math.sqrt(Math.max(1 - Math.pow(scan.current.position.y / 2.4, 2), 0.02)) * 2.4;
      scan.current.scale.set(sc, sc, 1);
      (scan.current.material as unknown as { opacity: number }).opacity = 0.5 * (1 - Math.abs(f - 0.5) * 1.6);
    }
  });

  const o = stations[2].obj;
  return (
    <group ref={root} position={o}>
      <pointLight color="#59e0c8" intensity={26} distance={14} decay={2} />
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.25, 1]} />
        <meshBasicMaterial color="#59e0c8" wireframe transparent opacity={0.38} {...glow} />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshStandardMaterial color="#2a3446" metalness={0.9} roughness={0.28} flatShading emissive="#0a3a34" emissiveIntensity={0.25} />
      </mesh>
      <mesh scale={0.45}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#b9fff0" {...glow} />
      </mesh>
      {[2.7, 3.05, 3.4].map((r, i) => (
        <mesh key={r} ref={(m) => { if (m) rings.current[i] = m; }} rotation={[i * 1.1, i * 0.6, 0]}>
          <torusGeometry args={[r, 0.02, 12, 180]} />
          <meshBasicMaterial color={i === 1 ? "#ffffff" : "#59e0c8"} {...glow} />
        </mesh>
      ))}
      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.96, 1, 128]} />
        <meshBasicMaterial color="#8ffbe8" transparent opacity={0.4} side={2} depthWrite={false} blending={AdditiveBlending} {...glow} />
      </mesh>
    </group>
  );
}

/* ───────────────────────────── 03 · Advanced manufacturing forge ───────────────────────────── */

function gearGeometry(teeth: number, rOuter: number, rRoot: number, holeR: number, spokes: number, depth: number) {
  const shape = new Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [[0, rRoot], [0.18, rOuter], [0.42, rOuter], [0.6, rRoot]];
    pts.forEach(([f, r], j) => {
      const x = Math.cos(a + f * step) * r, y = Math.sin(a + f * step) * r;
      if (i === 0 && j === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  const hole = new Path();
  hole.absarc(0, 0, holeR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const mid = (rRoot + holeR) / 2;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    const p = new Path();
    p.absarc(Math.cos(a) * mid, Math.sin(a) * mid, (rRoot - holeR) * 0.28, 0, Math.PI * 2, true);
    shape.holes.push(p);
  }
  const g = new ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.035, bevelSegments: 2, curveSegments: 6 });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function ForgeGears({ reduced }: { reduced: boolean }) {
  const root = useRef<Group>(null);
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);
  const ticks = useRef<InstancedMesh>(null);
  useNearby(root, 3);

  const gA = useMemo(() => gearGeometry(20, 2.0, 1.68, 0.38, 5, 0.5), []);
  const gB = useMemo(() => gearGeometry(12, 1.2, 0.92, 0.22, 4, 0.5), []);
  const sB = Math.PI / 6;

  useEffect(() => {
    const m = ticks.current;
    if (!m) return;
    const o = new Object3D();
    for (let i = 0; i < 72; i++) {
      const ang = (i / 72) * Math.PI * 2;
      const long = i % 6 === 0;
      o.position.set(Math.cos(ang) * 2.75, Math.sin(ang) * 2.75, 0);
      o.rotation.set(0, 0, ang);
      o.scale.set(long ? 0.22 : 0.1, 0.012, 0.012);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((s) => {
    if (!root.current?.visible) return;
    const t = reduced ? 0 : s.clock.elapsedTime * 0.25;
    // driven by scroll position as well as time: scrolling literally turns the machine
    const ang = t + rig.coord * 2.4;
    if (a.current) a.current.rotation.z = ang;
    if (b.current) b.current.rotation.z = -ang * (20 / 12) - 0.1 * sB;
    if (ticks.current) ticks.current.rotation.z = -ang * 0.25;
  });

  const o = stations[3].obj;
  return (
    <group ref={root} position={o} rotation={[0.25, -0.25, 0]}>
      <pointLight color="#ffb25a" intensity={28} distance={14} decay={2} position={[0, 0, 3]} />
      <mesh ref={a} geometry={gA}>
        <meshStandardMaterial color="#c79b5f" metalness={1} roughness={0.28} />
      </mesh>
      <mesh ref={b} geometry={gB} position={[2.9, 0, 0]}>
        <meshStandardMaterial color="#9aa3b2" metalness={1} roughness={0.25} />
      </mesh>
      <instancedMesh ref={ticks} args={[undefined, undefined, 72]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffd9a0" {...glow} />
      </instancedMesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[3.05, 0.015, 8, 200]} />
        <meshBasicMaterial color="#ffb25a" {...glow} />
      </mesh>
      <mesh position={[2.9, 0, 0]}>
        <torusGeometry args={[1.55, 0.012, 8, 120]} />
        <meshBasicMaterial color="#ffb25a" transparent opacity={0.6} {...glow} />
      </mesh>
    </group>
  );
}
