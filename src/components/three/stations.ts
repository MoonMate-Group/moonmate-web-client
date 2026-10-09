import { CatmullRomCurve3, Vector3 } from "three";

/** The Moon is the journey's destination. Everything else lies on the way. */
export const MOON = { center: new Vector3(30, -5, -104), radius: 24 };

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);
const UP = v(0, 1, 0);

export const HOTEL_NORMAL = v(-0.38, 0.32, 1).normalize();
export const HOTEL_POS = MOON.center.clone().addScaledVector(HOTEL_NORMAL, MOON.radius);
// direction along the lunar surface toward the approaching camera
const HOTEL_TANGENT = v(0, 0, 1).addScaledVector(HOTEL_NORMAL, -HOTEL_NORMAL.z).normalize();

export interface Station {
  id: string;
  obj: Vector3;
  cam: Vector3;
  /** fraction of the half-screen the subject is pushed sideways */
  f: number;
  /** +1: subject sits on the right of the screen (copy on the left) */
  side: 1 | -1;
}

export const stations: Station[] = [
  { id: "hero", obj: MOON.center, cam: v(0, 0.6, 18), f: 0.62, side: 1 },
  { id: "financial", obj: v(-5, 1, -14), cam: v(-1.5, 1.4, -3.8), f: 0.5, side: -1 },
  { id: "defence", obj: v(5.5, -0.5, -27), cam: v(1.5, -0.2, -16.5), f: 0.5, side: 1 },
  { id: "forge", obj: v(-5.5, 0.5, -40), cam: v(-1.5, 1.2, -29.5), f: 0.5, side: -1 },
  {
    id: "space",
    obj: HOTEL_POS,
    cam: HOTEL_POS.clone().addScaledVector(HOTEL_NORMAL, 7.6).addScaledVector(HOTEL_TANGENT, 15).add(v(-1.5, 0, 0)),
    f: 0.5,
    side: 1,
  },
  {
    id: "group",
    obj: MOON.center,
    cam: MOON.center.clone().addScaledVector(v(-0.45, 0.3, 1).normalize(), MOON.radius * 3.4),
    f: 0.5,
    side: 1,
  },
];

/** Station index for a business slug, by position in the businesses list (+1 for the hero). */
export const STATION_COUNT = stations.length;

export function buildPoses(aspect: number, forceSide?: 1 | -1) {
  const pos: Vector3[] = [];
  const look: Vector3[] = [];
  for (const s of stations) {
    const side = forceSide ?? s.side;
    const dist = s.cam.distanceTo(s.obj);
    const forward = s.obj.clone().sub(s.cam).normalize();
    const right = forward.clone().cross(UP).normalize();
    const shift = dist * 0.414 * aspect * s.f;
    pos.push(s.cam.clone());
    const l = s.obj.clone().addScaledVector(right, -side * shift);
    // portrait screens: park the subject in the lower half, clear of the copy
    if (aspect < 1) l.addScaledVector(UP, dist * 0.414 * 1.15 * (1 - aspect));
    look.push(l);
  }
  return {
    pos: new CatmullRomCurve3(pos, false, "catmullrom", 0.5),
    look: new CatmullRomCurve3(look, false, "catmullrom", 0.5),
  };
}
