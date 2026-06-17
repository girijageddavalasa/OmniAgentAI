import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PRODUCTS, useJourney, type Product } from "@/lib/journey-store";
import { PageHeader } from "@/components/PageHeader";
import { FeedbackBar } from "@/components/FeedbackBar";
import {
  Search, Star, Heart, ShoppingCart, Zap, MapPin, BellRing, PackageCheck, X, Sparkles, Truck,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shop — OmniAgent AI" },
      { name: "description", content: "Browse the OmniAgent AI demo storefront — every action is tracked and handed off across channels by AI agents." },
    ],
  }),
  component: Shop,
});

const CART_REASONS = ["Comparing Products", "Need Family Approval", "Waiting For Salary", "Unsure About Size", "Planning To Buy Later"];

function Shop() {
  const j = useJourney();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Product["category"]>("All");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [unavailableModal, setUnavailableModal] = useState<{ product: Product; size: string } | null>(null);
  const [cartReasonFor, setCartReasonFor] = useState<{ product: Product; size: string } | null>(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      (!query || `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, category]);

  const onSelectSize = (product: Product, size: string) => {
    j.setViewed(product.id);
    j.setSelectedSize(size);
    j.logEvent("Size Selected", "Website", `${product.brand} ${product.name} • Size ${size}`);
    const inStock = (product.sizes.find(s => s.label === size)?.stock ?? 0) > 0;
    if (!inStock) {
      const key = `${product.name} / Size ${size}`;
      j.recordUnavailable(key);
      j.logEvent("Size Unavailable", "Website", key);
      j.triggerAgentChoreography(`${product.brand} ${product.name}`, size);
      setUnavailableModal({ product, size });
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Customer · Website"
        title="Shop the new arrivals"
        description="A live demo storefront. Every click, view and out-of-stock event is captured and routed to AI agents across the platform."
        actions={
          <div className="hidden md:flex items-center gap-2 rounded-full glass-card px-3 py-1.5 text-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-muted-foreground">Journey tracking active for</span>
            <span className="font-medium">{j.customer.name}</span>
          </div>
        }
      />

      {/* Hero search */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-950 via-violet-900 to-slate-900 text-white p-6 md:p-8 mb-6">
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.18em] text-white/60 flex items-center gap-2">
              <Sparkles className="size-3.5" /> Continue your journey
            </div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Never restart shopping again.
            </h2>
            <p className="mt-2 text-sm text-white/70 max-w-lg">
              Find what you love — if a size is gone, our AI agents instantly find it nearby, reserve it, and prep an associate before you arrive.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur ring-1 ring-white/15 px-3">
              <Search className="size-4 text-white/70" />
              <input
                value={query}
                onChange={e => { setQuery(e.target.value); if (e.target.value) j.logEvent("Search Product", "Website", `query: ${e.target.value}`); }}
                placeholder="Search shoes, electronics, apparel..."
                className="flex-1 bg-transparent py-3 text-sm placeholder:text-white/50 outline-none"
              />
              <kbd className="text-[10px] text-white/50 border border-white/20 rounded px-1.5 py-0.5">⌘K</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {(["All", "Shoes", "Electronics", "Clothing"] as const).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm border transition ${
              category === c ? "gradient-brand text-white border-transparent shadow-md" : "bg-card hover:bg-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => (
          <ProductCard key={p.id} p={p} onView={() => { setOpenProduct(p); j.setViewed(p.id); j.logEvent("View Product", "Website", `${p.brand} ${p.name}`); }} onWish={() => { j.toggleWishlist(p.id); toast.success(j.wishlist.includes(p.id) ? "Removed from wishlist" : "Added to wishlist"); }} wished={j.wishlist.includes(p.id)} />
        ))}
      </div>

      <div className="mt-8">
        <FeedbackBar context="Browsing experience" />
      </div>

      {/* Product detail modal */}
      {openProduct && (
        <Modal onClose={() => setOpenProduct(null)}>
          <ProductDetail
            p={openProduct}
            onSelectSize={(size) => onSelectSize(openProduct, size)}
            onAdd={(size) => { setCartReasonFor({ product: openProduct, size }); }}
            onBuy={(size) => { onSelectSize(openProduct, size); const stock = openProduct.sizes.find(s => s.label === size)?.stock ?? 0; if (stock > 0) { j.addToCart(openProduct.id, size); j.logEvent("Purchase", "Website", `${openProduct.name} • Size ${size}`); toast.success("Order placed!"); setOpenProduct(null); }}}
          />
        </Modal>
      )}

      {/* Unavailable / AI modal */}
      {unavailableModal && (
        <Modal onClose={() => setUnavailableModal(null)}>
          <AIUnavailable
            product={unavailableModal.product}
            size={unavailableModal.size}
            onNotify={() => { j.subscribeRestock(`${unavailableModal.product.brand} ${unavailableModal.product.name}`, unavailableModal.size); j.logEvent("Restock Alert Scheduled", "AI"); toast.success("Restock alert active"); setUnavailableModal(null); }}
            onReserve={() => { j.logEvent("Product Reserved", "AI", "Reserved at Store A"); toast.success("Reserved at Store A — hold for 24h"); setUnavailableModal(null); }}
            onVisit={() => { j.logEvent("Store Recommendation", "AI", "Recommended Store A"); window.location.href = "/store"; }}
          />
        </Modal>
      )}

      {/* Cart reason modal */}
      {cartReasonFor && (
        <Modal onClose={() => setCartReasonFor(null)}>
          <div className="p-6">
            <div className="text-xs uppercase tracking-wider text-brand font-semibold mb-1">Cart Intelligence</div>
            <h3 className="text-xl font-semibold">Why are you adding this to cart?</h3>
            <p className="text-sm text-muted-foreground mt-1">Helps our agents understand intent — not a barrier to buying.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CART_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    j.addToCart(cartReasonFor.product.id, cartReasonFor.size, r);
                    j.logEvent("Add To Cart", "Website", `${cartReasonFor.product.name} • ${r}`);
                    toast.success(`Added — reason logged: ${r}`);
                    setCartReasonFor(null);
                  }}
                  className="rounded-lg border bg-card px-3 py-3 text-sm text-left hover:bg-muted hover:border-primary/40 transition"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProductCard({ p, onView, onWish, wished }: { p: Product; onView: () => void; onWish: () => void; wished: boolean }) {
  return (
    <div className="group rounded-2xl border bg-card overflow-hidden shadow-soft hover:shadow-lg transition-all hover:-translate-y-0.5">
      <div className={`relative h-44 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
        <div className="text-7xl drop-shadow-lg animate-float">{p.image}</div>
        <button onClick={onWish} className="absolute top-3 right-3 size-9 rounded-full bg-white/90 hover:bg-white grid place-items-center shadow">
          <Heart className={`size-4 ${wished ? "fill-rose-500 stroke-rose-500" : "stroke-zinc-700"}`} />
        </button>
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-black/50 backdrop-blur text-white px-2 py-1 rounded-full">{p.brand}</div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Star className="size-3 fill-amber-400 stroke-amber-500" /> {p.rating}
              <span className="mx-1">·</span> {p.category}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold">₹{p.price.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 justify-end"><Truck className="size-3" /> Free delivery</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.sizes.slice(0, 5).map(s => (
            <span key={s.label} className={`text-[11px] rounded-md px-2 py-1 border ${s.stock === 0 ? "line-through text-muted-foreground/60" : "bg-muted"}`}>{s.label}</span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onView} className="rounded-lg border bg-background hover:bg-muted py-2 text-sm font-medium flex items-center justify-center gap-1.5"><ShoppingCart className="size-4" /> View</button>
          <button onClick={onView} className="rounded-lg gradient-brand text-white py-2 text-sm font-medium flex items-center justify-center gap-1.5"><Zap className="size-4" /> Buy</button>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ p, onSelectSize, onAdd, onBuy }: { p: Product; onSelectSize: (s: string) => void; onAdd: (s: string) => void; onBuy: (s: string) => void }) {
  const [size, setSize] = useState<string | null>(null);
  return (
    <div className="grid md:grid-cols-2 gap-0">
      <div className={`bg-gradient-to-br ${p.color} h-72 md:h-full flex items-center justify-center`}>
        <div className="text-[140px] animate-float drop-shadow-2xl">{p.image}</div>
      </div>
      <div className="p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.brand} · {p.category}</div>
        <h3 className="text-2xl font-semibold mt-1">{p.name}</h3>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <Star className="size-4 fill-amber-400 stroke-amber-500" /> {p.rating} · 2,481 reviews
        </div>
        <div className="text-2xl font-semibold mt-3">₹{p.price.toLocaleString("en-IN")}</div>

        <div className="mt-5">
          <div className="text-sm font-medium mb-2">Select size</div>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map(s => {
              const oos = s.stock === 0;
              const active = size === s.label;
              return (
                <button
                  key={s.label}
                  onClick={() => { setSize(s.label); onSelectSize(s.label); }}
                  className={`relative min-w-12 rounded-lg border px-3 py-2 text-sm transition ${
                    active ? "border-primary ring-2 ring-primary/30" : oos ? "border-dashed text-muted-foreground" : "hover:border-primary/40"
                  }`}
                >
                  {s.label}
                  {oos && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-rose-500" />}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Sizes with a red dot are out of stock — AI agents will find alternatives instantly.</div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button disabled={!size} onClick={() => size && onAdd(size)} className="rounded-lg border bg-background hover:bg-muted py-2.5 text-sm font-medium disabled:opacity-40">Add to Cart</button>
          <button disabled={!size} onClick={() => size && onBuy(size)} className="rounded-lg gradient-brand text-white py-2.5 text-sm font-medium disabled:opacity-40">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

function AIUnavailable({ product, size, onNotify, onReserve, onVisit }: { product: Product; size: string; onNotify: () => void; onReserve: () => void; onVisit: () => void }) {
  return (
    <div className="p-6 md:p-7">
      <div className="flex items-start gap-3">
        <div className="size-11 rounded-xl gradient-brand grid place-items-center glow-ring">
          <Sparkles className="size-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.16em] text-brand font-semibold">Agent Activated</div>
          <h3 className="text-xl font-semibold">Inventory Intelligence Agent</h3>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{product.brand} {product.name}</span> in size <span className="font-medium text-foreground">{size}</span> is unavailable online. Here's what we found:
          </p>
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        <StoreSuggestion name="Store A — Phoenix Mall" distance="2 km away" stock={2} eta="20 min drive" highlight />
        <StoreSuggestion name="Store B — Linking Road" distance="5 km away" stock={1} eta="35 min drive" />
      </div>

      <div className="mt-4 rounded-xl border bg-amber-50/60 px-4 py-3 flex items-center gap-3 text-sm">
        <PackageCheck className="size-5 text-amber-600" />
        <div>
          <span className="font-medium">Expected restock:</span> Tomorrow, 11:00 AM (online warehouse)
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button onClick={onNotify} className="rounded-lg border bg-card hover:bg-muted py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"><BellRing className="size-4" /> Notify Me</button>
        <button onClick={onReserve} className="rounded-lg border bg-card hover:bg-muted py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"><PackageCheck className="size-4" /> Reserve</button>
        <button onClick={onVisit} className="rounded-lg gradient-brand text-white py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"><MapPin className="size-4" /> Visit Store</button>
      </div>
    </div>
  );
}

function StoreSuggestion({ name, distance, stock, eta, highlight }: { name: string; distance: string; stock: number; eta: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "bg-card"}`}>
      <div className="flex items-center gap-2 text-sm font-medium"><MapPin className="size-4 text-brand" /> {name}</div>
      <div className="text-xs text-muted-foreground mt-1">{distance} · {eta}</div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5">{stock} in stock</span>
        {highlight && <span className="text-[10px] uppercase tracking-wider text-brand font-semibold">Recommended</span>}
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl overflow-hidden border">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 size-8 grid place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"><X className="size-4" /></button>
        {children}
      </div>
    </div>
  );
}
