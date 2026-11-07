import { useEffect, useMemo, useRef, useState } from "react";
import { useNoindex } from "@/hooks/use-noindex";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Search, Users, Package, IndianRupee, BarChart3, Plus, Trash2, Edit3, BookOpen, FileCode, Clock, CheckCircle, Send, Eye, Copy, X, Bell, Star } from "lucide-react";
import LiveVisitorsPanel from "@/components/admin/LiveVisitorsPanel";
import BuyClicksPanel from "@/components/admin/BuyClicksPanel";
import { generateSitemapXml } from "@/lib/sitemap-generator";
import { paymentMethodLabel } from "@/lib/payment-methods";




type Order = {
  id: string;
  order_code: string;
  weplay_id: string;
  weplay_name: string;
  lowestweplay_id?: string;
  lowestweplay_name?: string;
  product_name: string;
  price: number;
  coins_amount?: number;
  status: string;
  transaction_id: string | null;
  payment_method?: string | null;
  upi_id: string | null;
  created_at: string;
  failure_reason?: string | null;
  refund_requested?: boolean;
  refund_requested_at?: string | null;
};

type Customer = {
  weplay_id: string;
  weplay_name: string;
  lowestweplay_id?: string;
  name?: string;
  created_at: string;
  last_active: string;
};

type CustomerReview = {
  id: string;
  weplay_id: string;
  weplay_name: string;
  review_text: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_at: string | null;
};


const STATUSES = ["pending", "processing", "hold", "completed", "failed", "refunded", "refund_rejected"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-sky-100 text-sky-700 border-sky-200",
  hold: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  refunded: "bg-violet-100 text-violet-700 border-violet-200",
  refund_rejected: "bg-rose-100 text-rose-700 border-rose-200"
};

export default function Admin() {
  useNoindex();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"orders" | "customers" | "analytics" | "blogs" | "reviews">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [viewCode, setViewCode] = useState<Order | null>(null);
  const [newCount, setNewCount] = useState(0);
  const knownPaid = useRef<Set<string> | null>(null);

  const playAlert = () => {
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new Ctx();
      [0, 0.25, 0.5].forEach((t) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.25, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.2);
      });
      navigator.vibrate?.([200, 100, 200]);
    } catch {}
  };

  const notifyNew = (list: Order[]) => {
    const paid = list.filter((o) => o.transaction_id);
    if (knownPaid.current === null) { knownPaid.current = new Set(paid.map((o) => o.id)); return; }
    const fresh = paid.filter((o) => !knownPaid.current!.has(o.id));
    if (!fresh.length) return;
    fresh.forEach((o) => knownPaid.current!.add(o.id));
    setNewCount((n) => n + fresh.length);
    playAlert();
    const f = fresh[0];
    toast({ title: `🔔 New order received${fresh.length > 1 ? ` (${fresh.length})` : ""}`, description: `${f.product_name} · ₹${f.price} · ID ${f.weplay_id}` });
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("New order - Lowest WePlay", { body: `${f.product_name} · ₹${f.price}` });
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    const refetch = async () => {
      const res = await supabase.rpc("get_all_orders" as any);
      const data = (Array.isArray(res.data) ? res.data : res.data ? [res.data] : []) as any[];
      if (!res.error) { setOrders(data); notifyNew(data); }
    };
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => refetch())
      .subscribe();
    const iv = setInterval(refetch, 20000);
    return () => { supabase.removeChannel(ch); clearInterval(iv); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = newCount ? `(${newCount}) New order! · Admin` : "Admin Dashboard · Lowest Weplay";
  }, [newCount]);


  useEffect(() => {
    document.title = "Admin Dashboard · Lowest Weplay";
    loadAll().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setRefreshing(true);
    const [o, c, a, b, r] = await Promise.all([
      supabase.rpc("get_all_orders" as any),
      supabase.rpc("get_all_customers" as any),
      supabase.rpc("get_recent_analytics" as any, { p_limit: 200 } as any),
      supabase.rpc("get_all_blog_posts" as any),
      supabase.rpc("get_all_customer_reviews")
    ]);
    setRefreshing(false);
    
    if (o.error) return toast({ title: "Failed to load orders", description: o.error.message, variant: "destructive" });
    if (c.error) return toast({ title: "Failed to load customers", description: c.error.message, variant: "destructive" });
    if (b.error) return toast({ title: "Failed to load blogs", description: b.error.message, variant: "destructive" });
    
    setOrders((o.data ?? []) as any[]);
    notifyNew((o.data ?? []) as any[]);
    setCustomers((c.data ?? []) as any[]);
    setAnalytics((a.data ?? []) as any[]);
    setBlogs((b.data ?? []) as any[]);
    if (r.error) {
      toast({ title: "Failed to load reviews", description: r.error.message, variant: "destructive" });
    } else {
      setReviews((r.data ?? []) as CustomerReview[]);
    }

  };

  const setReviewStatus = async (review: CustomerReview, status: "approved" | "rejected") => {
    const action = status === "approved" ? "approve" : "reject";
    if (!window.confirm(`${action === "approve" ? "Publish" : "Reject"} ${review.weplay_name}'s review?`)) return;
    const previous = reviews;
    setReviews((items) => items.map((item) => item.id === review.id ? { ...item, status, reviewed_at: new Date().toISOString() } : item));
    const { error } = await supabase.rpc("admin_set_customer_review_status", {
      p_review_id: review.id,
      p_status: status,
    });
    if (error) {
      setReviews(previous);
      toast({ title: "Could not update review", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: status === "approved" ? "Review approved" : "Review rejected", description: status === "approved" ? "It is now visible on the website." : "It will not be shown publicly." });
  };

  const changeStatus = async (id: string, status: string) => {
    let reason: string | null = null;
    if (["hold", "failed", "refunded"].includes(status)) {
      const current = orders.find((o) => o.id === id);
      reason = window.prompt(
        `Reason for ${status} — the customer will see this on their profile:`,
        current?.failure_reason || ""
      );
      if (reason === null) return; // admin cancelled
    }
    const prev = orders;
    setOrders((list) => list.map((o) => o.id === id ? { ...o, status, failure_reason: reason ?? o.failure_reason } : o));
    const { data, error } = await supabase.rpc("update_order_status" as any, { p_order_id: id, p_status: status, p_reason: reason } as any);
    if (error || data === false) {
      setOrders(prev);
      toast({ title: "Update failed", description: data === false ? "₹479 plans cannot be marked as refunded." : error?.message ?? "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: `Status set to ${status}`, description: reason ? `Reason saved: ${reason}` : undefined });
  };

  const deleteOrder = async (o: Order) => {
    if (!window.confirm(`Delete order ${o.order_code}? This removes it from ${o.weplay_id || "the customer"}'s profile too, and their loyalty coins are recalculated.`)) return;
    const prev = orders;
    setOrders((list) => list.filter((x) => x.id !== o.id));
    const { error } = await supabase.rpc("admin_delete_order" as any, { p_order_id: o.id } as any);
    if (error) {
      setOrders(prev);
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Order deleted", description: "Removed from the customer's profile and loyalty coins recalculated." });
  };

  const editReason = async (o: Order) => {
    const reason = window.prompt(
      `Edit the reason for order ${o.order_code} — the customer sees this on their profile (edit anytime, not just once):`,
      o.failure_reason || ""
    );
    if (reason === null) return; // admin cancelled
    if (!reason.trim()) {
      toast({ title: "Reason cannot be empty", variant: "destructive" });
      return;
    }
    const prev = orders;
    setOrders((list) => list.map((x) => x.id === o.id ? { ...x, failure_reason: reason.trim() } : x));
    const { error } = await supabase.rpc("admin_update_refund_reason" as any, { p_order_id: o.id, p_reason: reason } as any);
    if (error) {
      setOrders(prev);
      toast({ title: "Could not save reason", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Reason updated", description: `Customer now sees: ${reason.trim()}` });
  };

  const reviewRefund = async (o: Order, approve: boolean) => {
    const action = approve ? "approve" : "reject";
    const reason = window.prompt(
      approve
        ? `Reason for APPROVING the refund of order ${o.order_code} — required, the customer will see this:`
        : `Reason for REJECTING the refund of order ${o.order_code} — required, the customer will see this:`
    );
    if (reason === null) return; // admin cancelled
    if (!reason.trim()) {
      toast({ title: "Reason is required", description: `Write a reason to ${action} this refund.`, variant: "destructive" });
      return;
    }
    const prev = orders;
    setOrders((list) => list.map((x) => x.id === o.id
      ? { ...x, status: approve ? "refunded" : "refund_rejected", failure_reason: reason.trim(), refund_requested: !approve }
      : x));
    const { data, error } = await supabase.rpc("admin_review_refund" as any, { p_order_id: o.id, p_approve: approve, p_reason: reason } as any);
    if (error || data === false) {
      setOrders(prev);
      toast({ title: "Could not review refund", description: data === false ? "Refund approvals are unavailable for ₹479 plans." : error?.message ?? "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: approve ? "Refund approved ✓" : "Refund rejected", description: `Customer sees: ${reason.trim()}` });
  };


  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) =>
      (statusFilter === "all" || o.status === statusFilter) && (
      !q || (o.weplay_id || o.lowestweplay_id || "").toLowerCase().includes(q) || o.order_code?.toLowerCase().includes(q) || (o.transaction_id ?? "").toLowerCase().includes(q))
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, statusFilter, query]);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = customers.filter((c) => !q || (c.weplay_id || c.lowestweplay_id || "").toLowerCase().includes(q) || (c.weplay_name || c.name || "").toLowerCase().includes(q));
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [customers, query]);

  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + Number(o.price || 0), 0);


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
            <button 
              onClick={async () => {
                const xml = await generateSitemapXml();
                const blob = new Blob([xml], { type: 'text/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sitemap.xml';
                a.click();
                toast({ title: "Sitemap Generated", description: "Download started. Upload this to your public folder." });
              }}
              className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-1.5 hover:border-primary/40"
            >
              <FileCode size={14} /> <span className="hidden md:inline">Export Sitemap</span>
            </button>
            <button onClick={loadAll} disabled={refreshing}

              className="px-3 py-2 rounded-lg border border-border bg-card text-sm font-semibold inline-flex items-center gap-1.5 hover:border-primary/40 disabled:opacity-50">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <LiveVisitorsPanel />
        <BuyClicksPanel />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat icon={<Users size={14} />} label="Total users" value={customers.length.toString()} />
          <Stat icon={<Package size={14} />} label="Total orders" value={orders.length.toString()} />
          <Stat icon={<IndianRupee size={14} />} label="Revenue (completed)" value={`₹${revenue.toLocaleString()}`} />
          <Stat icon={<BarChart3 size={14} />} label="Conversions (Verified)" value={orders.filter(o => o.status !== 'failed').length.toString()} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="inline-flex p-1 rounded-xl bg-secondary/70 border border-border">
            {(["orders", "customers", "analytics", "blogs", "reviews"] as const).map((t) =>
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold capitalize transition-all ${tab === t ? "bg-card shadow-card" : "text-muted-foreground"}`}>
                {t}
              </button>
            )}
          </div>

          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Lowest WePlay ID, order ID or transaction ID"
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
            {tab === "reviews" ? (
              <div className="p-4">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-display">Customer Reviews</h2>
                    <p className="text-xs text-muted-foreground">New reviews remain private until approved.</p>
                  </div>
                  <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-bold text-warning-foreground">
                    {reviews.filter((review) => review.status === "pending").length} awaiting review
                  </span>
                </div>
                {reviews.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">No customer reviews submitted yet.</div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <article key={review.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold">{review.weplay_name}</h3>
                              <span className="text-xs text-muted-foreground">ID {review.weplay_id}</span>
                              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                review.status === "approved" ? "border-accent/30 bg-accent/10 text-accent" :
                                review.status === "rejected" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                                "border-warning/30 bg-warning/10 text-warning-foreground"
                              }`}>{review.status}</span>
                            </div>
                            <div className="mt-2 flex items-center gap-0.5 text-warning" aria-label={`${review.rating} out of 5 stars`}>
                              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} />)}
                            </div>
                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{review.review_text}</p>
                            <p className="mt-2 text-[11px] text-muted-foreground">Submitted {new Date(review.created_at).toLocaleString()}</p>
                          </div>
                          {review.status === "pending" && (
                            <div className="flex shrink-0 gap-2">
                              <button onClick={() => setReviewStatus(review, "approved")} className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-bold text-accent hover:bg-accent/15 active:scale-[0.97]">
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button onClick={() => setReviewStatus(review, "rejected")} className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/25 bg-destructive/5 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 active:scale-[0.97]">
                                <X size={14} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ) : tab === "blogs" ? (
              <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-display">Content Workflow</h2>
                    <p className="text-xs text-muted-foreground">Draft, schedule, and approve daily blog posts.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const title = prompt("Post Title:");
                      if (!title) return;
                      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                      const content = prompt("Post Content:");
                      const excerpt = prompt("Excerpt:");
                      
                      supabase.rpc("admin_save_blog_post" as any, {
                        p_post: {
                          title,
                          slug,
                          content,
                          excerpt,
                          category: 'Updates',
                          status: 'draft',
                          author: 'Admin'
                        }
                      } as any).then(({ error }) => {
                        if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                        else { toast({ title: "Draft Created" }); loadAll(); }
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2"
                  >
                    <Plus size={16} /> New Draft
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <div className="bg-card border border-border/60 p-4 rounded-2xl">
                     <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1 font-bold">
                       <BookOpen size={14} /> Total Posts
                     </div>
                     <div className="text-2xl font-display">{blogs.length}</div>
                   </div>
                   <div className="bg-card border border-border/60 p-4 rounded-2xl">
                     <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1 font-bold">
                       <Clock size={14} /> Scheduled
                     </div>
                     <div className="text-2xl font-display text-amber-500">{blogs.filter(b => b.status === 'scheduled').length}</div>
                   </div>
                   <div className="bg-card border border-border/60 p-4 rounded-2xl">
                     <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-1 font-bold">
                       <CheckCircle size={14} /> Published
                     </div>
                     <div className="text-2xl font-display text-emerald-500">{blogs.filter(b => b.status === 'published').length}</div>
                   </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                      <tr>
                        <th className="text-left px-4 py-3">Title</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Publish Date</th>
                        <th className="text-right px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogs.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No posts yet.</td></tr>}
                      {blogs.map((b) => (
                        <tr key={b.id} className="border-t border-border/60 hover:bg-secondary/40">
                          <td className="px-4 py-3 font-semibold">{b.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              b.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                              b.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                              'bg-secondary text-muted-foreground'
                            }`}>
                              {b.status || 'draft'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {b.status === 'scheduled' ? new Date(b.scheduled_at).toLocaleDateString() : 
                             b.published_at ? new Date(b.published_at).toLocaleDateString() : 'Draft'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.status === 'draft' && (
                                <button 
                                  onClick={() => {
                                    const dateStr = prompt("Schedule for (YYYY-MM-DD) or leave empty for immediate:", new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                                    const status = dateStr ? 'scheduled' : 'published';
                                    const updates: any = { status };
                                    if (dateStr) {
                                      updates.scheduled_at = new Date(dateStr).toISOString();
                                    } else {
                                      updates.published_at = new Date().toISOString();
                                    }

                                    supabase.rpc("admin_save_blog_post" as any, { p_post: { id: b.id, ...updates } } as any).then(({ error }) => {
                                      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                                      else { toast({ title: `Post ${status}` }); loadAll(); }
                                    });
                                  }}
                                  className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                                  title="Approve & Schedule"
                                >
                                  <Send size={16} />
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  if (confirm("Delete this post?")) {
                                    supabase.rpc("admin_delete_blog_post" as any, { p_id: b.id } as any).then(({ error }) => {
                                      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                                      else { toast({ title: "Deleted" }); loadAll(); }
                                    });
                                  }
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : tab === "orders" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">Order ID</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">User ID</th>
                      <th className="text-left px-4 py-3">Plan</th>
                      <th className="text-right px-4 py-3">Amount</th>
                      <th className="text-left px-4 py-3">Payment option</th>
                      <th className="text-left px-4 py-3">Voucher code</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 &&
                      <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No orders found.</td></tr>
                    }
                    {filteredOrders.map((o) =>
                      <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/40">
                        <td className="px-4 py-3 font-bold whitespace-nowrap">{o.order_code}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-muted-foreground">{o.weplay_id || o.lowestweplay_id}</div>
                          <div className="text-[10px] text-muted-foreground/60">{o.weplay_name || o.lowestweplay_name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{o.product_name}</td>
                        <td className="px-4 py-3 text-right font-bold font-price">₹{o.price}</td>
                        <td className="px-4 py-3 text-xs font-semibold">{paymentMethodLabel(o.payment_method)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-start gap-1">
                            {o.transaction_id ?
                              <button onClick={() => setViewCode(o)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold whitespace-nowrap active:scale-[0.97]">
                                <Eye size={13} /> View Code
                              </button> :
                              <span className="text-muted-foreground">—</span>}
                            <span className="text-[10px] text-muted-foreground">{paymentMethodLabel(o.payment_method)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <select
                              value={o.status}
                              onChange={(e) => changeStatus(o.id, e.target.value)}
                              aria-label={`Status for order ${o.order_code}`}
                              className={`px-2 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider capitalize ${STATUS_STYLES[o.status] ?? "bg-secondary text-muted-foreground border-border"}`}>
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {o.refund_requested && !["refunded", "refund_rejected"].includes(o.status) &&
                              <span className="px-2 py-0.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-[9px] font-bold uppercase tracking-wider">Refund requested</span>
                            }
                            {o.status === "refund_rejected" &&
                              <span className="px-2 py-0.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-[9px] font-bold uppercase tracking-wider">Refund rejected</span>
                            }
                            {o.failure_reason && ["hold", "failed", "refunded", "refund_rejected"].includes(o.status) &&
                              <span className="text-[10px] text-muted-foreground max-w-[180px] break-words" title={o.failure_reason}>“{o.failure_reason}”</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            {o.refund_requested && !["refunded", "refund_rejected"].includes(o.status) &&
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => reviewRefund(o, true)}
                                  aria-label={`Approve refund for order ${o.order_code}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 active:scale-[0.97] transition-all">
                                  <CheckCircle size={13} /> Approve refund
                                </button>
                                <button
                                  onClick={() => reviewRefund(o, false)}
                                  aria-label={`Reject refund for order ${o.order_code}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 text-[11px] font-bold hover:bg-rose-100 active:scale-[0.97] transition-all">
                                  <X size={13} /> Reject refund
                                </button>
                              </div>
                            }
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => editReason(o)}
                                aria-label={`Edit reason for order ${o.order_code}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground text-[11px] font-bold hover:bg-secondary active:scale-[0.97] transition-all">
                                <Edit3 size={13} /> {o.failure_reason ? "Edit reason" : "Add reason"}
                              </button>
                              <button
                                onClick={() => deleteOrder(o)}
                                aria-label={`Delete order ${o.order_code}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-[11px] font-bold hover:bg-rose-50 active:scale-[0.97] transition-all">
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : tab === "analytics" ? (
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">Event</th>
                      <th className="text-left px-4 py-3">Lowest WePlay ID</th>
                      <th className="text-left px-4 py-3">Metadata</th>
                      <th className="text-left px-4 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No events recorded.</td></tr>}
                    {analytics.map((e, idx) => (
                      <tr key={idx} className="border-t border-border/60 hover:bg-secondary/40">
                        <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{e.event_name}</span></td>
                        <td className="px-4 py-3 font-semibold">{e.weplay_id || e.lowestweplay_id || '—'}</td>
                        <td className="px-4 py-3 text-[11px] text-muted-foreground max-w-[300px] truncate">{JSON.stringify(e.metadata)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">Lowest WePlay ID</th>
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
                      <tr key={c.weplay_id || c.lowestweplay_id} className="border-t border-border/60 hover:bg-secondary/40">
                        <td className="px-4 py-3 font-semibold">{c.weplay_id || c.lowestweplay_id}</td>
                        <td className="px-4 py-3">{c.weplay_name || c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.last_active).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold">{orders.filter((o) => (o.weplay_id || o.lowestweplay_id) === (c.weplay_id || c.lowestweplay_id)).length}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </main>
    
      {viewCode &&
        <div className="fixed inset-0 z-[200] bg-foreground/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6" onClick={() => setViewCode(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl border border-border p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{paymentMethodLabel(viewCode.payment_method)}</p>
                <p className="text-sm font-bold mt-1">#{viewCode.order_code} · {viewCode.product_name} · ₹{viewCode.price}</p>
                <p className="text-xs text-muted-foreground mt-0.5">ID {viewCode.weplay_id} · {viewCode.weplay_name}</p>
              </div>
              <button onClick={() => setViewCode(null)} aria-label="Close" className="w-9 h-9 shrink-0 rounded-full bg-secondary grid place-items-center"><X size={16} /></button>
            </div>
            <div className="mt-4 rounded-2xl border-2 border-primary/30 bg-secondary/60 p-4 font-mono text-lg md:text-xl font-bold tracking-wider break-all whitespace-pre-wrap select-all text-foreground">
              {viewCode.transaction_id}
            </div>
            <button
              onClick={async () => { await navigator.clipboard.writeText(viewCode.transaction_id || ""); toast({ title: "Code copied ✓" }); }}
              className="mt-4 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold inline-flex items-center justify-center gap-2 active:scale-[0.97]">
              <Copy size={16} /> Copy Code
            </button>
          </div>
        </div>
      }
    </div>);

}

function Stat({ label, value, icon }: {label: string;value: string;icon?: React.ReactNode;}) {
  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-4">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">{icon}{label}</div>
      <div className="text-xl md:text-2xl font-display mt-1">{value}</div>
    </div>);
}
