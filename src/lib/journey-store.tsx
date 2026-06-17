import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Channel = "Website" | "Mobile" | "Store" | "AI" | "Analytics";

export interface JourneyEvent {
  id: string;
  time: string;
  label: string;
  channel: Channel;
  detail?: string;
}

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  time: string;
}

export interface CartItem {
  productId: string;
  size: string;
  reason?: string;
}

export interface Feedback {
  id: string;
  context: string;
  rating: number;
  comment?: string;
  time: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "Shoes" | "Electronics" | "Clothing";
  price: number;
  rating: number;
  image: string;
  sizes: { label: string; stock: number }[];
  color: string;
}

export const PRODUCTS: Product[] = [
  { id: "nike-airmax", name: "Air Max 270", brand: "Nike", category: "Shoes", price: 12995, rating: 4.7, color: "from-rose-500 to-orange-400", image: "👟",
    sizes: [{ label: "7", stock: 3 }, { label: "8", stock: 5 }, { label: "9", stock: 0 }, { label: "10", stock: 2 }, { label: "11", stock: 0 }] },
  { id: "adidas-ub", name: "Ultraboost 22", brand: "Adidas", category: "Shoes", price: 16999, rating: 4.6, color: "from-zinc-700 to-zinc-400", image: "👟",
    sizes: [{ label: "7", stock: 0 }, { label: "8", stock: 4 }, { label: "9", stock: 2 }, { label: "10", stock: 0 }, { label: "11", stock: 1 }] },
  { id: "puma-vel", name: "Velocity Nitro", brand: "Puma", category: "Shoes", price: 8999, rating: 4.4, color: "from-sky-500 to-cyan-400", image: "👟",
    sizes: [{ label: "7", stock: 2 }, { label: "8", stock: 0 }, { label: "9", stock: 3 }, { label: "10", stock: 4 }, { label: "11", stock: 2 }] },
  { id: "apple-airpods", name: "AirPods Pro 2", brand: "Apple", category: "Electronics", price: 24900, rating: 4.8, color: "from-slate-200 to-slate-400", image: "🎧",
    sizes: [{ label: "One", stock: 6 }] },
  { id: "samsung-buds", name: "Galaxy Buds 3", brand: "Samsung", category: "Electronics", price: 14999, rating: 4.5, color: "from-violet-500 to-fuchsia-400", image: "🎧",
    sizes: [{ label: "One", stock: 4 }] },
  { id: "sony-wh", name: "WH-1000XM5", brand: "Sony", category: "Electronics", price: 29990, rating: 4.9, color: "from-stone-700 to-stone-400", image: "🎧",
    sizes: [{ label: "One", stock: 2 }] },
  { id: "nike-hoodie", name: "Tech Fleece Hoodie", brand: "Nike", category: "Clothing", price: 7995, rating: 4.5, color: "from-emerald-600 to-teal-400", image: "🧥",
    sizes: [{ label: "S", stock: 3 }, { label: "M", stock: 0 }, { label: "L", stock: 2 }, { label: "XL", stock: 4 }] },
  { id: "adidas-jacket", name: "Originals Jacket", brand: "Adidas", category: "Clothing", price: 9499, rating: 4.4, color: "from-indigo-600 to-blue-400", image: "🧥",
    sizes: [{ label: "S", stock: 2 }, { label: "M", stock: 3 }, { label: "L", stock: 0 }, { label: "XL", stock: 1 }] },
  { id: "puma-tee", name: "Essentials Tee", brand: "Puma", category: "Clothing", price: 1999, rating: 4.2, color: "from-amber-500 to-yellow-400", image: "👕",
    sizes: [{ label: "S", stock: 5 }, { label: "M", stock: 6 }, { label: "L", stock: 4 }, { label: "XL", stock: 0 }] },
];

interface State {
  customer: { name: string; tier: string };
  events: JourneyEvent[];
  agentMessages: AgentMessage[];
  cart: CartItem[];
  wishlist: string[];
  feedback: Feedback[];
  notifications: { id: string; title: string; body: string; time: string }[];
  viewedProductId?: string;
  selectedSize?: string;
  visitedStore: boolean;
  associateAssigned: boolean;
  cartReasons: Record<string, number>;
  unavailableHits: Record<string, number>;
}

interface Ctx extends State {
  logEvent: (label: string, channel: Channel, detail?: string) => void;
  pushAgentMessage: (from: string, to: string, message: string) => void;
  addToCart: (productId: string, size: string, reason?: string) => void;
  toggleWishlist: (productId: string) => void;
  submitFeedback: (context: string, rating: number, comment?: string) => void;
  setViewed: (productId: string) => void;
  setSelectedSize: (size: string) => void;
  recordUnavailable: (key: string) => void;
  enterStore: () => void;
  assignAssociate: () => void;
  subscribeRestock: (productName: string, size: string) => void;
  triggerAgentChoreography: (productName: string, size: string) => void;
}

const JourneyCtx = createContext<Ctx | null>(null);

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const rid = () => Math.random().toString(36).slice(2, 9);

const SEED_EVENTS: JourneyEvent[] = [
  { id: rid(), time: "10:01", label: "Search Product", channel: "Website", detail: "query: running shoes" },
  { id: rid(), time: "10:03", label: "View Product", channel: "Website", detail: "Nike Air Max 270" },
];

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({
    customer: { name: "Aanya Verma", tier: "Gold Member" },
    events: SEED_EVENTS,
    agentMessages: [],
    cart: [],
    wishlist: ["adidas-ub"],
    feedback: [],
    notifications: [],
    visitedStore: false,
    associateAssigned: false,
    cartReasons: {},
    unavailableHits: { "Nike Air Max 270 / Size 9": 18, "Adidas Jacket / Size L": 11, "Puma Tee / Size XL": 7 },
  });

  const api: Ctx = useMemo(() => ({
    ...state,
    logEvent(label, channel, detail) {
      setState(s => ({ ...s, events: [...s.events, { id: rid(), time: nowTime(), label, channel, detail }] }));
    },
    pushAgentMessage(from, to, message) {
      setState(s => ({ ...s, agentMessages: [...s.agentMessages, { id: rid(), from, to, message, time: nowTime() }] }));
    },
    addToCart(productId, size, reason) {
      setState(s => ({
        ...s,
        cart: [...s.cart.filter(c => !(c.productId === productId && c.size === size)), { productId, size, reason }],
        cartReasons: reason ? { ...s.cartReasons, [reason]: (s.cartReasons[reason] || 0) + 1 } : s.cartReasons,
      }));
    },
    toggleWishlist(productId) {
      setState(s => ({ ...s, wishlist: s.wishlist.includes(productId) ? s.wishlist.filter(p => p !== productId) : [...s.wishlist, productId] }));
    },
    submitFeedback(context, rating, comment) {
      setState(s => ({ ...s, feedback: [...s.feedback, { id: rid(), context, rating, comment, time: nowTime() }] }));
    },
    setViewed(productId) { setState(s => ({ ...s, viewedProductId: productId })); },
    setSelectedSize(size) { setState(s => ({ ...s, selectedSize: size })); },
    recordUnavailable(key) {
      setState(s => ({ ...s, unavailableHits: { ...s.unavailableHits, [key]: (s.unavailableHits[key] || 0) + 1 } }));
    },
    enterStore() { setState(s => ({ ...s, visitedStore: true })); },
    assignAssociate() { setState(s => ({ ...s, associateAssigned: true })); },
    subscribeRestock(productName, size) {
      setState(s => ({
        ...s,
        notifications: [...s.notifications, {
          id: rid(),
          title: `${productName} Size ${size} — Restock Alert Active`,
          body: `We'll email you the moment this is back in stock at your nearest store.`,
          time: nowTime(),
        }],
      }));
    },
    triggerAgentChoreography(productName, size) {
      const msgs: [string, string, string][] = [
        ["Journey Continuity Agent", "Inventory Intelligence Agent", `Customer selected unavailable size ${size} for ${productName}.`],
        ["Inventory Intelligence Agent", "Recommendation Agent", `Stock missing locally. Find alternatives + nearest stores.`],
        ["Recommendation Agent", "Store Assistant Agent", `Customer likely interested in nearby physical stock. Prep associate context.`],
        ["Store Assistant Agent", "Notification Agent", `Schedule restock alert and store visit handoff.`],
        ["Notification Agent", "Churn Analysis Agent", `Logging unavailable-size churn signal for ${productName} / ${size}.`],
      ];
      msgs.forEach((m, i) => setTimeout(() => api.pushAgentMessage(m[0], m[1], m[2]), 350 * (i + 1)));
    },
  }), [state]);

  // ambient agent chatter
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.7) {
        const chatter = [
          ["Recommendation Agent", "Journey Continuity Agent", "Updated affinity model with new session signal."],
          ["Inventory Intelligence Agent", "Store Assistant Agent", "Predicted restock at Store A — 11 AM tomorrow."],
          ["Churn Analysis Agent", "Notification Agent", "Risk score nudged: trigger soft re-engagement."],
        ];
        const c = chatter[Math.floor(Math.random() * chatter.length)];
        api.pushAgentMessage(c[0], c[1], c[2]);
      }
    }, 7000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <JourneyCtx.Provider value={api}>{children}</JourneyCtx.Provider>;
}

export function useJourney() {
  const ctx = useContext(JourneyCtx);
  if (!ctx) throw new Error("useJourney must be used within JourneyProvider");
  return ctx;
}

export function getProduct(id?: string) {
  return PRODUCTS.find(p => p.id === id);
}
