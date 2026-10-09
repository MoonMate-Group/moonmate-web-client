"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { scrollState } from "@/lib/scroll";
import { HOTEL_NORMAL, STATION_COUNT, buildPoses } from "./stations";

export const rig = { coord: 0 };

export type SceneMode = { home: boolean; coord: number };

const A = new Vector3();
const B = new Vector3();
const LOOK = new Vector3();

export function CameraRig({ mode, reduced }: { mode: SceneMode; reduced: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const aspect = useThree((s) => Math.round(Math.min(s.size.width / s.size.height, 1.9) * 20) / 20);
  const curves = useMemo(() => ({ home: buildPoses(aspect), forced: buildPoses(aspect, 1) }), [aspect]);
  const st = useRef({ c: 0, blend: 0, px: 0, py: 0, fov: 45 });
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, dt) => {
    const s = st.current;
    dt = Math.min(dt, 0.05);
    const target = mode.home ? scrollState.coord : mode.coord;
    s.c = MathUtils.damp(s.c, target, mode.home ? 4 : 1.7, dt);
    s.blend = MathUtils.damp(s.blend, mode.home ? 0 : 1, 2.5, dt);

    const last = STATION_COUNT - 1;
    const c = MathUtils.clamp(s.c, 0, last);
    const i = Math.min(Math.floor(c), last - 1);
    const f = c - i;
    const u = (i + f * f * (3 - 2 * f)) / last; // smoothstep: the camera dwells at each station

    curves.home.pos.getPoint(u, A);
    curves.forced.pos.getPoint(u, B);
    A.lerp(B, s.blend);
    curves.home.look.getPoint(u, LOOK);
    curves.forced.look.getPoint(u, B);
    LOOK.lerp(B, s.blend);

    const k = reduced ? 0 : 1;
    s.px = MathUtils.damp(s.px, pointer.current.x, 2.5, dt);
    s.py = MathUtils.damp(s.py, pointer.current.y, 2.5, dt);
    const t = state.clock.elapsedTime;
    A.x += (s.px * 0.45 + Math.sin(t * 0.25) * 0.12) * k;
    A.y += (-s.py * 0.28 + Math.cos(t * 0.21) * 0.08) * k;

    // Roll the camera so "up" follows the lunar surface normal as we land at the hotel.
    const w = MathUtils.clamp(1 - Math.abs(s.c - 4), 0, 1);
    camera.up.set(0, 1, 0).lerp(HOTEL_NORMAL, w * w * (3 - 2 * w)).normalize();
    camera.position.copy(A);
    camera.lookAt(LOOK);

    // subtle speed kick while scrolling fast
    const targetFov = 45 + Math.min(Math.abs(scrollState.velocity), 40) * 0.2 * k;
    s.fov = MathUtils.damp(s.fov, targetFov, 4, dt);
    if (Math.abs(camera.fov - s.fov) > 0.01) {
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
    }
    rig.coord = s.c;
  });

  return null;
}
