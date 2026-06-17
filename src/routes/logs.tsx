import { createFileRoute } from "@tanstack/react-router";
import { useJourney, type Channel } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { Globe, Smartphone, Store, Bot, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/logs")({
  head: () => ({ meta: [{ title: "Live Event Logs — OmniAgent AI" }] }),
  component: Logs,
});

const CHANNEL_META: Record<Channel, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  Website: { icon: Globe, color: "from-violet-500 to-indigo-500" },
  Mobile: { icon: Smartphone, color: "from-sky-500 to-cyan-400" },
  Store: { icon: Store, color: "from-emerald-500 to-teal-400" },
  AI: { icon: Bot, color: "from-fuchsia-500 to-pink-400" },
  Analytics: { icon: BarChart3, color: "from-amber-500 to-orange-400" },
};

function Logs() {
  const { events } = useJourney();
  const ordered = [...events].reverse();

  return (
    <div>
      <PageHeader
        eyebrow="Insights · Activity"
        title="Live event logs"
        description="Every customer and agent action, captured in real time. The single source of truth across channels."
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="rounded-2xl border bg-card shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div className="text-sm font-semibold">{events.length} events</div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500 animate-pulse-dot" /> Streaming</span>
          </div>
          <ul className="divide-y">
            {ordered.map(e => {
              const meta = CHANNEL_META[e.channel];
              const Icon = meta.icon;
              return (
                <li key={e.id} className="px-5 py-3 flex items-start gap-3 hover:bg-muted/40 transition">
                  <div className={`size-9 rounded-lg bg-gradient-to-br ${meta.color} grid place-items-center text-white shrink-0`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{e.label}</span>
                      <span className="text-[10px] uppercase tracking-wider rounded-full bg-muted px-2 py-0.5">{e.channel}</span>
                    </div>
                    {e.detail && <div className="text-xs text-muted-foreground mt-0.5 truncate">{e.detail}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">{e.time}</div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Channels</div>
            <ul className="mt-3 space-y-2 text-sm">
              {(Object.keys(CHANNEL_META) as Channel[]).map(c => {
                const meta = CHANNEL_META[c];
                const Icon = meta.icon;
                const count = events.filter(e => e.channel === c).length;
                return (
                  <li key={c} className="flex items-center gap-2">
                    <div className={`size-6 rounded-md bg-gradient-to-br ${meta.color} grid place-items-center text-white`}><Icon className="size-3" /></div>
                    <span className="flex-1">{c}</span>
                    <span className="text-muted-foreground tabular-nums">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border glass-card p-5">
            <div className="text-sm font-semibold">Tip</div>
            <p className="text-xs text-muted-foreground mt-1">Trigger an out-of-stock size on the storefront to see the full agent choreography appear here within seconds.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
