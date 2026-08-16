import { useEffect, useMemo, useState } from "react";
import { useNoindex } from "@/hooks/use-noindex";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Search, Users, Package, IndianRupee, BarChart3, Plus, Trash2, Edit3, BookOpen, FileCode, Clock, CheckCircle, Send } from "lucide-react";
import { generateSitemapXml } from "@/lib/sitemap-generator";




type Order = {
  id: string;
  order_code: string;
  lowest weplay_id: string;
  lowest weplay_name: string;
  product_name: string;
  price: number;
  coins_amount?: number;
  status: string;
  transaction_id: string | null;
  upi_id: string | null;
  created_at: string;
};

type Customer = {
  lowest weplay_id: string;
  name: string;
  created_at: string;
  last_active: string;
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
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"orders" | "customers" | "analytics" | "blogs">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [query, setQuery] = useState("");


  useEffect(() => {
    document.title = "Admin Dashboard · Lowest Weplay";
    loadAll().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setRefreshing(true);
    const [o, c, a, b] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("blog_posts").select("*").order("published_at", { ascending: false })
    ]);
    setRefreshing(false);
    
    if (o.error) return toast({ title: "Failed to load orders", description: o.error.message, variant: "destructive" });
    if (c.error) return toast({ title: "Failed to load customers", description: c.error.message, variant: "destructive" });
    if (b.error) return toast({ title: "Failed to load blogs", description: b.error.message, variant: "destructive" });
    
    setOrders((o.data ?? []) as any[]);
    setCustomers((c.data ?? []) as any[]);
    setAnalytics((a.data ?? []) as any[]);
    setBlogs((b.data ?? []) as any[]);

  };

  const changeStatus = async (id: string, status: string) => {
    const prev = orders;
    setOrders((list) => list.map((o) => o.id === id ? { ...o, status } : o));
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
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
      (statusFilter === "all" || o.status === statusFilter) && (
      !q || o.lowest weplay_id.toLowerCase().includes(q) || o.order_code?.toLowerCase().includes(q) || (o.transaction_id ?? "").toLowerCase().includes(q))
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, statusFilter, query]);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = customers.filter((c) => !q || c.lowest weplay_id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat icon={<Users size={14} />} label="Total users" value={customers.length.toString()} />
          <Stat icon={<Package size={14} />} label="Total orders" value={orders.length.toString()} />
          <Stat icon={<IndianRupee size={14} />} label="Revenue (completed)" value={`₹${revenue.toLocaleString()}`} />
          <Stat icon={<BarChart3 size={14} />} label="Conversions (Verified)" value={orders.filter(o => o.status !== 'failed').length.toString()} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="inline-flex p-1 rounded-xl bg-secondary/70 border border-border">
            {(["orders", "customers", "analytics", "blogs"] as const).map((t) =>
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
            {tab === "blogs" ? (
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
                      
                      supabase.from("blog_posts").insert({
                        title, 
                        slug, 
                        content, 
                        excerpt, 
                        category: 'Updates', 
                        status: 'draft',
                        author: 'Admin'
                      }).then(({ error }) => {
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

                                    supabase.from("blog_posts").update(updates).eq("id", b.id).then(({ error }) => {
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
                                    supabase.from("blog_posts").delete().eq("id", b.id).then(({ error }) => {
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
                      <th className="text-left px-4 py-3">Paid To (UPI)</th>
                      <th className="text-left px-4 py-3">Txn ID</th>
                      <th className="text-left px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 &&
                      <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No orders found.</td></tr>
                    }
                    {filteredOrders.map((o) =>
                      <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/40">
                        <td className="px-4 py-3 font-bold whitespace-nowrap">{o.order_code}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(o.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-muted-foreground">{o.lowest weplay_id}</div>
                          <div className="text-[10px] text-muted-foreground/60">{o.lowest weplay_name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{o.product_name}</td>
                        <td className="px-4 py-3 text-right font-bold font-price">₹{o.price}</td>
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
                            aria-label={`Status for order ${o.order_code}`}
                            className={`px-2 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider capitalize ${STATUS_STYLES[o.status] ?? "bg-secondary text-muted-foreground border-border"}`}>
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
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
                        <td className="px-4 py-3 font-semibold">{e.lowest weplay_id || '—'}</td>
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
                      <tr key={c.lowest weplay_id} className="border-t border-border/60 hover:bg-secondary/40">
                        <td className="px-4 py-3 font-semibold">{c.lowest weplay_id}</td>
                        <td className="px-4 py-3">{c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(c.last_active).toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold">{orders.filter((o) => o.lowest weplay_id === c.lowest weplay_id).length}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

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
