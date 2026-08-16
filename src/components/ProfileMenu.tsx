import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Receipt, Coins, Package, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fmt, tierMeta } from "@/lib/loyalty";

type VerifiedBuyer = { game: string; user_id: string; name: string };
type Stats = { total_coins: number; bonus_coins: number; loyalty_tier: string; orders: number };

export default function ProfileMenu({ buyer, onLogout }: { buyer: VerifiedBuyer; onLogout: () => void }) {

  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    (async () => {
      const [{ data: c }, { count }] = await Promise.all([
        supabase.from("customers").select("total_coins,bonus_coins,loyalty_tier").eq("weplay_id", buyer.user_id).maybeSingle(),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("weplay_id", buyer.user_id)

      ]);
      if (!alive) return;
      setStats({
        total_coins: c?.total_coins ?? 0,
        bonus_coins: c?.bonus_coins ?? 0,
        loyalty_tier: c?.loyalty_tier ?? "bronze",
        orders: count ?? 0
      });
    })();
    return () => {alive = false;};
  }, [open, buyer.user_id]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const tier = tierMeta(stats?.loyalty_tier ?? "bronze");
  const initials = buyer.name.trim().slice(0, 1).toUpperCase() || "P";

  return (
    <div ref={ref} className="fixed top-[56px] right-3 md:top-[72px] md:right-6 z-[70]">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        className="relative w-11 h-11 md:w-12 md:h-12 rounded-full grid place-items-center text-primary-foreground font-extrabold shadow-primary border border-primary-foreground/20 active:scale-[0.94] transition-transform"
        style={{ background: "var(--gradient-primary)" }}>
        {open ? <X size={18} strokeWidth={2.6} /> : <span className="text-[15px]">{initials}</span>}
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent border-2 border-background" />
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 mt-3 w-[19rem] max-w-[calc(100vw-1.5rem)] rounded-[1.5rem] border border-border/70 bg-card/80 backdrop-blur-2xl shadow-elevated overflow-hidden">

            <div className="px-4 py-4 bg-gradient-to-br from-primary/12 via-primary/[0.05] to-transparent border-b border-border/60">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 shrink-0 rounded-2xl grid place-items-center text-primary-foreground font-extrabold" style={{ background: "var(--gradient-primary)" }}>
                  <User size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-extrabold text-foreground truncate">{buyer.weplay_name}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground truncate">ID: {buyer.weplay_id}</p>
                </div>
              </div>
              <span className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9.5px] font-extrabold uppercase tracking-[0.14em] ${tier.chip}`}>
                {tier.label} Tier
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3">
              {[
            { icon: <Coins size={13} />, k: "Coins Purchased", v: fmt(stats?.total_coins ?? 0) },
            { icon: <Package size={13} />, k: "Total Orders", v: fmt(stats?.orders ?? 0) }].
            map((s) =>
            <div key={s.k} className="rounded-2xl border border-border bg-secondary/60 px-3 py-2.5">
                  <p className="inline-flex items-center gap-1 text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{s.icon}{s.k}</p>
                  <p className="text-[15px] font-extrabold text-foreground mt-0.5">{s.v}</p>
                </div>
            )}
              {(stats?.bonus_coins ?? 0) > 0 &&
            <div className="col-span-2 rounded-2xl border border-accent/25 bg-accent/8 px-3 py-2.5">
                  <p className="text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Bonus Coins Earned</p>
                  <p className="text-[15px] font-extrabold text-accent mt-0.5">+{fmt(stats!.bonus_coins)}</p>
                </div>
            }
            </div>

            <div className="p-3 pt-0 space-y-2">
              <Link to="/my-account" onClick={() => setOpen(false)}
              className="w-full py-3 rounded-2xl text-primary-foreground font-extrabold text-[11px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              style={{ background: "var(--gradient-primary)" }}>
                <Receipt size={14} /> My Orders
              </Link>
              <button onClick={() => {setOpen(false);onLogout();}}
              className="w-full py-3 rounded-2xl bg-secondary border border-border text-foreground font-extrabold text-[11px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
