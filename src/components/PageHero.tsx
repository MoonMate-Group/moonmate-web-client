import { cn } from "@/lib/utils";

/** Transparent hero so the 3D scene shows through behind the page title. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section className="relative flex min-h-svh items-end">
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-10 sm:pb-28">
        <p className="font-mono text-xs tracking-[0.22em] text-lunar uppercase">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1] font-semibold tracking-tight text-balance">{title}</h1>
        {lead && <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

/** Content below the hero sits on a frosted veil so copy stays readable over the scene. */
export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="relative border-t bg-background/80 backdrop-blur-2xl">{children}</div>;
}

export function Section({ eyebrow, title, children, className }: { eyebrow?: string; title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28", className)}>
      {eyebrow && <p className="font-mono text-xs tracking-[0.22em] text-lunar uppercase">{eyebrow}</p>}
      {title && <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>}
      <div className={eyebrow || title ? "mt-12" : ""}>{children}</div>
    </section>
  );
}
