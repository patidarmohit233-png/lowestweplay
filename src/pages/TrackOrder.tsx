import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Loader2, Package, ArrowLeft, LogIn } from "lucide-react";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type TrackedOrder = {
  id: string;
  order_id: string;
  user_id: string;
  plan: string;
  amount: string;
  status: string;
  transaction_id: string | null;
  upi_id: string | null;
  created_at: string;
};

export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-sky-100 text-sky-700 border-sky-200",
  hold: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  refunded: "bg-violet-100 text-violet-700 border-violet-200",
  refund_rejected: "bg-rose-100 text-rose-700 border-rose-200"
};

export default function TrackOrder() {
  const [id, setId] = useState(() => {
    try {
      const raw = localStorage.getItem("lw_verified_buyer");
      return raw ? (JSON.parse(raw).user_id as string) : "";
    } catch {return "";}
  });
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = id.trim();
    if (value.length < 3) {
      toast({ title: "Enter your Lowest WePlay ID", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await supabase.rpc("get_customer_orders" as any, { p_weplay_id: value } as any);
    setLoading(false);
    if (res.error) {
      toast({ title: "Could not load orders", description: res.error.message, variant: "destructive" });
      return;
    }
    const rows = (Array.isArray(res.data) ? res.data : res.data ? [res.data] : []) as any[];
    setOrders(rows.map((r) => ({
      id: r.order_code ?? "",
      order_id: r.order_code ?? "",
      user_id: value,
      plan: r.product_name ?? "",
      amount: String(r.price ?? ""),
      status: r.status ?? "",
      transaction_id: r.transaction_id ?? null,
      upi_id: null,
      created_at: r.created_at
    })));
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Seo
        title="Track Order | Lowest WePlay Top-Up Status"
        description="Check the live status of your Lowest WePlay recharge or Red Packet order by entering your WePlay ID."
        path="/track-order" />

      <header className="border-b border-border/60 bg-card/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-[10px] font-extrabold uppercase tracking-[0.18em]">
            <Package size={12} /> Order Tracking
          </span>
          <h1 className="text-2xl md:text-4xl font-display mt-4">Track your orders</h1>
          <p className="text-muted-foreground text-[13px] md:text-base mt-2 max-w-lg mx-auto leading-relaxed">
            Your Lowest WePlay ID is your customer ID — no login or password needed.
          </p>
        </div>

        <form onSubmit={search} className="flex flex-col md:flex-row gap-2.5 max-w-xl mx-auto">
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your Lowest WePlay ID"
            className="flex-1 px-4 py-3.5 rounded-2xl border border-border bg-secondary/60 text-base focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-card transition-all" />

          <button type="submit" disabled={loading}
            className="py-3.5 px-6 rounded-2xl font-extrabold text-[11.5px] uppercase tracking-[0.14em] text-primary-foreground inline-flex items-center justify-center gap-2 active:scale-[0.96] transition-all disabled:opacity-70"
            style={{ background: "var(--gradient-primary)" }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Track
          </button>
        </form>

        {orders !== null && orders.length > 0 &&
        <div className="mt-6 flex justify-center">
            <Link to={`/my-account?id=${encodeURIComponent(id.trim())}`}
              className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl border border-primary/25 bg-primary/8 text-primary font-extrabold text-[11px] uppercase tracking-[0.14em] active:scale-[0.96] transition-transform">
              <LogIn size={13} /> Login to My Account
            </Link>
          </div>
        }

        {orders !== null &&
        <div className="mt-8 space-y-3">
            {orders.length === 0 &&
          <p className="text-center text-muted-foreground text-sm py-10">No orders found for this Lowest WePlay ID yet.</p>
          }
            {orders.map((o, i) =>
          <motion.div key={o.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}
            className="card-premium rounded-2xl p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Order {o.order_id}</div>
                    <h2 className="text-[15px] md:text-lg font-extrabold mt-0.5 truncate">{o.plan}</h2>
                    <p className="text-[11.5px] text-muted-foreground mt-1">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[9.5px] font-extrabold uppercase tracking-wider ${STATUS_STYLES[o.status] ?? "bg-secondary text-muted-foreground border-border"}`}>
                    {o.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <div><span className="text-muted-foreground block">Amount</span><span className="font-extrabold font-price">₹{o.amount}</span></div>
                  <div><span className="text-muted-foreground block">Status</span><span className="font-extrabold uppercase">{o.status}</span></div>
                  <div className="min-w-0"><span className="text-muted-foreground block">Txn ID</span><span className="font-extrabold truncate block">{o.transaction_id || "Not added"}</span></div>
                </div>
              </motion.div>
          )}
          </div>
        }
      </main>
    </div>);

}