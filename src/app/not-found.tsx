import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-xs tracking-[0.22em] text-lunar uppercase">404</p>
      <h1 className="mt-4 text-5xl font-semibold">Lost in space.</h1>
      <p className="mt-4 text-muted-foreground">That page does not exist.</p>
      <Button size="lg" className="mt-8 h-11 rounded-full px-7 text-sm" render={<Link href="/" />} nativeButton={false}>Return home</Button>
    </div>
  );
}
