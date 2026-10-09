"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending, BackSide, CanvasTexture, Color, Group, InstancedMesh, Object3D, PointLight,
  Quaternion, RepeatWrapping, SRGBColorSpace, Vector3,
} from "three";
import { HOTEL_NORMAL, HOTEL_POS, MOON } from "./stations";
import { rig } from "./CameraRig";

function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Procedural lunar surface: a colour map (mottled regolith, maria) and a separate height map
 *  (bowl-shaped craters with raised rims) so the sun's grazing light carves real relief. */
function makeMoonTextures(w: number) {
  const h = w / 2;
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return c;
  };
  const color = mk(), height = mk();
  const cg = color.getContext("2d")!, hg = height.getContext("2d")!;
  const r = rng(1337);

  cg.fillStyle = "#8a8780";
  cg.fillRect(0, 0, w, h);
  hg.fillStyle = "#808080";
  hg.fillRect(0, 0, w, h);

  // broad tonal variation + dark maria
  for (let i = 0; i < 70; i++) {
    const x = r() * w, y = h * (0.1 + r() * 0.8), rad = w * (0.02 + r() * 0.07);
    const dark = i < 18;
    const gr = cg.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, dark ? "rgba(48,48,56,0.55)" : r() > 0.5 ? "rgba(200,196,185,0.18)" : "rgba(60,60,64,0.16)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    cg.fillStyle = gr;
    cg.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // fine regolith grain, in both maps
  for (let i = 0; i < w * 6; i++) {
    const v = 100 + r() * 80;
    const x = r() * w, y = r() * h, sz = 1 + r() * 2;
    cg.fillStyle = `rgba(${v},${v},${v - 4},${0.05 + r() * 0.1})`;
    cg.fillRect(x, y, sz, sz);
    const hv = 118 + r() * 22;
    hg.fillStyle = `rgba(${hv},${hv},${hv},0.35)`;
    hg.fillRect(x, y, sz, sz);
  }

  const crater = (x: number, y: number, rad: number, strength: number) => {
    const lat = (y / h - 0.5) * Math.PI;
    const stretch = 1 / Math.max(Math.cos(lat), 0.3);
    for (const dx of [0, -w, w]) {
      const px = x + dx;
      if (px < -rad * stretch || px > w + rad * stretch) continue;
      for (const [g, kind] of [[hg, "h"], [cg, "c"]] as const) {
        g.save();
        g.translate(px, y);
        g.scale(stretch, 1);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, rad);
        if (kind === "h") {
          gr.addColorStop(0, `rgba(36,36,36,${0.9 * strength})`);
          gr.addColorStop(0.55, `rgba(62,62,62,${0.85 * strength})`);
          gr.addColorStop(0.78, `rgba(128,128,128,${0.7 * strength})`);
          gr.addColorStop(0.9, `rgba(236,236,236,${0.8 * strength})`);
          gr.addColorStop(1, "rgba(128,128,128,0)");
        } else {
          gr.addColorStop(0, `rgba(40,40,46,${0.26 * strength})`);
          gr.addColorStop(0.7, `rgba(60,60,66,${0.12 * strength})`);
          gr.addColorStop(0.92, `rgba(215,210,198,${0.05 * strength})`);
          gr.addColorStop(1, "rgba(0,0,0,0)");
        }
        g.fillStyle = gr;
        g.beginPath();
        g.arc(0, 0, rad, 0, Math.PI * 2);
        g.fill();
        g.restore();
      }
    }
  };
  // a few big basins, many mid-size, a lot of small
  for (let i = 0; i < 26; i++) crater(r() * w, h * (0.12 + r() * 0.76), w * (0.03 + r() * 0.035), 0.8);
  for (let i = 0; i < w * 0.55; i++) crater(r() * w, r() * h, 3 + Math.pow(r(), 2.6) * w * 0.02, 0.5 + r() * 0.5);
  for (let i = 0; i < w * 2; i++) crater(r() * w, r() * h, 1.2 + r() * 3, 0.9);

  const map = new CanvasTexture(color);
  map.colorSpace = SRGBColorSpace;
  map.wrapS = RepeatWrapping;
  map.anisotropy = 8;
  const bump = new CanvasTexture(height);
  bump.wrapS = RepeatWrapping;
  bump.anisotropy = 8;
  return { map, bump };
}

const glowVert = /* glsl */ `
varying vec3 vN;
void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const glowFrag = /* glsl */ `
varying vec3 vN; uniform vec3 uColor; uniform float uK;
void main(){ float i = pow(max(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 0.0), 3.0); gl_FragColor = vec4(uColor, 1.0) * i * uK; }`;

export function Moon({ texSize }: { texSize: number }) {
  const tex = useMemo(() => makeMoonTextures(texSize), [texSize]);
  useEffect(() => () => { tex.map.dispose(); tex.bump.dispose(); }, [tex]);
  const uniforms = useMemo(() => ({ uColor: { value: new Color("#9bb8ff") }, uK: { value: 1 } }), []);
  // the thin glow reads as haze once the camera is down at the surface
  useFrame(() => {
    uniforms.uK.value = 1 - 0.8 * Math.min(1, Math.max(0, rig.coord - 3));
  });

  return (
    <group position={MOON.center}>
      <mesh rotation={[0.1, 2.2, 0]}>
        <sphereGeometry args={[MOON.radius, 160, 112]} />
        <meshStandardMaterial map={tex.map} bumpMap={tex.bump} bumpScale={7} roughness={0.97} metalness={0} />
      </mesh>
      <mesh scale={1.07}>
        <sphereGeometry args={[MOON.radius, 64, 48]} />
        <shaderMaterial vertexShader={glowVert} fragmentShader={glowFrag} uniforms={uniforms} side={BackSide} blending={AdditiveBlending} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Boulders scattered around the hotel give the close-up approach some scale. */
function Rocks() {
  const ref = useRef<InstancedMesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.visible = rig.coord > 2.6;
  });
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const r = rng(42);
    const o = new Object3D();
    const n = HOTEL_NORMAL.clone();
    const t1 = new Vector3(0, 1, 0).cross(n).normalize();
    const t2 = n.clone().cross(t1).normalize();
    for (let i = 0; i < 160; i++) {
      const a = r() * Math.PI * 2;
      const d = 4 + Math.pow(r(), 0.8) * 20;
      const p = HOTEL_POS.clone().addScaledVector(t1, Math.cos(a) * d).addScaledVector(t2, Math.sin(a) * d);
      p.sub(MOON.center).setLength(MOON.radius - 0.05).add(MOON.center);
      o.position.copy(p);
      o.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), p.clone().sub(MOON.center).normalize());
      o.rotateY(r() * 6);
      const s = 0.08 + Math.pow(r(), 3.5) * 0.5;
      o.scale.set(s * (0.8 + r() * 0.6), s * (0.5 + r() * 0.5), s * (0.8 + r() * 0.6));
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 160]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6f6d68" roughness={1} flatShading />
    </instancedMesh>
  );
}

/** "Moon Hotel": a conceptual lunar hospitality complex — dome, habitat modules, solar fields. */
export function MoonHotel() {
  const group = useRef<Group>(null);
  const lamp = useRef<PointLight>(null);
  const beacon = useRef<Object3D>(null);

  const quat = useMemo(() => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), HOTEL_NORMAL), []);
  const modules = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
  const lights = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

  useFrame((s) => {
    const near = rig.coord > 2.7;
    if (group.current) group.current.visible = near;
    const t = s.clock.elapsedTime;
    if (lamp.current) lamp.current.intensity = 22 + Math.sin(t * 1.3) * 2;
    if (beacon.current) beacon.current.visible = Math.sin(t * 3) > 0;
  });

  const glow = { toneMapped: false } as const;

  return (
    <>
      <Rocks />
      <group ref={group} position={HOTEL_POS} quaternion={quat}>
        {/* landing pad */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[3.4, 3.6, 0.1, 64]} />
          <meshStandardMaterial color="#3a3d48" metalness={0.5} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.2, 3.3, 96]} />
          <meshBasicMaterial color="#d9c9a3" {...glow} />
        </mesh>
        {lights.map((a, i) => (
          <mesh key={i} position={[Math.cos(a) * 3.45, 0.12, Math.sin(a) * 3.45]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#ffd9a0" {...glow} />
          </mesh>
        ))}

        {/* central dome */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[1.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#cfe3ff" transparent opacity={0.28} roughness={0.05} metalness={0.1} clearcoat={1} side={2} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#ffcf8a" transparent opacity={0.22} depthWrite={false} {...glow} />
        </mesh>
        <pointLight ref={lamp} position={[0, 1, 0]} color="#ffcf9a" distance={14} decay={2} />

        {/* habitat modules radiating from the dome */}
        {modules.map((a, i) => (
          <group key={i} rotation={[0, a + 0.4, 0]}>
            <mesh position={[2.3, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 1.5, 24]} />
              <meshStandardMaterial color="#c9ced8" metalness={0.8} roughness={0.35} />
            </mesh>
            <mesh position={[3.25, 0.38, 0]}>
              <sphereGeometry args={[0.62, 32, 24]} />
              <meshStandardMaterial color="#d6dae3" metalness={0.75} roughness={0.3} />
            </mesh>
            {[-0.3, 0, 0.3].map((z) => (
              <mesh key={z} position={[3.78, 0.5, z]}>
                <boxGeometry args={[0.04, 0.1, 0.14]} />
                <meshBasicMaterial color="#ffd9a0" {...glow} />
              </mesh>
            ))}
          </group>
        ))}

        {/* comms mast with beacon */}
        <mesh position={[2.0, 1.2, 1.4]}>
          <cylinderGeometry args={[0.03, 0.05, 2.4, 8]} />
          <meshStandardMaterial color="#aab" metalness={0.9} roughness={0.3} />
        </mesh>
        <object3D ref={beacon} position={[2.0, 2.45, 1.4]}>
          <mesh>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#ff5a5a" {...glow} />
          </mesh>
        </object3D>

        {/* solar fields */}
        {[-1, 1].map((sx) => (
          <group key={sx} position={[sx * 2.4, 0, -4.8]} rotation={[0, sx * 0.25, 0]}>
            {[0, 1.3, 2.6].map((z) => (
              <group key={z} position={[0, 0, z * 0.4]}>
                <mesh position={[0, 0.3, 0]} rotation={[-0.45, 0, 0]}>
                  <boxGeometry args={[2.2, 0.04, 0.9]} />
                  <meshStandardMaterial color="#2447a8" metalness={0.6} roughness={0.3} emissive="#15327f" emissiveIntensity={0.55} />
                </mesh>
                <mesh position={[0, 0.14, 0.05]}>
                  <cylinderGeometry args={[0.04, 0.05, 0.28, 8]} />
                  <meshStandardMaterial color="#889" metalness={0.9} roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}
