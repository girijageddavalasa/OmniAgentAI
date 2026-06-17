import { createFileRoute } from "@tanstack/react-router";
import { useJourney, getProduct, PRODUCTS } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Search, Sparkles, IndianRupee, Ruler, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/associate")({
  head: () => ({ meta: [{ title: "Sales Associate — OmniAgent AI" }] }),
  component: Associate,
});

function Associate() {
  const j = useJourney();
  const viewed = getProduct(j.viewedProductId) || getProduct("nike-airmax")!;
  const cart = j.cart.map(c => ({ ...c, product: getProduct(c.productId)! }));
  const recommendations = PRODUCTS.filter(p => p.category === viewed.category && p.id !== viewed.id).slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Operations · Associate Console"
        title="Customer brief — Rahul's view"
        description="Everything the associate needs to assist this customer in seconds. All context is transferred from Website and Mobile."
      />

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
        {/* Customer card */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white grid place-items-center font-semibold text-lg">
                {j.customer.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">{j.customer.name}</div>
                <div className="text-xs text-muted-foreground">{j.customer.tier} · LTV ₹84,200</div>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-1 font-semibold">In store</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat icon={<Ruler className="size-4" />} label="Preferred size" value={j.selectedSize || "9 / M"} />
              <Stat icon={<IndianRupee className="size-4" />} label="Budget" value="₹8k – ₹18k" />
              <Stat icon={<ShoppingBag className="size-4" />} label="Cart" value={`${j.cart.length} item${j.cart.length === 1 ? "" : "s"}`} />
              <Stat icon={<Sparkles className="size-4" />} label="Affinity" value={viewed.brand} />
            </div>

            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recent searches</div>
              <div className="flex flex-wrap gap-1.5">
                {["running shoes", "nike air max", "size 9", "phoenix mall store", "ultraboost"].map(t => (
                  <span key={t} className="text-xs rounded-full bg-muted px-2 py-1 flex items-center gap-1"><Search className="size-3" /> {t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border glass-card p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Channel transfer log</div>
            <ul className="mt-3 space-y-2 text-sm">
              {["Website session captured", "Mobile app context synced", "Geofence triggered at Phoenix Mall", "Associate Rahul briefed by Store Agent"].map(s => (
                <li key={s} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /> {s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interest + recos */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Interested product</div>
            <div className="mt-3 grid sm:grid-cols-[160px_1fr] gap-4 items-center">
              <div className={`h-36 rounded-xl bg-gradient-to-br ${viewed.color} grid place-items-center`}>
                <div className="text-6xl animate-float">{viewed.image}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{viewed.brand}</div>
                <div className="text-lg font-semibold">{viewed.name}</div>
                <div className="mt-1 text-sm">Preferred size: <b>{j.selectedSize || "9"}</b></div>
                <div className="mt-1 text-sm">Available at: <b>Rack B12 (2 in stock)</b></div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg gradient-brand text-white px-3 py-2 text-sm font-medium">Bring to fitting room</button>
                  <button className="rounded-lg border bg-background hover:bg-muted px-3 py-2 text-sm">Show alternates</button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Recommendations from AI</div>
              <span className="text-xs text-muted-foreground">Updated 2s ago</span>
            </div>
            <div className="mt-3 grid sm:grid-cols-3 gap-3">
              {recommendations.map(r => (
                <div key={r.id} className="rounded-xl border bg-background p-3">
                  <div className={`h-20 rounded-md bg-gradient-to-br ${r.color} grid place-items-center text-3xl`}>{r.image}</div>
                  <div className="text-xs text-muted-foreground mt-2">{r.brand}</div>
                  <div className="text-sm font-medium leading-tight">{r.name}</div>
                  <div className="text-sm font-semibold mt-1">₹{r.price.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Cart from web/mobile</div>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-2">No items in cart yet — customer is still browsing.</p>
            ) : (
              <ul className="mt-3 divide-y">
                {cart.map((c, i) => (
                  <li key={i} className="py-2 flex items-center gap-3">
                    <div className={`size-10 rounded-md bg-gradient-to-br ${c.product.color} grid place-items-center text-xl`}>{c.product.image}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.product.name}</div>
                      <div className="text-xs text-muted-foreground">Size {c.size}{c.reason ? ` · ${c.reason}` : ""}</div>
                    </div>
                    <div className="text-sm font-semibold">₹{c.product.price.toLocaleString("en-IN")}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">{icon} {label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
