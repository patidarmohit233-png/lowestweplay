import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Coins, Crown, Gift, Loader2, LogOut, Package,
  PartyPopper, ShoppingBag, Sparkles, Trophy, UserCheck, Wallet } from
"lucide-react";
import Seo from "@/components/Seo";
import weplayAvatarAsset from "@/assets/weplay-avatar.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MILESTONES, fmt, nextMilestone, tierMeta } from "@/lib/loyalty";
import { STATUS_STYLES } from "@/pages/TrackOrder";

const VERIFY_KEY = "lw_verified_buyer";
const CELEBRATED_KEY = "lw_celebrated_milestones";

type Profile = {
  user_id: string;
  name: string;
  game: string;
  total_coins: number;
  bonus_coins: number;
  loyalty_tier: string;
  milestones_reached: number[] | null;
  order_count: number;
  completed_count: number;
  total_spent: number;
};


type OrderRow = {
  id: string;
  order_id: string;
  plan: string;
  amount: string;
  status: string;
  transaction_id: string | null;
  created_at: string;
};


export default function MyAccount() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryId = params.get("id")?.trim() || "";

  const stored = (() => {
    try {
      const raw = localStorage.getItem(VERIFY_KEY);
      return raw ? (JSON.parse(raw) as { game: string; user_id: string; name: string }) : null;
    } catch {return null;}
  })();

  const activeId = queryId || stored?.user_id || "";

  const [loading, setLoading] = useState(!!activeId);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [celebrate, setCelebrate] = useState<{ coins: number; reward: number } | null>(null);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    const [{ data: p, error: pe }, { data: o }] = await Promise.all([
      (supabase.from("customers" as any).select("*") as any).eq("weplay_id", id).maybeSingle(),
      (supabase.from("orders" as any).select("*") as any).eq("weplay_id", id).order("created_at", { ascending: false })]

    );

    setLoading(false);
    const row = p as any;
    if (pe || !row) {
      toast({ title: "Account not found", description: "Verify your WePlay ID on the homepage first.", variant: "destructive" });
      return;
    }
    setProfile({
      user_id: row.weplay_id,
      name: row.name,
      game: "WePlay",
      total_coins: row.total_coins || 0,
      bonus_coins: row.bonus_coins || 0,
      loyalty_tier: row.loyalty_tier || "bronze",
      milestones_reached: row.milestones_reached || [],
      order_count: (o?.length || 0),
      completed_count: (o?.filter((x: any) => x.status === "completed").length || 0),
      total_spent: (o?.filter((x: any) => x.status === "completed").reduce((s: number, x: any) => s + (Number(x.amount) || 0), 0) || 0)
    });
    setOrders((o ?? []) as OrderRow[]);
    // keep the session logged-in
    localStorage.setItem(VERIFY_KEY, JSON.stringify({ game: "WePlay", user_id: row.weplay_id, name: row.name }));

    // milestone celebration (once per milestone per device)
    const reached: number[] = Array.isArray(row.milestones_reached) ? row.milestones_reached : [];
    let seen: number[] = [];
    try {seen = JSON.parse(localStorage.getItem(CELEBRATED_KEY) || "[]");} catch {seen = [];}
    const fresh = reached.find((m) => !seen.includes(m));
    if (fresh) {
      const ms = MILESTONES.find((m) => m.coins === fresh);
      if (ms) setCelebrate(ms);
      localStorage.setItem(CELEBRATED_KEY, JSON.stringify([...seen, fresh]));
    }
  }, []);

  useEffect(() => {
    if (activeId) load(activeId);
  }, [activeId, load]);

  const logout = () => {
    localStorage.removeItem(VERIFY_KEY);
    toast({ title: "Logged out", description: "Verify again anytime with your WePlay ID." });
    navigate("/");
  };

  const purchased = profile?.total_coins ?? 0;
  const bonus = profile?.bonus_coins ?? 0;
  const tier = tierMeta(profile?.loyalty_tier ?? "bronze");
  const next = useMemo(() => nextMilestone(purchased), [purchased]);
  const progress = next ? Math.min(100, purchased / next.coins * 100) : 100;
  const reached: number[] = Array.isArray(profile?.milestones_reached) ? profile!.milestones_reached as number[] : [];

  if (!activeId) {
    return (
      <div className="min-h-dvh bg-background text-foreground grid place-items-center px-5">
        <Seo title="My Account — Lowest Weplay" description="Your Lowest Weplay account: lifetime coins, loyalty tier and full order history." path="/my-account" />
        <div className="card-premium rounded-3xl p-7 text-center max-w-sm">
          <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto"><UserCheck size={22} /></span>
          <h1 className="text-xl font-display mt-4">You're not logged in</h1>
          <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed">Verify your WePlay ID & Name on the homepage — that instantly logs you in.</p>
          <Link to="/#verify" className="mt-5 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-primary-foreground font-extrabold text-[11.5px] uppercase tracking-[0.14em] active:scale-[0.96] transition-transform"
            style={{ background: "var(--gradient-primary)" }}>
            Verify & Login
          </Link>
        </div>
      </div>);

  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Seo 
        title="My Account | Lowest Weplay — WePlay Recharge History" 
        description="Access your Lowest Weplay account to track WePlay coin purchases, loyalty rewards, and milestone progress. View your WePlay top-up history instantly." 
        path="/my-account" 
      />

      <header className="border-b border-border/60 bg-card/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Home
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-muted-foreground hover:text-destructive px-3 py-2 rounded-xl border border-border active:scale-[0.96] transition-all">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {loading &&
        <div className="py-24 grid place-items-center text-muted-foreground gap-3">
            <Loader2 className="animate-spin" size={22} />
            <p className="text-[12.5px] font-semibold">Loading your account…</p>
          </div>
        }

        {!loading && profile &&
        <>
            {/* welcome */}
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[1.5rem] md:rounded-[2rem] p-[1.5px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.55), hsl(var(--primary-glow)/0.25), hsl(var(--accent)/0.35))" }}>
              <div className="relative rounded-[1.4rem] md:rounded-[1.9rem] bg-card p-5 md:p-7 shadow-elevated overflow-hidden">
                <div className="absolute -top-24 -right-16 w-52 h-52 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
                <div className="relative flex items-center justify-between gap-4 flex-wrap">
                  <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden border-2 border-primary/20 bg-white shadow-sm">
                    <img src="https://i.ibb.co/nHvSPfQ/logo.png" alt="WePlay profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9.5px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">My Account</div>
                    <h1 className="text-[1.4rem] md:text-3xl font-display leading-tight mt-1">Welcome back, {profile.name}!</h1>
                    <p className="text-[12px] md:text-[13px] text-muted-foreground mt-2">
                      {profile.game} ID · <span className="font-extrabold text-foreground">{profile.user_id}</span>

                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-[0.16em] ${tier.chip}`}>
                    <Crown size={12} /> {tier.label} Tier
                  </span>
                </div>

                {/* stats */}
                <div className="relative mt-5 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
                  {[
                { k: "Coins Purchased", v: fmt(purchased), icon: <Coins size={14} /> },
                { k: "Bonus Coins", v: fmt(bonus), icon: <Gift size={14} /> },
                { k: "Total Orders", v: String(profile.order_count), icon: <ShoppingBag size={14} /> },
                { k: "Total Spent", v: `₹${fmt(profile.total_spent)}`, icon: <Wallet size={14} /> }].
                map((s) =>
                <div key={s.k} className="rounded-2xl border border-border bg-secondary/70 px-3.5 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        {s.icon}
                        <span className="text-[8.5px] md:text-[9.5px] font-extrabold uppercase tracking-[0.16em]">{s.k}</span>
                      </div>
                      <div className="text-base md:text-xl font-price font-extrabold mt-1">{s.v}</div>
                    </div>
                )}
                </div>
              </div>
            </motion.section>

            {/* loyalty progress */}
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="card-premium rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 mt-4 md:mt-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-accent/12 text-accent"><Trophy size={17} /></span>
                <div>
                  <div className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Loyalty Rewards</div>
                  <h2 className="text-[15px] md:text-lg font-extrabold">Milestone progress</h2>
                </div>
              </div>

              <p className="text-[12.5px] md:text-[13.5px] text-muted-foreground mt-4 leading-relaxed">
                {next ?
              <>You have purchased <strong className="text-foreground">{fmt(purchased)}</strong> coins. Need{" "}
                    <strong className="text-primary">{fmt(next.coins - purchased)}</strong> more coins to reach the{" "}
                    <strong className="text-foreground">{fmt(next.coins)}</strong> milestone and unlock{" "}
                    <strong className="text-accent">{fmt(next.reward)} FREE coins</strong>!</> :

              <>All milestones unlocked — you've earned <strong className="text-accent">{fmt(bonus)} bonus coins</strong>. Legend status 👑</>
              }
              </p>

              <div className="mt-3.5 h-3 rounded-full bg-secondary border border-border overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.9, ease: "easeOut" }}
                className="h-full rounded-full" style={{ background: "var(--gradient-primary)" }} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 md:gap-3">
                {MILESTONES.map((m) => {
                const done = reached.includes(m.coins);
                return (
                  <div key={m.coins} className={`rounded-2xl border px-3.5 py-3.5 ${done ? "border-accent/30 bg-accent/8" : "border-border bg-secondary/60"}`}>
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={13} className={done ? "text-accent" : "text-muted-foreground"} />
                        <span className="text-[9.5px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">{m.label}</span>
                      </div>
                      <div className="text-[13px] font-extrabold mt-1">{fmt(m.coins)} coins</div>
                      <div className={`text-[11.5px] font-bold mt-0.5 ${done ? "text-accent" : "text-muted-foreground"}`}>
                        {done ? `Unlocked · +${fmt(m.reward)} free coins` : `Reward: ${fmt(m.reward)} free coins`}
                      </div>
                    </div>);

              })}
              </div>
            </motion.section>

            {/* order history */}
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mt-4 md:mt-5">
              <div className="flex items-center gap-2.5 px-1 mb-3">
                <span className="inline-grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary"><Package size={17} /></span>
                <div>
                  <div className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">History</div>
                  <h2 className="text-[15px] md:text-lg font-extrabold">Your orders ({orders.length})</h2>
                </div>
              </div>

              {orders.length === 0 ?
            <div className="card-premium rounded-2xl p-8 text-center">
                  <p className="text-[13px] text-muted-foreground">No orders yet — pick a package to get started.</p>
                  <Link to="/#products" className="mt-4 inline-flex py-3 px-5 rounded-2xl text-primary-foreground font-extrabold text-[11px] uppercase tracking-[0.14em]"
              style={{ background: "var(--gradient-primary)" }}>Browse packages</Link>
                </div> :

            <div className="space-y-3">
                  {orders.map((o, i) =>
              <motion.div key={o.order_id}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}
                className="card-premium rounded-2xl p-4 md:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">Order {o.order_id}</div>
                          <h3 className="text-[15px] md:text-lg font-extrabold mt-0.5 truncate">{o.plan}</h3>
                          <p className="text-[11.5px] text-muted-foreground mt-1">{new Date(o.created_at).toLocaleString()}</p>

                        </div>
                        <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[9.5px] font-extrabold uppercase tracking-wider ${STATUS_STYLES[o.status] ?? "bg-secondary text-muted-foreground border-border"}`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                        <div><span className="text-muted-foreground block">Amount</span><span className="font-extrabold">₹{o.amount}</span></div>
                        <div><span className="text-muted-foreground block">Status</span><span className="font-extrabold uppercase">{o.status}</span></div>

                        <div className="min-w-0"><span className="text-muted-foreground block">Txn ID</span><span className="font-extrabold truncate block">{o.transaction_id || "Not added"}</span></div>
                      </div>
                    </motion.div>
              )}
                </div>
            }
            </motion.section>
          </>
        }
      </main>

      {/* celebration popup */}
      <AnimatePresence>
        {celebrate &&
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] grid place-items-center bg-foreground/45 backdrop-blur-md px-5"
          onClick={() => setCelebrate(null)} role="dialog" aria-modal="true">
            <motion.div initial={{ scale: 0.9, y: 24, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[1.9rem] bg-card border border-border/70 shadow-elevated p-7 text-center">
              <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}
              className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-accent/12 text-accent mx-auto">
                <PartyPopper size={26} />
              </motion.span>
              <h3 className="text-xl font-display mt-4 leading-tight">🎉 Congratulations!</h3>
              <p className="text-[13.5px] text-muted-foreground mt-2 leading-relaxed">
                You've earned <strong className="text-accent">{fmt(celebrate.reward)} FREE coins</strong> for crossing the {fmt(celebrate.coins)} coin milestone.
              </p>
              <button onClick={() => setCelebrate(null)}
              className="mt-6 w-full py-3.5 rounded-2xl text-primary-foreground font-extrabold text-[11.5px] uppercase tracking-[0.14em] active:scale-[0.96] transition-transform"
              style={{ background: "var(--gradient-primary)" }}>
                Awesome
              </button>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}
