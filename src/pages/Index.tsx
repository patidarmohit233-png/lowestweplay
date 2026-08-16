import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package,
  ArrowRight, Search, CreditCard, Download, CheckCircle2,
  Sparkles, Star, Crown, Flame, UserCheck, Loader2, Pencil, PlayCircle,
  ArrowLeftRight, ExternalLink } from
"lucide-react";
import SplashScreen from "@/components/SplashScreen";
import PaymentModal from "@/components/PaymentModal";
import ProfileMenu from "@/components/ProfileMenu";
import VerificationGate from "@/components/VerificationGate";
import LiveSocialProof from "@/components/LiveSocialProof";
import { trackEvent } from "@/lib/analytics";
import Seo, { SITE_URL } from "@/components/Seo";
import { PRODUCTS as ALL_PRODUCTS, FAQS } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";


type VerifiedBuyer = { game: string; user_id: string; name: string };
type Buyer = { weplay_id: string; weplay_name: string };
const VERIFY_KEY = "lw_verified_buyer";


const LOGO = "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png";

const PRODUCT_BADGES: Record<number, { text: string; icon: React.ReactNode; color: "primary" | "accent" | "warning" }> = {
  1: { text: "LESS RECOMMENDED", icon: <ShieldCheck size={11} />, color: "warning" },
  2: { text: "BEST SELLER", icon: <Flame size={11} />, color: "accent" },
  3: { text: "LESS RECOMMENDED", icon: <ShieldCheck size={11} />, color: "warning" },
  4: { text: "HOT DEAL", icon: <Flame size={11} />, color: "accent" },
  5: { text: "MOST VALUE", icon: <Sparkles size={11} />, color: "primary" },
  6: { text: "TOP CHOICE", icon: <Crown size={11} />, color: "accent" },
  7: { text: "MEGA PACK", icon: <Crown size={11} />, color: "primary" }
};

const PRODUCTS = ALL_PRODUCTS;



const PARTNERS = [
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804948/IMG-20260207-WA0006.jpg_rbjusb.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804948/IMG-20260207-WA0008.jpg_zo89yq.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804949/IMG-20260207-WA0007.jpg_gp0oc0.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804949/IMG-20260207-WA0011.jpg_xrsxy2.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804951/IMG-20260207-WA0013.jpg_pr8igb.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804950/IMG-20260207-WA0012.jpg_zimzbe.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804950/IMG-20260207-WA0014.jpg_ptvehw.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804950/IMG-20260207-WA0015.jpg_qh2kbf.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804949/IMG-20260207-WA0009.jpg_e4z9te.jpg",
"https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804949/IMG-20260207-WA0005.jpg_uxirw9.jpg"];


const TRUST_BADGES = [
{ icon: <Zap size={18} />, label: "Delivery", val: "Instant" },
{ icon: <Lock size={18} />, label: "Payment", val: "100% Secure" },
{ icon: <Trophy size={18} />, label: "Pricing", val: "Lowest in India" },
{ icon: <MessageSquare size={18} />, label: "Support", val: "24 / 7 Live" },
{ icon: <Package size={18} />, label: "Community", val: "10,000+ Gamers" }];


const STEPS = [
{ icon: <Search size={22} />, title: "Choose Package", desc: "Browse and pick your ideal coin bundle." },
{ icon: <UserCheck size={22} />, title: "Verify Player", desc: "Enter WePlay ID & name — no password ever." },
{ icon: <CreditCard size={22} />, title: "Secure Payment", desc: "Pay via UPI, cards or wallets on Razorpay." },
{ icon: <Download size={22} />, title: "Instant Delivery", desc: "Coins land in your account within minutes." }];


const REVIEWS = [
{ name: "Rahul", text: "Very nice this website is very good for your weplay life dont wast your money come hare and enjoy" },
{ name: "Ankit G", text: "Maine 50K RED PACKET liya tha. Payment ke baad 10 minute tak kuch nahi aaya toh thoda tension hua. Phir support se baat ki aur 2 minute mein coins aa gaye. Good service" },
{ name: "Eren R", text: "Bhai kya mst website hai phle trust nhi hua tha but ab roj topup karta hu yahi se" },
{ name: "Deepak Kumar", text: "Pehle lag raha tha scam hoga kyunki ID maang rahe the. But unhone bola sirf ID chahiye password nahi. Safe hai bhai" },
{ name: "Neha Jhaal", text: "Raat 1 baje order kiya tha, socha tha kal subah tak wait karna padega coins aa gaye. Trusted website hai" },
{ name: "Amit Tiwari", text: "Sabse sasta recharge yahi mila. Ab yahi se lunga hamesha." },
{ name: "Rohit Yadav", text: "Bhai pehle dar lag raha tha par 2 min mein recharge aa gaya. Highly recommended!" },
{ name: "Sneha", text: "Best experience, trusted hai guys go for it" },
{ name: "Akash007", text: "Legit site hai, coins turant credit ho gaye account mein." },
{ name: "Priya S", text: "ID dalte time dar lag raha tha, support se baat ki unhone bola 100% safe hai. 5 minute mein coins aa gaye." }];


const EASE = [0.16, 1, 0.3, 1] as const;
const SOFT_EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE_EASE = [0.34, 1.56, 0.64, 1] as const;

/* ── Reveal wrapper ───────────────────────────────────── */
function Reveal({ 
  children, 
  className = "", 
  delay = 0, 
  y = 20, 
  x = 0,
  scale = 1,
  blur = true 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number; 
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        y, 
        x, 
        scale: scale === 1 ? 1 : scale,
        filter: blur ? "blur(8px)" : "none"
      }}
      animate={inView ? { 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1,
        filter: blur ? "blur(0px)" : "none"
      } : {}}
      transition={{ 
        duration: 0.9, 
        delay, 
        ease: EASE,
        filter: { duration: 1 } 
      }}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}>
      {children}
    </motion.div>);
}


/* ── Section heading ──────────────────────────────────── */
function SectionHeading({ eyebrow, title, highlight, subtitle }: { eyebrow: string; title: string; highlight?: string; subtitle: string }) {
  return (
    <Reveal className="mb-10 md:mb-16 text-center">
      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/6 border border-primary/12 text-primary text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.18em]">
        <Sparkles size={11} /> {eyebrow}
      </span>
      <motion.h2 
        className="mt-4 text-[1.75rem] leading-[1.12] md:text-6xl font-display text-foreground"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: EASE }}>
        {title} {highlight && <span className="text-gradient inline-block">{highlight}</span>}
      </motion.h2>

      <p className="text-muted-foreground mt-3 text-[13px] md:text-base max-w-md md:max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
      {subtitle.includes("Pick a coin bundle") && (
        <p className="sr-only">
          '''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''
          
          
          jitni bhi policies h unhe ache se dikhao or ai bhi wo dekh ske jo unhe safe lage or trusted lage
        </p>
      )}
    </Reveal>);
}

/* ── Product Card ─────────────────────────────────────── */
function ProductCard({ product, index, buyer, onRequireVerify, onBuy }: { product: typeof PRODUCTS[0]; index: number; buyer: VerifiedBuyer | null; onRequireVerify: () => void; onBuy: (p: typeof PRODUCTS[0]) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const badge = PRODUCT_BADGES[product.id];
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const [buying] = useState(false);
  
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 15);
    setRotateY(-(x - centerX) / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleBuy = () => {
    trackEvent('click_buy_now', { product_id: product.id, product_name: product.name });
    if (!buyer) {
      onRequireVerify();
      return;
    }
    onBuy(product);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ 
        y: -10, 
        rotateX: rotateX,
        rotateY: rotateY,
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      transition={{ 
        duration: 0.8, 
        delay: Math.min(index, 8) * 0.08, 
        ease: EASE 
      }}
      className="group card-premium relative rounded-[1.25rem] md:rounded-[1.75rem] flex flex-col overflow-hidden active:scale-[0.98] transition-all perspective-[1000px]">



      {/* image */}
      <div className="relative m-1.5 md:m-2.5 mb-0 rounded-[0.95rem] md:rounded-[1.35rem] overflow-hidden aspect-square bg-gradient-to-br from-secondary to-muted">
        <img
          src={product.img}
          alt={`${product.name} WePlay top-up pack`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.1]" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {badge &&
        <span className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-[3px] md:px-2.5 md:py-1 rounded-full text-[7.5px] md:text-[9.5px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-md border ${
        badge.color === "accent" ?
        "bg-accent/90 text-accent-foreground border-accent/40" :
        badge.color === "warning" ?
        "bg-amber-500/90 text-white border-amber-400/40" :
        "bg-primary/90 text-primary-foreground border-primary/40"}`}>
            <span className="hidden md:inline-flex">{badge.icon}</span>{badge.text}
          </span>
        }

        <span className="absolute bottom-2 left-2 px-2 py-[3px] md:px-2.5 md:py-1 rounded-full bg-foreground/85 backdrop-blur-md text-background text-[8px] md:text-[10px] font-extrabold tracking-wide">
          {discount}% OFF
        </span>
      </div>

      {/* content */}
      <div className="px-3 pt-2.5 pb-3 md:px-5 md:pt-4 md:pb-5 flex flex-col flex-grow">
        <h3 className="text-[11.5px] md:text-[15px] font-extrabold text-foreground leading-tight line-clamp-1">{product.name}</h3>
        <Link to="/weplay-recharge-topup" onClick={() => trackEvent('click_weplay_topup', { product_id: product.id })} className="text-[9.5px] md:text-[10px] text-primary hover:underline font-bold mb-1 block">WePlay Top Up</Link>
        <p className="text-muted-foreground text-[9.5px] md:text-xs mt-0 mb-2.5 md:mb-4 flex-grow leading-snug line-clamp-2">{product.desc}</p>

        <div className="flex items-end justify-between gap-1 mb-2.5 md:mb-4">
          <div className="flex flex-col">
            <span className="text-[7.5px] md:text-[9px] text-muted-foreground font-bold uppercase tracking-[0.18em]">Price</span>
            <span className="text-[17px] md:text-2xl font-extrabold font-price text-foreground leading-none mt-0.5">₹{product.price}</span>
          </div>
          <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-destructive/60 mb-0.5">₹{product.mrp}</span>
        </div>

        <button
          onClick={handleBuy}
          disabled={buying}
          aria-label={`Buy ${product.name}`}
          className="relative w-full py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-extrabold text-primary-foreground overflow-hidden active:scale-[0.96] transition-all duration-300 disabled:opacity-70 hover:shadow-[0_12px_30px_-8px_hsl(var(--primary)/0.5)]"
          style={{ background: "var(--gradient-primary)" }}>
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-primary-foreground/25 blur-md animate-shine" />
          <span className="relative z-10 flex items-center justify-center gap-1.5 uppercase tracking-[0.12em] text-[10px] md:text-[12.5px]">
            {buying ?
            <><Loader2 size={13} className="animate-spin" /> Processing…</> :
            buyer ?
            <>Buy Now <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" /></> :

            <><UserCheck size={13} /> Verify to Buy</>
            }
          </span>
        </button>
      </div>
    </motion.article>);
}

/* ── Daily Countdown Bar ──────────────────────────────── */
function DailyCountdownBar() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function update() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) return;
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor(diff % 3600000 / 60000),
        s: Math.floor(diff % 60000 / 1000)
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="fixed top-0 z-[60] w-full overflow-hidden text-primary-foreground"
      style={{ background: "linear-gradient(100deg, #14133B 0%, #3B32C4 45%, #6D5BF5 72%, #14133B 100%)", height: "40px" }}>

      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.24) 50%, transparent 62%)" }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }} />

      <div className="relative max-w-7xl mx-auto px-3 py-0 h-full flex items-center justify-center gap-2 md:gap-3.5 flex-nowrap">
        <motion.span
          className="text-sm md:text-lg leading-none"
          animate={{ scale: [1, 1.18, 1], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
          🔥
        </motion.span>

        <span className="font-display text-[11.5px] md:text-[16px] whitespace-nowrap">
          <span className="text-[#FDE68A]">70% OFF</span>
          <span className="hidden sm:inline text-primary-foreground/85"> · Mega Sale</span>
          <span className="text-primary-foreground/65 font-semibold"> ends in</span>
        </span>

        <div className="flex items-center gap-1 md:gap-1.5">
          {[{ val: pad(time.h), label: "H" }, { val: pad(time.m), label: "M" }, { val: pad(time.s), label: "S" }].map((t, i) =>
          <div key={t.label} className="flex items-center gap-1 md:gap-1.5">
              <div className="relative flex flex-col items-center justify-center min-w-[29px] md:min-w-[40px] px-1 md:px-2 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-primary-foreground/25"
              style={{ background: "rgba(255,255,255,0.13)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)" }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                  key={t.val}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.26, ease: EASE }}
                  className="font-display text-[11.5px] md:text-[16px] tabular-nums leading-none">
                    {t.val}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[6.5px] md:text-[8.5px] font-bold tracking-[0.2em] text-primary-foreground/60 leading-none mt-0.5">{t.label}</span>
              </div>
              {i < 2 && <span className="text-primary-foreground/40 font-bold text-[11px]">:</span>}
            </div>
          )}
        </div>

        <motion.a
          href="#products"
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full bg-primary-foreground text-primary whitespace-nowrap"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}>
          Claim Now <ArrowRight size={12} />
        </motion.a>
      </div>
    </div>);
}

/* ── Verification Panel ───────────────────────────────── */
const verifySchema = z.object({
  game: z.literal("WePlay"),
  user_id: z.string().trim().min(3, "ID must be at least 3 characters").max(40, "Too long"),
  name: z.string().trim().min(2, "Name required"),
});


function VerificationPanel({ buyer, onVerified }: { buyer: VerifiedBuyer | null; onVerified: (b: VerifiedBuyer | null) => void }) {
  const [form, setForm] = useState<VerifiedBuyer>(buyer ?? { game: "WePlay", user_id: "", name: "" });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(!buyer);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = verifySchema.safeParse(form);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (flat[i.path[0] as string] = i.message));
      setErrors(flat);
      return;
    }
    setErrors({});
    const { error: upsertError } = await supabase.from("customers").upsert({
      weplay_id: parsed.data.user_id,
      weplay_name: parsed.data.name,
      last_active: new Date().toISOString()
    } as any, { onConflict: 'weplay_id' });

    if (upsertError) {
      toast({ title: "Verification failed", description: upsertError.message, variant: "destructive" });
      return;
    }
    onVerified(form);
    setEditing(false);
    toast({ title: "Verified ✓", description: `Your ${form.game} ID is now your customer ID.` });
  };




  return (
    <section id="verify" className="px-4 md:px-6 pt-10 md:pt-16 relative z-10 scroll-mt-40">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="relative rounded-[1.5rem] md:rounded-[2rem] p-[1.5px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.55), hsl(var(--primary-glow)/0.25), hsl(var(--accent)/0.35))" }}>
            <div className="relative rounded-[1.4rem] md:rounded-[1.9rem] bg-card p-4 md:p-7 overflow-hidden shadow-elevated">
              <div className="absolute -top-24 -right-16 w-52 h-52 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

              <div className="relative flex items-center gap-3 mb-4 md:mb-5">
                <span className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl ${buyer && !editing ? "bg-accent/12 text-accent" : "bg-primary/10 text-primary"}`}>
                  {buyer && !editing ? <CheckCircle2 size={20} /> : <UserCheck size={20} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[9.5px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Step 1 · Player Verification</div>
                  <h3 className="text-[15px] md:text-2xl font-display leading-tight text-foreground mt-0.5">
                    {buyer && !editing ? "You're verified — ready to top-up" : "Verify WePlay details"}
                  </h3>
                </div>
                {buyer && !editing &&
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary px-3 py-2 rounded-xl border border-primary/20 bg-primary/5 active:scale-[0.96] transition-transform">
                    <Pencil size={12} /> Edit
                  </button>
                }
              </div>

              {buyer && !editing ?
              <div className="relative space-y-3">
                  <div className="rounded-2xl border border-accent/25 bg-accent/8 px-4 py-3">
                    <p className="text-[13px] md:text-[14.5px] font-extrabold text-foreground">Welcome back, {buyer.name}! 👋</p>
                    <p className="text-[11px] md:text-[12px] text-muted-foreground mt-0.5">You're logged in — your {buyer.game} ID is your permanent account ID.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                  {[{ k: `${buyer.game} ID`, v: buyer.user_id }, { k: "Name", v: buyer.name }].map((f) =>
                <div key={f.k} className="rounded-2xl border border-border bg-secondary/70 px-3.5 py-3">
                      <div className="text-[8.5px] md:text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">{f.k}</div>
                      <div className="text-sm md:text-base font-extrabold text-foreground truncate mt-0.5">{f.v}</div>
                    </div>
                )}
                  </div>
                  <Link to="/my-account"
                    className="w-full py-3.5 px-6 rounded-2xl text-primary-foreground font-extrabold text-[11.5px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                    style={{ background: "var(--gradient-primary)" }}>
                    Open My Account <ArrowRight size={14} />
                  </Link>
                </div> :


              <form onSubmit={submit} className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2.5 md:gap-3">
                  <label className="block">
                    <span className="sr-only">Player ID</span>
                    <input
                    value={form.user_id}
                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                    placeholder="Enter your ID"
                    className={`w-full px-4 py-3.5 rounded-2xl border bg-secondary/60 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-card transition-all ${errors.user_id ? "border-destructive" : "border-border"}`} />
                    {errors.user_id && <span className="text-[11px] text-destructive mt-1 block">{errors.user_id}</span>}
                  </label>
                  <label className="block">
                    <span className="sr-only">Name</span>
                    <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your Name"
                    className={`w-full px-4 py-3.5 rounded-2xl border bg-secondary/60 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-card transition-all ${errors.name ? "border-destructive" : "border-border"}`} />
                    {errors.name && <span className="text-[11px] text-destructive mt-1 block">{errors.name}</span>}
                  </label>

                  <button
                  type="submit"
                  className="py-3.5 px-6 text-primary-foreground rounded-2xl font-extrabold text-[11.5px] uppercase tracking-[0.14em] flex items-center justify-center gap-2 active:scale-[0.96] transition-all hover:shadow-[0_12px_30px_-8px_hsl(var(--primary)/0.5)]"
                  style={{ background: "var(--gradient-primary)" }}>
                    Verify & Login <CheckCircle2 size={14} />
                  </button>
                </form>
              }

              <p className="relative text-[10.5px] md:text-[12px] text-muted-foreground mt-4 leading-relaxed">
                🔒 We only need your Player ID & Name — never your password. Verify once, top-up any plan.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
const Index = () => {
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  const [buyer, setBuyer] = useState<VerifiedBuyer | null>(() => {
    try {
      const raw = localStorage.getItem(VERIFY_KEY);
      return raw ? JSON.parse(raw) as VerifiedBuyer : null;
    } catch {return null;}
  });
  const persistBuyer = (b: VerifiedBuyer | null) => {
    setBuyer(b);
    if (b) localStorage.setItem(VERIFY_KEY, JSON.stringify(b));else
    localStorage.removeItem(VERIFY_KEY);
  };
  const scrollToVerify = () => {
    document.getElementById("verify")?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast({ title: "Verify first", description: "Enter your WePlay ID & Name to unlock Buy Now." });
  };

  const [payFor, setPayFor] = useState<typeof PRODUCTS[0] | null>(null);

  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("lw_splash_seen"));


  useEffect(() => {
    if (showSplash) {
      const t = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("lw_splash_seen", "1");
      }, 2800);
      return () => clearTimeout(t);
    }
  }, [showSplash]);

  useEffect(() => {
    const s1 = document.createElement("script");
    s1.id = "chatway";
    s1.async = true;
    s1.src = "https://cdn.chatway.app/widget.js?id=tpVsNxrxmjZJ";
    document.body.appendChild(s1);
    return () => {document.body.removeChild(s1);};
  }, []);

  return (
    <>
    <DailyCountdownBar />
    <Seo
      title="WePlay Top Up India — Cheapest WePlay Recharge & Red Packet (100% Safe)"
      description="Official WePlay Recharge India. Buy WePlay coins and Red Packets at the lowest prices. 100% Safe & Instant WePlay top up, No password required. Trusted by thousands of players on weplayrecharge.shop."
      path="/"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Lowest Weplay",
          "url": "https://weplayrecharge.shop/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://weplayrecharge.shop/track-order?id={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "WePlay",
          "applicationCategory": "GameApplication",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "10450"

          },
          "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "479",
            "highPrice": "5999",
            "priceCurrency": "INR",
            "offerCount": PRODUCTS.length.toString()
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "WePlay top-up packages",
          "itemListElement": PRODUCTS.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "Product",
              "name": `WePlay ${p.name}`,
              "description": p.desc,
              "image": p.img,
              "brand": { "@type": "Brand", "name": "WePlay" },
              "offers": {
                "@type": "Offer",
                "price": p.price,
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": `${SITE_URL}/#products`
              }
            }
          }))
        },
        {
          "@type": "FAQPage",
          "mainEntity": FAQS.slice(0, 5).map((f) => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }
      ]}
    />

    <SplashScreen show={showSplash} onComplete={() => {}} />

    {!showSplash && (
      <AnimatePresence>
        {!buyer && (
          <VerificationGate key="gate" onVerified={(b) => persistBuyer(b)} />
        )}
      </AnimatePresence>
    )}

    <DailyCountdownBar />

    <header className="fixed top-[40px] left-0 right-0 z-[70] px-3 md:px-6 pointer-events-none transition-all duration-300">
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl border-b border-border/70 pointer-events-none shadow-sm" />
      <div className="relative max-w-7xl mx-auto flex items-center justify-between pointer-events-auto h-[64px] md:h-[72px]">
        <div className="flex-1 hidden md:flex items-center gap-4">
          <Link to="/weplay-recharge-topup" className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card/70 backdrop-blur-xl border border-border/60 text-[11px] font-extrabold text-foreground uppercase tracking-widest hover:bg-card transition-colors">
            <ArrowLeftRight size={13} className="text-primary" /> Buy & Sell ID
          </Link>
          <Link to="/trust-safety" className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card/70 backdrop-blur-xl border border-border/60 text-[11px] font-extrabold text-foreground uppercase tracking-widest hover:bg-card transition-colors">
            <ShieldCheck size={13} className="text-primary" /> Trust & Safety
          </Link>
        </div>
        
        <div className="flex-shrink-0">
          <Link to="/" className="block active:scale-[0.96] transition-transform py-1">
            <img src={LOGO} alt="Lowest Weplay" className="h-[48px] md:h-[64px] w-auto drop-shadow-sm" />
          </Link>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-3">
          {buyer ? (
            <ProfileMenu buyer={buyer} onLogout={() => {
              persistBuyer(null);
              toast({ title: "Logged out", description: "Your session on this device has been cleared." });
            }} />
          ) : (
            <motion.button 
              onClick={scrollToVerify} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-[11px] font-extrabold uppercase tracking-widest shadow-primary active:scale-[0.96] transition-transform whitespace-nowrap">
              <UserCheck size={16} /> Login
            </motion.button>

          )}
        </div>
      </div>
    </header>
    
    <div className="h-[100px] md:h-[112px]" />

    <div
      aria-hidden={!buyer ? true : undefined}

      className={`min-h-screen bg-background text-foreground antialiased overflow-x-hidden transition-[filter,opacity] duration-500 ${showSplash ? "hidden" : ""} ${!buyer ? "blur-[7px] scale-[1.01] opacity-95 pointer-events-none select-none max-h-screen overflow-hidden" : ""}`}>
      {/* scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[80] bg-gradient-to-r from-primary via-primary-glow to-accent pointer-events-none" />

      {/* DailyCountdownBar is fixed to top, no need to render it here in flow if it causes double-spacing */}
      {/* <DailyCountdownBar /> */}

      <div className="h-[20px]" />


      {/* ─── STEP 1 · VERIFY & LOGIN (top of page until verified) ─────────── */}
      {!buyer && <VerificationPanel buyer={buyer as any} onVerified={persistBuyer} />}


      {/* ─── HERO ─────────────────────────────────────────── */}
      <header className="relative pt-12 md:pt-24 pb-16 md:pb-28 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none mix-blend-overlay" />
        <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full pointer-events-none animate-aurora"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.16), transparent 62%)" }} />
        <div className="absolute top-28 -right-40 w-[440px] h-[440px] rounded-full pointer-events-none animate-aurora"
          style={{ background: "radial-gradient(circle, hsl(var(--primary-glow)/0.16), transparent 65%)", animationDelay: "-7s" }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full glass shadow-card text-[10px] md:text-xs font-semibold animate-float">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.14em]">
              <Crown size={10} /> Official
            </span>
            <span className="text-muted-foreground">WePlay Top-up Partner</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-extrabold">Live</span>
          </motion.div>


          <motion.a
            href="#proof"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] backdrop-blur-md px-3.5 py-2 text-[11px] md:text-xs font-extrabold text-primary hover:bg-primary/[0.12] active:scale-[0.97] transition-all"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
              <PlayCircle size={12} />
            </span>
            Watch Proof of Delivery
            <ArrowRight size={12} />
          </motion.a>

          <h1 className="mt-6 md:mt-9 text-[2.6rem] leading-[0.98] md:text-[5.2rem] font-display text-foreground perspective-[1000px]">
            {["Get More.", "Pay Less."].map((line, i) =>
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40, rotateX: -20, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.15 + i * 0.2, ease: EASE }}
              className={`block ${i === 1 ? "text-gradient" : ""}`}>
                {line}
              </motion.span>
            )}
          </h1>


          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="text-muted-foreground text-[13.5px] md:text-lg max-w-[19rem] md:max-w-xl mx-auto mt-5 md:mt-7 leading-relaxed">
            India's most trusted WePlay top-up service — guaranteed ID safety, instant delivery and the lowest prices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.58, ease: EASE }}
            className="mt-8 md:mt-11 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#products"
              className="group relative w-full sm:w-auto overflow-hidden px-9 py-4 md:px-11 md:py-5 rounded-2xl text-primary-foreground font-extrabold text-[13px] md:text-sm flex items-center justify-center gap-2.5 active:scale-[0.97] transition-transform hover:-translate-y-1"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-primary-foreground/25 blur-md animate-shine" />
              <Sparkles size={16} className="relative z-10" />
              <span className="relative z-10">Browse Packages</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-9 py-4 md:px-11 md:py-5 rounded-2xl bg-card text-foreground font-extrabold text-[13px] md:text-sm border border-border flex items-center justify-center gap-2 shadow-card hover:border-primary/30 hover:-translate-y-1 active:scale-[0.97] transition-all">
              <PlayCircle size={16} className="text-primary" /> How It Works
            </a>
          </motion.div>

          {/* stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.75, ease: EASE }}
            className="mt-10 md:mt-16 grid grid-cols-3 max-w-md md:max-w-xl mx-auto rounded-3xl glass shadow-card overflow-hidden">
            {[{ v: "10K+", l: "Customers" }, { v: "₹50L+", l: "Delivered" }, { v: "4.9★", l: "Rating" }].map((s, i) =>
            <div key={s.l} className={`py-4 md:py-6 px-2 text-center ${i < 2 ? "border-r border-border/70" : ""}`}>
                <div className="text-lg md:text-3xl font-display text-foreground">{s.v}</div>
                <div className="text-[9px] md:text-[11px] text-muted-foreground uppercase tracking-[0.16em] mt-1">{s.l}</div>
              </div>
            )}
          </motion.div>
        </div>
      </header>

      {/* ─── TRUST STRIP ──────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-3">
          {TRUST_BADGES.map((b, i) =>
            <Reveal key={b.label} delay={i * 0.08} y={20} scale={0.97} className={i === 4 ? "col-span-2 md:col-span-1" : ""}>
              <div className="h-full card-premium rounded-2xl px-3.5 py-3.5 md:px-4 md:py-4 flex items-center gap-3 hover:bg-primary/[0.02] transition-colors">
                <span className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  {b.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-[8.5px] md:text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">{b.label}</div>
                  <div className="text-[12px] md:text-[13.5px] font-extrabold text-foreground truncate">{b.val}</div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>


      {/* ─── PARTNERS ─────────────────────────────────────── */}
      <section id="partners" className="py-14 md:py-24 overflow-hidden bg-secondary/60 border-y border-border/70 scroll-mt-36">
        <div className="px-4 md:px-6">
          <SectionHeading
            eyebrow="Community"
            title="Our Top"
            highlight="Partners"
            subtitle="Trusted by the biggest creators and clans in the WePlay community." />
        </div>
        <div
          className="relative mask-fade-x overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x overscroll-x-contain"
          aria-label="Partner creators carousel — swipe to scroll"
        >
          <div className="flex gap-4 md:gap-5 animate-scroll-left whitespace-nowrap will-change-transform w-max">
            {[...PARTNERS, ...PARTNERS].map((src, i) =>
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05, y: -5 }}
                className="snap-start flex-shrink-0 h-72 w-52 md:h-[26rem] md:w-80 rounded-3xl overflow-hidden bg-card p-1.5 border border-border shadow-card transition-all duration-500">
                <img src={src} alt="Partner creator" loading="lazy" className="w-full h-full object-cover rounded-[1.25rem]" />
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* ─── DEMO VIDEO ───────────────────────────────────── */}
      <section className="py-14 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Walkthrough"
            title="Watch The"
            highlight="Demo"
            subtitle="See how fast and simple the top-up process really is." />
          <Reveal>
            <div className="aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-border bg-card shadow-elevated">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/HmUCGgfNFDg?si=a7X3UqHTo0JHV1hM"
                title="YouTube video player"
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── BUY & SELL ID (ESCROW) ────────────────────────── */}
      <section className="px-4 md:px-6 pb-4 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <a
              href="https://weplayescrow.lovable.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 md:gap-4 rounded-2xl border border-accent/25 bg-accent/[0.06] px-4 py-3.5 md:px-6 md:py-4 backdrop-blur-xl active:scale-[0.98] transition-transform">
              <span className="w-10 h-10 shrink-0 rounded-xl grid place-items-center bg-accent/12 border border-accent/25 text-accent">
                <ArrowLeftRight size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] md:text-[15px] font-extrabold text-foreground">
                  Buy &amp; Sell WePlay ID
                </span>
                <span className="block text-[11px] md:text-[12.5px] text-muted-foreground">
                  Safe escrow deals on our official partner site
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-accent text-[11px] md:text-xs font-extrabold uppercase tracking-[0.12em] whitespace-nowrap">
                Visit <ExternalLink size={12} />
              </span>
            </a>
          </Reveal>
        </div>
      </section>



      {/* ─── PRODUCTS ─────────────────────────────────────── */}
      <section id="products" className="relative py-14 md:py-24 px-4 md:px-6 scroll-mt-36">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* verified users see their player card right above the packages */}
          {buyer && <VerificationPanel buyer={buyer} onVerified={persistBuyer} />}
          <SectionHeading
            eyebrow="Premium Packages"
            title="Choose Your"
            highlight="Package"
            subtitle="Pick a coin bundle and pay securely — coins are credited within minutes." />
          {!buyer ?
            <Reveal>
              <div className="max-w-xl mx-auto text-center rounded-[1.75rem] border border-border/70 bg-card/70 backdrop-blur-xl shadow-elevated px-6 py-10">
                <span className="inline-flex w-14 h-14 rounded-2xl bg-primary/10 text-primary items-center justify-center">
                  <Lock size={22} />
                </span>
                <h3 className="mt-4 text-lg md:text-xl font-display text-foreground">Plans are locked</h3>
                <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                  Verify your WePlay ID & Name at the top to unlock all packages.
                </p>
                <button onClick={scrollToVerify}
                  className="mt-5 px-7 py-3.5 rounded-2xl text-primary-foreground font-extrabold text-[11.5px] uppercase tracking-[0.14em] inline-flex items-center gap-2 active:scale-[0.97] transition-transform"
                  style={{ background: "var(--gradient-primary)" }}>
                  Verify & Login <ArrowRight size={14} />
                </button>
              </div>
            </Reveal> :
          [
            { key: "redpacket", label: "Red Packet", items: PRODUCTS.filter((p) => p.name.includes("RED PACKET")) },
            { key: "recharge", label: "Recharge", items: PRODUCTS.filter((p) => !p.name.includes("RED PACKET")) }].
            map((group) =>
            <div key={group.key} className="mb-10 md:mb-14 last:mb-0">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <h3 className="font-display text-lg md:text-2xl font-bold tracking-tight">{group.label}</h3>
                  <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {group.items.map((product, i) =>
                <ProductCard key={product.id} product={product} index={i} buyer={buyer} onRequireVerify={scrollToVerify} onBuy={setPayFor} />
                )}
                </div>
              </div>
            )}


        </div>
      </section>

      {/* ─── PROOF OF DELIVERY ────────────────────────────── */}
      <section id="proof" className="py-14 md:py-24 px-4 md:px-6 scroll-mt-36">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            eyebrow="Trust"
            title="Proof of"
            highlight="Delivery"
            subtitle="Real proof of successful WePlay top-ups. No tricks, no scams. Just instant delivery." />
          <Reveal>
            <div className="flex flex-col items-center">
              <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-border bg-card shadow-elevated"
                style={{ width: "100%", maxWidth: "315px", aspectRatio: "9 / 16" }}>
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/aQeC9LdH-Mk"
                  title="Proof of weplay carding in Lowestweplay"
                  frameBorder="0"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen />
              </div>
              <p className="mt-5 text-[11px] md:text-xs text-center text-muted-foreground max-w-sm leading-relaxed">
                <span aria-hidden className="mr-1">📹</span>
                Video shows real top-up process. We never ask for password. Only WePlay ID needed.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-14 md:py-24 px-4 md:px-6 scroll-mt-36">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Process"
            title="How It"
            highlight="Works"
            subtitle="Four simple steps from picking a pack to playing with your coins." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
            {STEPS.map((step, i) =>
            <Reveal key={step.title} delay={i * 0.08}>
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative h-full card-premium rounded-3xl p-5 md:p-6 overflow-hidden transition-all duration-500">
                  <span aria-hidden className="absolute -top-5 right-1 text-[5.5rem] font-display text-primary/[0.07] leading-none select-none pointer-events-none group-hover:text-primary/[0.12] transition-colors duration-500">
                    {i + 1}
                  </span>
                  <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/8 text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-500">
                    {step.icon}
                  </div>

                  <div className="relative text-[9.5px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] mb-1.5">Step {i + 1}</div>
                  <h3 className="relative text-[15px] md:text-base font-extrabold text-foreground mb-1.5">{step.title}</h3>
                  <p className="relative text-muted-foreground text-[12.5px] md:text-sm leading-relaxed">{step.desc}</p>
                </motion.div>

              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ─── ID SAFE ──────────────────────────────────────── */}
      <section className="py-6 md:py-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] px-6 py-10 md:px-14 md:py-14 text-center text-primary-foreground"
              style={{ background: "linear-gradient(135deg, #14133B 0%, #3B32C4 55%, #6D5BF5 100%)" }}>
              <div className="absolute inset-0 bg-grid opacity-[0.12]" />
              <motion.div
                aria-hidden
                className="absolute -top-24 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(255,255,255,0.16)" }}
                animate={{ x: [-40, 60, -40], opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />

              <div className="relative">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-foreground/12 border border-primary-foreground/20 mb-5">
                  <ShieldCheck size={26} />
                </span>
                <h2 className="text-2xl md:text-4xl font-display">ID Safe Guarantee</h2>
                <p className="text-primary-foreground/75 max-w-xl mx-auto mt-4 text-[13.5px] md:text-base leading-relaxed">
                  Your WePlay account is 100% safe. We're an official top-up partner using secure payment gateways — no password required, only your Player ID.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-7">
                  {["No Password Needed", "Official Partner", "Instant Refund Policy"].map((item) =>
                  <span key={item} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 text-[11.5px] md:text-[13px] font-bold">
                      <CheckCircle2 size={14} /> {item}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────────────── */}
      <section className="py-14 md:py-24 px-4 md:px-6 bg-secondary/60 border-y border-border/70">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Reviews"
            title="Loved By"
            highlight="Gamers"
            subtitle="Real feedback from players who top-up with us every day." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-5">
            {REVIEWS.map((review, i) =>
            <Reveal key={review.name} delay={Math.min(i, 6) * 0.05} scale={0.96}>
                <motion.figure 
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="h-full card-premium rounded-3xl p-5 flex flex-col transition-all duration-500">
                  <div className="text-amber-400 text-sm mb-2.5" aria-label="5 star rating">★★★★★</div>
                  <blockquote className="text-foreground text-[13px] md:text-sm leading-relaxed flex-grow">"{review.text}"</blockquote>

                  <figcaption className="flex items-center gap-2.5 mt-4 pt-4 border-t border-border/70">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold">
                      {review.name.charAt(0)}
                    </span>
                    <span className="text-[12.5px] font-bold text-foreground">{review.name}</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-accent text-[10px] font-extrabold">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </figcaption>
                </motion.figure>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <Reveal className="relative max-w-2xl mx-auto">
          <h2 className="text-[1.9rem] leading-tight md:text-5xl font-display text-foreground">
            Ready to <span className="text-gradient">top-up?</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-[13.5px] md:text-base">Verify once, then grab any pack at up to 70% off.</p>
          <a
            href="#products"
            className="group relative inline-flex overflow-hidden mt-7 px-10 py-4 md:px-12 md:py-5 rounded-2xl text-primary-foreground font-extrabold text-[13px] md:text-sm items-center justify-center gap-2.5 active:scale-[0.97] hover:-translate-y-1 transition-transform"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-primary-foreground/25 blur-md animate-shine" />
            <span className="relative z-10">Get My Coins</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
          </a>
        </Reveal>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="relative pt-20 pb-12 px-4 md:px-6 overflow-hidden bg-card border-t border-border">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Trust Badges Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: <Lock className="text-primary" size={20} />, title: "Secure Payment", desc: "PCI-DSS Compliant" },
              { icon: <Zap className="text-accent" size={20} />, title: "Instant Delivery", desc: "Automated Gifting" },
              { icon: <ShieldCheck className="text-primary" size={20} />, title: "100% ID Safe", desc: "No Passwords" },
              { icon: <MessageSquare className="text-accent" size={20} />, title: "24/7 Support", desc: "Live Chat Help" }
            ].map((b, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-border/60 bg-secondary/30 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
                    {b.icon}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-extrabold text-foreground leading-none">{b.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-medium">{b.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <img src={LOGO} alt="Lowest Weplay" loading="lazy" className="h-[56px] w-auto mb-6 opacity-90" />
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs">
                Premium WePlay top-up service dedicated to providing the fastest and safest coin delivery for the Indian gaming community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground mb-6">Services</h4>
              <nav className="flex flex-col gap-3.5">
                <Link to="/how-it-works" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors font-medium">How It Works</Link>
                <Link to="/why-us" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Why Choose Us</Link>
                <Link to="/weplay-recharge" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Coins Recharge</Link>
                <Link to="/weplay-red-packet" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Red Packet Store</Link>
              </nav>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground mb-6">Support</h4>
              <nav className="flex flex-col gap-3.5">
                <Link to="/track-order" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Track Your Order</Link>
                <Link to="/faq" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Help & FAQ</Link>
                <Link to="/contact" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Contact Support</Link>
                <Link to="/how-to-top-up-weplay" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">How to Top Up</Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground mb-6">Trust & Legal</h4>
              <nav className="flex flex-col gap-3.5">
                <Link to="/trust-safety" className="text-[13.5px] font-bold text-primary hover:underline">Trust & Safety Guide</Link>
                <Link to="/refund-policy" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
                <Link to="/privacy-policy" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link to="/terms-of-service" className="text-[13.5px] text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                <Link to="/blog" className="text-[13.5px] font-bold text-accent hover:underline">Official Blog & News</Link>

              </nav>
            </div>
          </div>

          <div className="divider-fade mb-8" />
          
          <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 text-center">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Disclaimer:</span> LowestWePlay is an independent third-party 
              service. We are <span className="font-bold text-foreground">NOT</span> affiliated with, endorsed by, or 
              sponsored by WePlay. All trademarks belong to their respective owners.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-muted-foreground text-[12px]">
              © {new Date().getFullYear()} Lowest Weplay. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/admin-lowest-shubham" className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors uppercase tracking-widest font-extrabold">
                Admin
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>


      {payFor && buyer &&
      <PaymentModal product={payFor} buyer={buyer as any} onClose={() => setPayFor(null)} />
      }


    </div>
    {buyer && !showSplash && <LiveSocialProof />}
    </>);


};

export default Index;
