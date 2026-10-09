import { ChartSplineIcon, FactoryIcon, MoonIcon, ShieldCheckIcon } from "lucide-react";
import type { IconName } from "@/data/businesses";

const map = { chart: ChartSplineIcon, shield: ShieldCheckIcon, factory: FactoryIcon, moon: MoonIcon } as const;

export function BusinessIcon({ name, className }: { name: IconName; className?: string }) {
  const I = map[name];
  return <I className={className} aria-hidden="true" />;
}
