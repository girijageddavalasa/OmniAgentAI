import { Link, useRouterState } from "@tanstack/react-router";
import {
  ShoppingBag, Smartphone, Store, Headset, Bot, BarChart3, Activity, Bell, Sparkles,
} from "lucide-react";
import { useJourney } from "@/lib/journey-store";

const NAV = [
  { to: "/", label: "Shopping Website", icon: ShoppingBag, group: "Customer" },
  { to: "/mobile", label: "Mobile App", icon: Smartphone, group: "Customer" },
  { to: "/store", label: "Physical Store", icon: Store, group: "Customer" },
  { to: "/associate", label: "Sales Associate", icon: Headset, group: "Operations" },
  { to: "/agents", label: "AI Agent Center", icon: Bot, group: "Operations" },
  { to: "/notifications", label: "Notifications", icon: Bell, group: "Operations" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, group: "Insights" },
  { to: "/logs", label: "Live Event Logs", icon: Activity, group: "Insights" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: r => r.location.pathname });
  const { events, agentMessages } = useJourney();

  const groups = Array.from(new Set(NAV.map(n => n.group)));

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="size-9 rounded-xl gradient-brand grid place-items-center shadow-lg">
          <Sparkles className="size-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-white">OmniAgent AI</div>
          <div className="text-[11px] text-white/50">Retail Intelligence Cloud</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map(g => (
          <div key={g}>
            <div className="px-2 mb-2 text-[10px] uppercase tracking-[0.14em] text-white/40">{g}</div>
            <ul className="space-y-1">
              {NAV.filter(n => n.group === g).map(n => {
                const active = pathname === n.to;
                const Icon = n.icon;
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-sidebar-accent text-white shadow-inner"
                          : "text-white/70 hover:bg-sidebar-accent/60 hover:text-white"
                      }`}
                    >
                      <Icon className={`size-4 ${active ? "text-brand-2" : ""}`} />
                      <span className="flex-1">{n.label}</span>
                      {active && <span className="size-1.5 rounded-full bg-brand-2 animate-pulse-dot" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-xl glass-dark p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60">Live signals</span>
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse-dot" />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-md bg-white/5 py-2">
            <div className="text-lg font-semibold text-white tabular-nums">{events.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Events</div>
          </div>
          <div className="rounded-md bg-white/5 py-2">
            <div className="text-lg font-semibold text-white tabular-nums">{agentMessages.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Agent msgs</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
