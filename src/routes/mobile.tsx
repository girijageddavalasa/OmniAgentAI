import { createFileRoute, Link } from "@tanstack/react-router";
import { useJourney, getProduct } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight, Heart, ShoppingBag, Clock, Smartphone, Wifi, BatteryMedium, Signal } from "lucide-react";

export const Route = createFileRoute("/mobile")({
  head: () => ({ meta: [{ title: "Mobile App — OmniAgent AI" }] }),
  component: Mobile,
});

function Mobile() {
  const j = useJourney();
  const viewed = getProduct(j.viewedProductId) || getProduct("nike-airmax")!;
  const wished = j.wishlist.map(id => getProduct(id)!).filter(Boolean);

  return (
    <div>
      <PageHeader
        eyebrow="Customer · Mobile App"
        title="Continue your journey"
        description="The mobile app picks up exactly where the website left off — same product, same size, same intent."
      />

      <div className="grid lg:grid-cols-[420px_1fr] gap-8 items-start">
        {/* Phone mockup */}
        <div className="mx-auto w-full max-w-[380px]">
          <div className="relative rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-28 bg-zinc-900 rounded-b-2xl z-10" />
            <div className="bg-gradient-to-b from-indigo-50 to-white h-[680px] overflow-y-auto">
              {/* Status bar */}
              <div className="flex items-center justify-between text-[11px] px-6 pt-3 pb-1 text-zinc-700">
                <span>9:41</span>
                <div className="flex items-center gap-1"><Signal className="size-3" /><Wifi className="size-3" /><BatteryMedium className="size-3.5" /></div>
              </div>
              <div className="px-5 pt-3">
                <div className="text-[10px] uppercase tracking-wider text-brand font-semibold">Welcome back</div>
                <div className="text-lg font-semibold leading-tight">{j.customer.name.split(" ")[0]}, ready to continue?</div>
                <div className="mt-1 text-xs text-muted-foreground">Journey synced from web · just now</div>

                {/* Continue card */}
                <div className="mt-4 rounded-2xl border bg-white shadow-soft overflow-hidden">
                  <div className={`h-32 bg-gradient-to-br ${viewed.color} flex items-center justify-center`}>
                    <div className="text-6xl animate-float">{viewed.image}</div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{viewed.brand}</div>
                    <div className="font-semibold text-sm">{viewed.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground">Size: <span className="font-medium text-foreground">{j.selectedSize || "—"}</span></div>
                      <div className="text-sm font-semibold">₹{viewed.price.toLocaleString("en-IN")}</div>
                    </div>
                    <button onClick={() => j.logEvent("Continue On Mobile", "Mobile", `${viewed.name}`)} className="mt-3 w-full rounded-lg gradient-brand text-white text-xs font-medium py-2 flex items-center justify-center gap-1.5">
                      Continue Shopping <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cart / wishlist */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border bg-white p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><ShoppingBag className="size-3" /> Cart</div>
                    <div className="text-xl font-semibold mt-1">{j.cart.length}</div>
                  </div>
                  <div className="rounded-xl border bg-white p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"><Heart className="size-3" /> Wishlist</div>
                    <div className="text-xl font-semibold mt-1">{wished.length}</div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recent activity</div>
                  <div className="space-y-1.5">
                    {j.events.slice(-5).reverse().map(e => (
                      <div key={e.id} className="flex items-start gap-2 text-xs">
                        <Clock className="size-3 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium">{e.label}</div>
                          {e.detail && <div className="text-muted-foreground text-[10px]">{e.detail}</div>}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{e.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-6" />
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <Smartphone className="size-3" /> OmniAgent AI Mobile · iOS 17 preview
          </div>
        </div>

        {/* Context panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Journey Continuity Agent</div>
            <h3 className="mt-1 text-lg font-semibold">Context transferred from Website → Mobile</h3>
            <p className="text-sm text-muted-foreground mt-1">Below is the exact state handed off. Nothing is lost between channels.</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Kv k="Last viewed" v={`${viewed.brand} ${viewed.name}`} />
              <Kv k="Selected size" v={j.selectedSize || "—"} />
              <Kv k="Price" v={`₹${viewed.price.toLocaleString("en-IN")}`} />
              <Kv k="Cart items" v={String(j.cart.length)} />
              <Kv k="Wishlist" v={String(wished.length)} />
              <Kv k="Session events" v={String(j.events.length)} />
            </dl>
          </div>

          <div className="rounded-2xl border glass-card p-5">
            <div className="text-sm font-semibold mb-2">Next best action</div>
            <p className="text-sm text-muted-foreground">A size you wanted is in stock at <span className="font-medium text-foreground">Store A — Phoenix Mall</span>. Want us to prep an associate?</p>
            <Link to="/store" className="mt-4 inline-flex rounded-lg gradient-brand text-white px-4 py-2 text-sm font-medium items-center gap-1.5">
              Walk into the store <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="font-medium truncate">{v}</div>
    </div>
  );
}
