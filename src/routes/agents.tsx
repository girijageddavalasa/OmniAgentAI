import { createFileRoute } from "@tanstack/react-router";
import { useJourney } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { Activity, Boxes, Sparkles, Headset, BellRing, AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/agents")({
  head: () => ({ meta: [{ title: "AI Agent Center — OmniAgent AI" }] }),
  component: Agents,
});

const AGENTS = [
  { name: "Journey Continuity Agent", icon: Activity, color: "from-violet-500 to-indigo-500", desc: "Maintains a unified customer state across all touchpoints." },
  { name: "Inventory Intelligence Agent", icon: Boxes, color: "from-sky-500 to-cyan-400", desc: "Tracks stock and predicts restocks across stores and warehouses." },
  { name: "Recommendation Agent", icon: Sparkles, color: "from-fuchsia-500 to-pink-400", desc: "Suggests alternatives and personalises in real time." },
  { name: "Store Assistant Agent", icon: Headset, color: "from-emerald-500 to-teal-400", desc: "Briefs store associates with customer context on arrival." },
  { name: "Notification Agent", icon: BellRing, color: "from-amber-500 to-orange-400", desc: "Coordinates restock alerts, push, email and SMS." },
  { name: "Churn Analysis Agent", icon: AlertTriangle, color: "from-rose-500 to-red-400", desc: "Detects drop-off signals and recommends save actions." },
];

function Agents() {
  const { agentMessages, pushAgentMessage } = useJourney();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [agentMessages.length]);

  return (
    <div>
      <PageHeader
        eyebrow="Operations · Agent Communication Center"
        title="AI agents working together"
        description="Live view of the six agents orchestrating the omnichannel journey. Watch messages flow between them in real time."
        actions={
          <button
            onClick={() => pushAgentMessage("Journey Continuity Agent", "Recommendation Agent", "Trigger manual replay of last session.")}
            className="rounded-lg gradient-brand text-white px-3 py-2 text-sm font-medium"
          >
            Simulate message
          </button>
        }
      />

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Constellation */}
        <div className="rounded-2xl border bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white p-6 relative overflow-hidden min-h-[480px]">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <Constellation />
        </div>

        {/* Message feed */}
        <div className="rounded-2xl border bg-card shadow-soft flex flex-col min-h-[480px]">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Inter-agent feed</div>
              <div className="text-sm font-semibold">{agentMessages.length} messages</div>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500 animate-pulse-dot" /> Live</span>
          </div>
          <div ref={scroller} className="flex-1 overflow-y-auto p-4 space-y-3">
            {agentMessages.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-12">
                No messages yet. Trigger an out-of-stock event on the shopping page to see the agents collaborate.
              </div>
            )}
            {agentMessages.map(m => (
              <div key={m.id} className="rounded-xl border bg-background p-3 text-sm animate-in fade-in slide-in-from-bottom-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold">{m.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold text-brand">{m.to}</span>
                  <span className="ml-auto text-muted-foreground">{m.time}</span>
                </div>
                <div className="mt-1.5 text-foreground">{m.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {AGENTS.map(a => {
          const count = agentMessages.filter(m => m.from === a.name || m.to === a.name).length;
          return (
            <div key={a.name} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className={`size-10 rounded-xl bg-gradient-to-br ${a.color} grid place-items-center text-white`}>
                <a.icon className="size-5" />
              </div>
              <div className="mt-3 font-semibold">{a.name}</div>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5">Online</span>
                <span className="text-muted-foreground">{count} msgs</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



function Constellation() {
  // 6 agents on a circle
  const cx = 300, cy = 220, r = 150;
  const positions = AGENTS.map((a, i) => {
    const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
    return { ...a, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return (
    <svg viewBox="0 0 600 440" className="w-full h-full relative">
      <defs>
        <linearGradient id="line-grad" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.65 0.22 285)" stopOpacity="0.6" />
          <stop offset="1" stopColor="oklch(0.72 0.16 210)" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* connecting lines (each to each) */}
      {positions.map((p, i) =>
        positions.slice(i + 1).map((q, j) => (
          <line
            key={`${i}-${j}`}
            x1={p.x} y1={p.y} x2={q.x} y2={q.y}
            stroke="url(#line-grad)"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="animate-flow"
            style={{ animationDelay: `${(i + j) * 0.15}s` }}
          />
        ))
      )}
      {/* central hub */}
      <circle cx={cx} cy={cy} r="42" fill="oklch(0.55 0.24 285 / 0.2)" />
      <circle cx={cx} cy={cy} r="28" fill="url(#line-grad)" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="600">OmniAgent</text>
      {/* nodes */}
      {positions.map(p => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r="28" fill="white" opacity="0.08" />
          <circle cx={p.x} cy={p.y} r="22" fill="oklch(0.25 0.04 270)" stroke="oklch(0.65 0.22 285 / 0.6)" />
          <text x={p.x} y={p.y - 36} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">{p.name.replace(" Agent", "")}</text>
          <circle cx={p.x + 16} cy={p.y - 16} r="3" fill="oklch(0.7 0.17 155)" className="animate-pulse-dot" />
        </g>
      ))}
    </svg>
  );
}
