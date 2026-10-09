"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { usePathname } from "next/navigation";
import { Suspense, useMemo } from "react";
import { businesses } from "@/data/businesses";
import { Dust, Nebula, Starfield } from "./Backdrop";
import { CameraRig, type SceneMode } from "./CameraRig";
import { Moon, MoonHotel } from "./Moon";
import { DefenceCore, FinanceNetwork, ForgeGears } from "./StationObjects";

function modeFor(path: string): SceneMode {
  if (path === "/") return { home: true, coord: 0 };
  const m = path.match(/^\/businesses\/([^/]+)/);
  if (m) {
    const i = businesses.findIndex((b) => b.slug === m[1]);
    if (i >= 0) return { home: false, coord: i + 1 };
  }
  return { home: false, coord: 0 };
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Scene() {
  const pathname = usePathname();
  const mode = useMemo(() => modeFor(pathname), [pathname]);
  const env = useMemo(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    return {
      ok: hasWebGL(),
      coarse,
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
  }, []);

  if (!env.ok) return null; // CSS fallback (page background) stays visible

  return (
    <Canvas
      dpr={[1, env.coarse ? 1.5 : 1.8]}
      camera={{ fov: 45, near: 0.1, far: 1500, position: [0, 0.6, 18] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#04050a"]} />
      <ambientLight intensity={0.1} color="#8fa6ff" />
      <directionalLight position={[-80, 26, 24]} intensity={3.6} color="#fff3dc" />

      <Suspense fallback={null}>
        <Environment resolution={128} environmentIntensity={0.35}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -6]} scale={[12, 3, 1]} />
          <Lightformer form="rect" intensity={2} position={[-6, 0, 4]} scale={[6, 6, 1]} color="#9bb8ff" />
          <Lightformer form="ring" intensity={2.5} position={[6, 1, 3]} scale={5} color="#ffd9a0" />
        </Environment>
      </Suspense>

      <CameraRig mode={mode} reduced={env.reduced} />
      <Starfield count={env.coarse ? 2500 : 6000} />
      <Nebula />
      <Dust count={env.coarse ? 250 : 650} />
      <Moon texSize={env.coarse ? 2048 : 4096} />
      <MoonHotel />
      <FinanceNetwork reduced={env.reduced} />
      <DefenceCore reduced={env.reduced} />
      <ForgeGears reduced={env.reduced} />

      {!env.coarse && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.85} />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
