import { useEffect, useMemo, useState } from "react";
import { useNoindex } from "@/hooks/use-noindex";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Search, Users, Package, IndianRupee } from "lucide-react";


type Order = {
  id: string;
  order_id: string;
  game: string;
  user_id: string;
  plan: string;
  amount: number;
  status: string;
  transaction_id: string | null;
  upi_id: string | null;
  created_at: string;
};

type Customer = {
  id: string;
  game: string;
  user_id: string;
  name: string;
  created_at: string;
  last_active: string;
  total_coins: number;
  bonus_coins: number;
  loyalty_tier: string;
};


const STATUSES = ["pending", "processing", "hold", "completed", "failed"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-sky-100 text-sky-700 border-sky-200",
  hold: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200"
};

export default function Admin() {
  useNoindex();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"orders" | "customers">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Admin Dashboard · Lowest Weplay";
    loadAll().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setRefreshing(true);
    const [o, c] = await Promise.all([
    supabase.from("orders" as any).select("*").order("created_at", { ascending: false }),
    supabase.from("users" as any).select("*").order("created_at", { ascending: false })]


    );
    setRefreshing(false);
    if (o.error) return toast({ title: "Failed to load orders", description: o.error.message, variant: "destructive" });
    setOrders((o.data ?? []) as any[]);
    setCustomers((c.data ?? []) as any[]);

  };

  const changeStatus = async (id: string, status: string) => {
    const prev = orders;
    setOrders((list) => list.map((o) => o.id === id ? { ...o, status } : o));
    const { error } = await supabase.from("orders" as any).update({ status }).eq("id", id);
    if (error) {
      setOrders(prev);
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Status set to ${status}` });
  };


  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) =>
      o.game === "WePlay" &&
      (statusFilter === "all" || o.status === statusFilter) && (
      !q || o.user_id.toLowerCase().includes(q) || o.order_id?.toLowerCase().includes(q) || (o.transaction_id ?? "").toLowerCase().includes(q))
    );

  }, [orders, statusFilter, query]);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => !q || c.user_id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [customers, query]);

  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + Number(o.amount || 0), 0);


  if (loading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>);

  }



  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-display leading-none">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Private link · do not share</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} disabled={refreshing}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-1.5 hover:border-primary/40 disabled:opacity-50">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> <span className="hidden md:inline">Refresh</span>
            </button>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat icon={<Users size={14} />} label="Total users" value={customers.length.toString()} />
          <Stat icon={<Package size={14} />} label="Total orders" value={orders.length.toString()} />
          <Stat icon={<IndianRupee size={14} />} label="Revenue (completed)" value={`₹${revenue.toLocaleString()}`} />
          <Stat icon={<RefreshCw size={14} />} label="Pending + Processing" value={orders.filter((o) => o.status === "pending" || o.status === "processing").length.toString()} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="inline-flex p-1 rounded-xl bg-secondary/70 border border-border">
            {(["orders", "customers"] as const).map((t) =>
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold capitalize transition-all ${tab === t ? "bg-card shadow-card" : "text-muted-foreground"}`}>
                {t}
              </button>
            )}
          </div>

          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search WePlay ID, order ID or transaction ID"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/25" />
          </div>

          {tab === "orders" &&
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold capitalize">
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          }
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            {tab === "orders" ?
            <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Order ID</th>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">User ID</th>
                    <th className="text-left px-4 py-3">Game</th>
                    <th className="text-left px-4 py-3">Plan</th>
                    <th className="text-right px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Paid To (UPI)</th>
                    <th className="text-left px-4 py-3">Txn ID</th>

                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 &&
                <tr><td colSpan={10} className="px-4 py-10 text-center text-muted-foreground">No orders found.</td></tr>
                }
                  {filteredOrders.map((o) =>
                <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/40">
                      <td className="px-4 py-3 font-bold whitespace-nowrap">{o.order_id}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{o.user_id}</div>
                      </td>
                      <td className="px-4 py-3 font-bold">{o.game}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{o.plan}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{o.amount}</td>
                      <td className="px-4 py-3 max-w-[190px]">
                        {o.upi_id ?
                    <span className="inline-block px-2 py-1 rounded-md bg-secondary border border-border text-[11px] font-bold break-all">{o.upi_id}</span> :
                    <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{o.transaction_id || "—"}</td>

                      <td className="px-4 py-3">
                        <select
                      value={o.status}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      aria-label={`Status for order ${o.order_id}`}
                      className={`px-2 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider capitalize ${STATUS_STYLES[o.status] ?? "bg-secondary text-muted-foreground border-border"}`}>
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                )}
                </tbody>
              </table> :

            <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Game</th>
                    <th className="text-left px-4 py-3">User ID</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Verified on</th>
                    <th className="text-left px-4 py-3">Last active</th>

                    <th className="text-right px-4 py-3">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 &&
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No verified users found.</td></tr>
                }
                  {filteredCustomers.map((c) =>
                <tr key={c.id} className="border-t border-border/60 hover:bg-secondary/40">
                      <td className="px-4 py-3 font-bold">{c.game}</td>
                      <td className="px-4 py-3 font-semibold">{c.user_id}</td>
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.last_active).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold">{orders.filter((o) => o.user_id === c.user_id && o.game === c.game).length}</td>

                    </tr>
                )}
                </tbody>
              </table>
            }
          </div>
        </div>
      </main>
    </div>);

}

function Stat({ label, value, icon }: {label: string;value: string;icon?: React.ReactNode;}) {
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">{icon}{label}</div>
      <div className="text-xl md:text-2xl font-display mt-1">{value}</div>
    </div>);

}
