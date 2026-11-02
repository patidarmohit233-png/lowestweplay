import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MousePointerClick, ShoppingCart, BadgeCheck, KeyRound } from "lucide-react";

type Click = { id: string; event_name: string; weplay_id: string | null; url: string | null; created_at: string | null; metadata: any };

const EVENT_META: Record<string, { label: string; cls: string; icon: JSX.Element }> = {
  click_buy_now: { label: "Buy click", cls: "bg-primary/10 text-primary border-primary/20", icon: <MousePointerClick size={10} /> },
  payment_started: { label: "Payment open", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: <ShoppingCart size={10} /> },
  payment_verified: { label: "Verified", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <BadgeCheck size={10} /> },
  verification_started: { label: "ID verify", cls: "bg-sky-100 text-sky-700 border-sky-200", icon: <KeyRound size={10} /> }
};

const ago = (iso: string) => {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const planOf = (e: Click) => e.metadata?.product_name || e.metadata?.product_id || "";

export default function BuyClicksPanel() {
  const [events, setEvents] = useState<Click[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await supabase.rpc("get_buy_clicks" as any, { p_limit: 500 } as any);
      if (res.error) return;
      setEvents((Array.isArray(res.data) ? res.data : res.data ? [res.data] : []) as Click[]);
    };
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return events;
    return events.filter((e) => (e.weplay_id || "").toLowerCase().includes(s) || planOf(e).toLowerCase().includes(s));
  }, [events, q]);

  const topPlans = useMemo(() => {
    const counts = new Map<string, number>();
    events.filter((e) => e.event_name === "click_buy_now").forEach((e) => {
      const p = planOf(e);
      if (p) counts.set(p, (counts.get(p) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [events]);

  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="font-display text-base inline-flex items-center gap-2">
          <MousePointerClick size={16} /> Plan clicks &amp; payments
          <span className="text-xs font-normal text-muted-foreground">(7 days)</span>
        </h2>
        <div className="relative">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="WePlay ID / plan"
            className="pl-2.5 pr-2 py-1 rounded-lg border border-border bg-background text-base md:text-xs w-36" />
        </div>
      </div>

      {topPlans.length > 0 &&
      <div className="flex flex-wrap gap-2 mb-3">
          {topPlans.map(([plan, n]) =>
          <span key={plan} className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary text-[10px] font-extrabold uppercase tracking-wider">
              {plan} · {n}
            </span>
        )}
        </div>
      }

      <div className="max-h-80 overflow-auto divide-y divide-border">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No buy clicks yet.</p>}
        {filtered.map((e) => {
          const m = EVENT_META[e.event_name] || { label: e.event_name, cls: "bg-secondary text-muted-foreground border-border", icon: null };
          return (
            <div key={e.id} className="py-2 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {planOf(e) || m.label}
                  <span className={`ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider align-middle ${m.cls}`}>
                    {m.icon}{m.label}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {e.weplay_id || "Guest (not verified)"} · {e.url || "/"}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{e.created_at ? ago(e.created_at) : ""}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
