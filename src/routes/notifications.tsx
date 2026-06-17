import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useJourney, PRODUCTS } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { Bell, Mail, BellRing, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — OmniAgent AI" }] }),
  component: Notifications,
});

function Notifications() {
  const j = useJourney();
  const [product, setProduct] = useState(PRODUCTS[0].id);
  const [size, setSize] = useState(PRODUCTS[0].sizes[0].label);
  const [email, setEmail] = useState("aanya@omniagent.ai");
  const selected = PRODUCTS.find(p => p.id === product)!;

  return (
    <div>
      <PageHeader
        eyebrow="Operations · Notification Center"
        title="Restock alerts & messaging"
        description="Customers subscribe once; agents decide the right channel and moment to reach back out."
      />

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
        {/* Subscribe */}
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">
            <BellRing className="size-4" /> Subscribe to restock alert
          </div>
          <div className="mt-4 space-y-3">
            <Field label="Product">
              <select value={product} onChange={e => { setProduct(e.target.value); const p = PRODUCTS.find(x => x.id === e.target.value)!; setSize(p.sizes[0].label); }} className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.brand} — {p.name}</option>)}
              </select>
            </Field>
            <Field label="Size">
              <div className="flex flex-wrap gap-2">
                {selected.sizes.map(s => (
                  <button key={s.label} onClick={() => setSize(s.label)} className={`rounded-md border px-3 py-1.5 text-sm ${size === s.label ? "border-primary ring-2 ring-primary/30" : ""}`}>{s.label}</button>
                ))}
              </div>
            </Field>
            <Field label="Email">
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            </Field>
            <button
              onClick={() => { j.subscribeRestock(`${selected.brand} ${selected.name}`, size); j.logEvent("Restock Alert Scheduled", "AI", `${selected.name} • ${size}`); toast.success("You're on the list."); }}
              className="w-full rounded-lg gradient-brand text-white py-2.5 text-sm font-medium"
            >
              Notify me when it's back
            </button>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> We'll use the best channel and moment, not spam you.</div>
          </div>
        </div>

        {/* Email preview */}
        <div className="rounded-2xl border bg-card shadow-soft overflow-hidden">
          <div className="bg-muted px-5 py-3 flex items-center gap-2 border-b">
            <div className="size-8 rounded-lg gradient-brand grid place-items-center text-white"><Mail className="size-4" /></div>
            <div>
              <div className="text-sm font-semibold">Email preview</div>
              <div className="text-xs text-muted-foreground">to {email}</div>
            </div>
          </div>
          <div className="p-6">
            <div className="text-xs text-muted-foreground">Subject</div>
            <div className="font-semibold text-lg">{selected.name} size {size} is back in stock</div>
            <div className="mt-5 rounded-xl border overflow-hidden">
              <div className={`h-40 bg-gradient-to-br ${selected.color} grid place-items-center`}>
                <div className="text-7xl">{selected.image}</div>
              </div>
              <div className="p-5">
                <div className="text-sm">Hey {j.customer.name.split(" ")[0]},</div>
                <p className="text-sm text-muted-foreground mt-2">Good news — the <b>{selected.brand} {selected.name}</b> in <b>size {size}</b> you wanted is back in stock and reserved for you for the next 24 hours.</p>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg gradient-brand text-white px-4 py-2 text-sm font-medium">Buy now</button>
                  <button className="rounded-lg border bg-background px-4 py-2 text-sm">Pick up in store</button>
                </div>
                <div className="mt-4 text-[11px] text-muted-foreground">Sent by OmniAgent AI · Notification Agent · {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sent log */}
      <div className="mt-6 rounded-2xl border bg-card shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="text-sm font-semibold flex items-center gap-2"><Bell className="size-4 text-brand" /> Scheduled notifications</div>
          <span className="text-xs text-muted-foreground">{j.notifications.length} active</span>
        </div>
        {j.notifications.length === 0 ? (
          <div className="px-5 py-6 text-sm text-muted-foreground">No alerts scheduled yet. Subscribe above or trigger a size-unavailable event.</div>
        ) : (
          <ul className="divide-y">
            {[...j.notifications].reverse().map(n => (
              <li key={n.id} className="px-5 py-3 flex items-start gap-3">
                <div className="size-9 rounded-lg gradient-brand grid place-items-center text-white"><BellRing className="size-4" /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.body}</div>
                </div>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}
