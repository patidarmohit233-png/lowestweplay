import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, LogOut, Receipt, Coins, Package, X, MessageCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fmt, tierMeta } from "@/lib/loyalty";
import lowestweplayAvatarAsset from "@/assets/lowestweplay-avatar.png.asset.json";


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
      const res = await supabase.rpc("get_customer_profile" as any, { p_weplay_id: buyer.user_id } as any);
      if (!alive) return;
      const userRow = (Array.isArray(res.data) ? res.data[0] : res.data) as any;
      setStats({
        total_coins: userRow?.total_coins ?? 0,
        bonus_coins: userRow?.bonus_coins ?? 0,
        loyalty_tier: userRow?.loyalty_tier ?? "bronze",
        orders: userRow?.order_count ?? 0
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
  const initials = buyer?.name?.trim()?.slice(0, 1).toUpperCase() || "P";

  return (
    <div ref={ref} className="relative z-[70] flex items-center justify-center">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        className="relative w-11 h-11 md:w-12 md:h-12 rounded-full grid place-items-center text-primary-foreground font-extrabold shadow-card border border-primary/20 active:scale-[0.94] transition-all overflow-hidden"
        style={{ background: "white" }}>
        {open ? (
          <X size={20} strokeWidth={2.6} className="text-primary" />
        ) : (
          <img 
            src="https://i.ibb.co/nHvSPfQ/logo.png" 
            alt="Lowest WePlay profile" 
            className="w-full h-full object-cover"
          />
        )}
      </button>



      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-[-0.5rem] md:right-0 top-[calc(100%+0.75rem)] w-[18rem] max-w-[calc(100vw-1.5rem)] rounded-[1.5rem] border border-border/70 bg-card/80 backdrop-blur-2xl shadow-elevated overflow-hidden origin-top-right">

            <div className="px-4 py-4 bg-gradient-to-br from-primary/12 via-primary/[0.05] to-transparent border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-2xl overflow-hidden border border-primary/20 bg-white">
                  <img src="https://i.ibb.co/nHvSPfQ/logo.png" alt="Lowest WePlay profile" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-extrabold text-foreground truncate">{buyer.name}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground truncate">{buyer.game} ID: {buyer.user_id}</p>

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
              <a href="https://wa.me/qr/REB67MGOYBTDB1" target="_blank" rel="noreferrer"
              aria-label="Chat with 24/7 support on WhatsApp"
              className="w-full rounded-2xl border border-accent/30 bg-accent/10 px-3 py-3 text-left text-foreground active:scale-[0.97] transition-transform">
                <span className="flex items-center gap-3">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground shadow-sm">
                    <MessageCircle size={23} strokeWidth={2.2} />
                    <Phone size={10} strokeWidth={3} className="absolute" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.1em]">WhatsApp Support</span>
                    <span className="mt-0.5 block text-[10px] font-semibold text-muted-foreground">24/7 · Chat with our team</span>
                  </span>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                </span>
              </a>
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
