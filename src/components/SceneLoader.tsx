"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

export function SceneLoader() {
  return (
    <div className="scene-layer" aria-hidden="true">
      <Scene />
    </div>
  );
}
