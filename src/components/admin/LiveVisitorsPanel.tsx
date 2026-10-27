import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Radio, History, Search } from "lucide-react";

type Live = { key: string; weplay_id: string | null; name: string | null; path: string; host: string; since: string; at: string };
type View = { id: string; weplay_id: string | null; url: string | null; created_at: string | null; metadata: any };

const ago = (iso: string) => {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export default function LiveVisitorsPanel() {
  const [live, setLive] = useState<Live[]>([]);
  const [views, setViews] = useState<View[]>([]);
  const [q, setQ] = useState("");
  const [, tick] = useState(0);

  useEffect(() => {
    const ch = supabase.channel("live-visitors");
    const sync = () => {
      const st = ch.presenceState() as Record<string, any[]>;
      const list: Live[] = Object.entries(st).map(([key, metas]) => {
        const m = metas[metas.length - 1] || {};
        return { key, weplay_id: m.weplay_id ?? null, name: m.name ?? null, path: m.path ?? "/", host: m.host ?? "", since: m.since ?? new Date().toISOString(), at: m.at ?? new Date().toISOString() };
      });
      list.sort((a, b) => (b.weplay_id ? 1 : 0) - (a.weplay_id ? 1 : 0));
      setLive(list);
    };
    ch.on("presence", { event: "sync" }, sync).on("presence", { event: "join" }, sync).on("presence", { event: "leave" }, sync).subscribe();
    const t = setInterval(() => tick((n) => n + 1), 5000);
    return () => { clearInterval(t); supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await supabase.rpc("get_recent_analytics" as any, { p_limit: 500 } as any);
      const data = (Array.isArray(res.data) ? res.data : res.data ? [res.data] : []) as View[];
      setViews(data || []);
    };
    load();
    const iv = setInterval(load, 15000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return views;
    return views.filter((v) => (v.weplay_id || "").toLowerCase().includes(s) || (v.metadata?.name || "").toLowerCase().includes(s) || (v.url || "").toLowerCase().includes(s));
  }, [views, q]);

  const verified = live.filter((l) => l.weplay_id).length;

  return (
    <section className="mb-8 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-70 animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
            Live visitors
          </h2>
          <span className="text-xs text-muted-foreground"><b className="text-foreground">{live.length}</b> online · {verified} with ID</span>
        </div>
        <div className="max-h-80 overflow-auto divide-y divide-border">
          {live.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No one on the site right now.</p>}
          {live.map((l) => (
            <div key={l.key} className="py-2 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-semibold truncate">{l.weplay_id ? `${l.weplay_id}${l.name ? ` · ${l.name}` : ""}` : "Guest (not verified)"}</p>
                <p className="text-xs text-muted-foreground truncate"><Radio size={10} className="inline mr-1" />{l.path} · {l.host}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">on site {ago(l.since)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h2 className="font-display text-base inline-flex items-center gap-2"><History size={16} /> Visit history (7 days)</h2>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="WePlay ID / page"
              className="pl-6 pr-2 py-1 rounded-lg border border-border bg-background text-base md:text-xs w-40" />
          </div>
        </div>
        <div className="max-h-80 overflow-auto divide-y divide-border">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No visits yet.</p>}
          {filtered.map((v) => (
            <div key={v.id} className="py-2 flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-semibold truncate">{v.weplay_id ? `${v.weplay_id}${v.metadata?.name ? ` · ${v.metadata.name}` : ""}` : "Guest"}</p>
                <p className="text-xs text-muted-foreground truncate">{v.url} · {v.metadata?.host || ""}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{v.created_at ? `${ago(v.created_at)} ago` : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
