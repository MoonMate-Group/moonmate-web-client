import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function InfoCard({ title, body, kicker }: { title: string; body: string; kicker?: string }) {
  return (
    <Card className="h-full backdrop-blur-xl">
      <CardHeader>
        {kicker && <span className="font-mono text-xs tracking-[0.16em] text-lunar uppercase">{kicker}</span>}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}
