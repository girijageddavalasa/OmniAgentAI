import { createFileRoute } from "@tanstack/react-router";
import { useJourney } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { Eye, Users, ShoppingCart, Store, IndianRupee, Star, TrendingUp, AlertOctagon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — OmniAgent AI" }] }),
  component: Analytics,
});

const TRAFFIC = [
  { day: "Mon", web: 4200, mobile: 2100, store: 320 },
  { day: "Tue", web: 5100, mobile: 2600, store: 410 },
  { day: "Wed", web: 4800, mobile: 2400, store: 380 },
  { day: "Thu", web: 6200, mobile: 3100, store: 510 },
  { day: "Fri", web: 7900, mobile: 4200, store: 680 },
  { day: "Sat", web: 9200, mobile: 5100, store: 820 },
  { day: "Sun", web: 8400, mobile: 4700, store: 760 },
];

const FUNNEL = [
  { stage: "Visitors", value: 12480 },
  { stage: "Product Views", value: 8210 },
  { stage: "Cart Adds", value: 2840 },
  { stage: "Store Visits", value: 612 },
  { stage: "Purchases", value: 1908 },
];

const SIZE_GAPS = [
  { name: "Nike Air Max / 9", value: 41 },
  { name: "Adidas Jacket / L", value: 27 },
  { name: "Puma Tee / XL", value: 18 },
  { name: "Nike Hoodie / M", value: 14 },
];

const COLORS = ["oklch(0.55 0.24 285)", "oklch(0.72 0.16 210)", "oklch(0.7 0.17 155)", "oklch(0.78 0.16 75)"];

function Analytics() {
  const j = useJourney();
  const totalRating = j.feedback.length ? (j.feedback.reduce((a, b) => a + b.rating, 0) / j.feedback.length).toFixed(1) : "4.6";

  const reasonData = Object.entries({
    "Comparing Products": 32,
    "Need Family Approval": 21,
    "Waiting For Salary": 14,
    "Unsure About Size": 19,
    "Planning To Buy Later": 14,
    ...j.cartReasons,
  }).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader
        eyebrow="Insights · Executive Dashboard"
        title="Omnichannel analytics"
        description="Top-line metrics, channel flow, abandonment reasons and churn risk — all in one place."
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={<Users />} label="Website visitors" value="12,480" delta="+8.2%" />
        <Kpi icon={<Eye />} label="Product views" value="8,210" delta="+5.1%" />
        <Kpi icon={<ShoppingCart />} label="Cart adds" value="2,840" delta="+12.4%" />
        <Kpi icon={<Store />} label="Store visits" value="612" delta="+23.0%" />
        <Kpi icon={<IndianRupee />} label="Purchases" value="₹74.2L" delta="+9.8%" />
        <Kpi icon={<Star />} label="Avg rating" value={`${totalRating} ★`} delta="+0.2" />
        <Kpi icon={<Eye />} label="Most viewed" value="Air Max 270" subtle />
        <Kpi icon={<AlertOctagon />} label="Most-missed size" value="Air Max / 9" subtle />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="rounded-2xl border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Traffic by channel</div>
              <div className="font-semibold">Last 7 days</div>
            </div>
            <span className="text-xs text-emerald-600 flex items-center gap-1"><TrendingUp className="size-4" /> +14% vs prev week</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={TRAFFIC}>
                <CartesianGrid stroke="oklch(0.92 0.01 260)" strokeDasharray="4 4" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 260)" }} />
                <Legend />
                <Line type="monotone" dataKey="web" stroke="oklch(0.55 0.24 285)" strokeWidth={2.5} dot={false} name="Website" />
                <Line type="monotone" dataKey="mobile" stroke="oklch(0.72 0.16 210)" strokeWidth={2.5} dot={false} name="Mobile" />
                <Line type="monotone" dataKey="store" stroke="oklch(0.7 0.17 155)" strokeWidth={2.5} dot={false} name="Store" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Journey funnel</div>
          <div className="font-semibold">Web → Store → Buy</div>
          <div className="mt-3 space-y-2">
            {FUNNEL.map((f, i) => {
              const max = FUNNEL[0].value;
              const w = (f.value / max) * 100;
              return (
                <div key={f.stage}>
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{f.stage}</span>
                    <span className="text-muted-foreground">{f.value.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, oklch(0.72 0.16 210))` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="rounded-2xl border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Cart abandonment reasons</div>
          <div className="font-semibold mb-3">Why customers add but don't buy</div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={reasonData}>
                <CartesianGrid stroke="oklch(0.92 0.01 260)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-12} textAnchor="end" height={70} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="oklch(0.55 0.24 285)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Top unavailable sizes</div>
          <div className="font-semibold">Drives churn signals</div>
          <div className="h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SIZE_GAPS} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {SIZE_GAPS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1 text-xs">
            {SIZE_GAPS.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: COLORS[i] }} /> {s.name}</span>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Churn analysis cards */}
      <div className="mt-6 rounded-2xl border bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl gradient-brand grid place-items-center"><AlertOctagon className="size-5 text-white" /></div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/60">Churn Analysis Agent · executive view</div>
              <div className="text-lg font-semibold">AI insights you can act on this week</div>
            </div>
          </div>
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <Insight title="Top churn reason" value="Size Unavailable" sub="Drives 41% of lost intent" />
            <Insight title="Risk score" value="82%" sub="At-risk segment: sneaker buyers" />
            <Insight title="Recommended actions" value="3 plays" sub="Discount · Restock alert · Similar product" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, delta, subtle }: { icon: React.ReactNode; label: string; value: string; delta?: string; subtle?: boolean }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="text-brand [&_svg]:size-4">{icon}</span> {label}
      </div>
      <div className="mt-1.5 text-xl font-semibold">{value}</div>
      {delta && !subtle && <div className="text-xs text-emerald-600 mt-1">{delta}</div>}
      {subtle && <div className="text-xs text-muted-foreground mt-1">Leading indicator</div>}
    </div>
  );
}

function Insight({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/15 p-4">
      <div className="text-[10px] uppercase tracking-wider text-white/60">{title}</div>
      <div className="text-2xl font-semibold mt-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{value}</div>
      <div className="text-xs text-white/70 mt-1">{sub}</div>
    </div>
  );
}
