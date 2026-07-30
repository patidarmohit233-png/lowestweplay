import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogOut, RefreshCw, ShieldCheck } from "lucide-react";

type Order = {
  id: string;
  weplay_id: string;
  weplay_name: string;
  email: string;
  phone: string | null;
  product_id: string;
  product_name: string;
  price: number;
  status: string;
  created_at: string;
};

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Admin Dashboard · Lowest Weplay";
    let mounted = true;

    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/admin/auth", { replace: true });
        return;
      }
      const user = sessionData.session.user;
      if (mounted) setUserEmail(user.email ?? null);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = !!roles?.some((r) => r.role === "admin");
      if (!mounted) return;
      setAuthorized(isAdmin);
      setLoading(false);
      if (isAdmin) loadOrders();
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin/auth", { replace: true });
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOrders = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setRefreshing(false);
    if (error) return toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setOrders((data ?? []) as Order[]);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/auth", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background text-foreground px-4">
        <div className="max-w-md text-center bg-card border border-border rounded-2xl p-8">
          <ShieldCheck className="mx-auto mb-3 text-destructive" size={32} />
          <h1 className="text-2xl font-display mb-2">Access denied</h1>
          <p className="text-muted-foreground text-sm mb-1">Signed in as <span className="font-bold text-foreground">{userEmail}</span></p>
          <p className="text-muted-foreground text-sm mb-6">This account does not have admin privileges.</p>
          <button onClick={signOut} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:opacity-90">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-display leading-none">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{userEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadOrders} disabled={refreshing}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-1.5 hover:border-primary/40 disabled:opacity-50">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
            <button onClick={signOut} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 hover:opacity-90">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label="Total orders" value={orders.length.toString()} />
          <Stat label="Pending" value={orders.filter((o) => o.status === "pending").length.toString()} />
          <Stat label="Completed" value={orders.filter((o) => o.status === "completed").length.toString()} />
          <Stat label="Revenue (₹)" value={orders.reduce((s, o) => s + (o.price || 0), 0).toLocaleString()} />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">WePlay ID</th>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Phone</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No orders yet.</td></tr>
                )}
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/40">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold">{o.weplay_id}</td>
                    <td className="px-4 py-3">{o.weplay_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.phone || "—"}</td>
                    <td className="px-4 py-3">{o.product_name}</td>
                    <td className="px-4 py-3 text-right font-bold">₹{o.price}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        o.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        o.status === "pending" ? "bg-amber-100 text-amber-700" :
                        "bg-secondary text-muted-foreground"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-display mt-1">{value}</div>
    </div>
  );
}
