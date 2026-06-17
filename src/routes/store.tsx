import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useJourney, getProduct } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { FeedbackBar } from "@/components/FeedbackBar";
import { Store, Bell, ArrowRight, CheckCircle2, MapPin, User2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/store")({
  head: () => ({ meta: [{ title: "Physical Store — OmniAgent AI" }] }),
  component: StorePage,
});

function StorePage() {
  const j = useJourney();
  const viewed = getProduct(j.viewedProductId) || getProduct("nike-airmax")!;
  const [stage, setStage] = useState<"entry" | "welcome" | "routing">(j.visitedStore ? "routing" : "entry");

  const onEnter = () => {
    j.enterStore();
    j.logEvent("Store Visit", "Store", "Phoenix Mall — Store A");
    setStage("welcome");
  };

  const onYes = () => {
    j.assignAssociate();
    j.logEvent("Sales Associate Assigned", "Store", "Rahul Sharma");
    j.pushAgentMessage("Store Assistant Agent", "Recommendation Agent", "Customer entered store. Pushing context to associate Rahul.");
    setStage("routing");
    toast.success("Associate Rahul has been briefed.");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Customer · Physical Store"
        title="In-store experience"
        description="Walk into a partner store and the journey continues seamlessly — geo-detected, greeted, and routed."
      />

      {stage === "entry" && (
        <div className="rounded-2xl border bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 text-white p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <div className="mx-auto size-16 rounded-2xl bg-white/10 grid place-items-center mb-4"><Store className="size-8" /></div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/60">Store A · Phoenix Mall · 2.0 km</div>
            <h2 className="text-3xl font-semibold mt-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>You're near a partner store</h2>
            <p className="text-white/70 mt-2 max-w-md mx-auto">Tap to simulate walking in. Geofence + BLE beacons will detect you on arrival.</p>
            <button onClick={onEnter} className="mt-6 inline-flex rounded-xl bg-white text-slate-900 px-6 py-3 text-sm font-semibold items-center gap-2 hover:bg-white/90">
              Enter Store <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {stage === "welcome" && (
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border bg-card shadow-2xl p-5 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl gradient-brand grid place-items-center"><Bell className="size-5 text-white" /></div>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Push notification · just now</div>
                <div className="font-semibold">Welcome back, {j.customer.name.split(" ")[0]}!</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">We spotted you at <b>Phoenix Mall</b>. Want assisted shopping for the <b>{viewed.name}</b> you were looking at?</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => { setStage("entry"); j.logEvent("Assistance Declined", "Store"); }} className="rounded-lg border bg-background hover:bg-muted py-2.5 text-sm font-medium">No, thanks</button>
              <button onClick={onYes} className="rounded-lg gradient-brand text-white py-2.5 text-sm font-medium">Yes, help me</button>
            </div>
          </div>
        </div>
      )}

      {stage === "routing" && (
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Indoor route</div>
            <h3 className="text-xl font-semibold mt-1">Follow the path to your product</h3>
            <p className="text-sm text-muted-foreground mt-1">Animated wayfinding from the entrance to your associate.</p>

            <div className="mt-5 rounded-xl border bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
              <RouteSvg />
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                {["Entrance", "Footwear", "Rack B12", "Meet Rahul"].map((s, i) => (
                  <div key={s} className="rounded-lg border bg-white px-2 py-2">
                    <div className="text-[10px] text-muted-foreground">Step {i + 1}</div>
                    <div className="font-medium">{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Your associate</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="size-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 grid place-items-center text-white font-semibold">RS</div>
                <div>
                  <div className="font-semibold">Rahul Sharma</div>
                  <div className="text-xs text-muted-foreground">Sneaker Specialist · 4.9 ★</div>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-emerald-50 text-emerald-800 px-3 py-2 text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4" /> Briefed with your size, budget and recent searches.
              </div>
              <Link to="/associate" className="mt-4 inline-flex rounded-lg gradient-brand text-white px-4 py-2 text-sm font-medium items-center gap-1.5">
                Open associate view <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="rounded-2xl border glass-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold"><MapPin className="size-4 text-brand" /> Store A — Phoenix Mall</div>
              <div className="text-xs text-muted-foreground mt-1">Aisle 4 · Footwear · Open till 10 PM</div>
            </div>

            <FeedbackBar context="In-store welcome experience" />
          </div>
        </div>
      )}
    </div>
  );
}

function RouteSvg() {
  return (
    <svg viewBox="0 0 600 220" className="w-full h-auto">
      <defs>
        <linearGradient id="path-grad" x1="0" x2="1">
          <stop offset="0" stopColor="oklch(0.55 0.24 285)" />
          <stop offset="1" stopColor="oklch(0.72 0.16 210)" />
        </linearGradient>
      </defs>
      {/* Store layout rectangles */}
      <rect x="20" y="30" width="560" height="160" rx="12" fill="white" stroke="oklch(0.92 0.01 260)" />
      <rect x="50" y="60" width="120" height="120" rx="8" fill="oklch(0.96 0.01 260)" />
      <rect x="200" y="60" width="150" height="60" rx="8" fill="oklch(0.96 0.01 260)" />
      <rect x="200" y="130" width="150" height="50" rx="8" fill="oklch(0.96 0.01 260)" />
      <rect x="380" y="60" width="180" height="120" rx="8" fill="oklch(0.95 0.04 220)" />
      {/* Path */}
      <path
        d="M 60 180 L 60 100 L 220 100 L 220 70 L 360 70 L 360 150 L 470 150"
        fill="none"
        stroke="url(#path-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 6"
        className="animate-flow"
      />
      {/* Markers */}
      <g>
        <circle cx="60" cy="180" r="8" fill="oklch(0.55 0.24 285)" />
        <text x="60" y="205" textAnchor="middle" fontSize="11" fill="#475569">Entrance</text>
      </g>
      <g>
        <circle cx="220" cy="100" r="7" fill="oklch(0.62 0.2 230)" />
        <text x="220" y="50" textAnchor="middle" fontSize="11" fill="#475569">Footwear</text>
      </g>
      <g>
        <circle cx="360" cy="70" r="7" fill="oklch(0.62 0.2 230)" />
        <text x="360" y="55" textAnchor="middle" fontSize="11" fill="#475569">Rack B12</text>
      </g>
      <g>
        <circle cx="470" cy="150" r="10" fill="oklch(0.55 0.24 285)" />
        <User2 x="464" y="144" width="12" height="12" className="text-white" stroke="white" />
        <text x="470" y="180" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">Meet Rahul</text>
      </g>
    </svg>
  );
}
