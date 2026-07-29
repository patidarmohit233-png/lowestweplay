import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package,
  ArrowRight, Search, CreditCard, Download, CheckCircle2,
  Sparkles, Star, Crown, Flame, UserCheck, Loader2, Pencil } from
"lucide-react";
import SplashScreen from "@/components/SplashScreen";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

type VerifiedBuyer = { weplay_id: string; weplay_name: string };
const VERIFY_KEY = "lw_verified_buyer";

const PRODUCT_BADGES: Record<number, {text: string;icon: React.ReactNode;color: string;}> = {
  1: { text: "STARTER PICK", icon: <Zap size={11} />, color: "primary" },
  2: { text: "BEST SELLER", icon: <Flame size={11} />, color: "accent" },
  3: { text: "POPULAR", icon: <Star size={11} />, color: "primary" },
  4: { text: "HOT DEAL", icon: <Flame size={11} />, color: "accent" },
  5: { text: "MOST VALUE", icon: <Sparkles size={11} />, color: "primary" },
  6: { text: "TOP CHOICE", icon: <Crown size={11} />, color: "accent" },
  7: { text: "MEGA PACK", icon: <Crown size={11} />, color: "primary" }
};

const PRODUCTS = [
{ id: 1, name: "10K RED PACKET CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804999/Gemini_Generated_Image_yy0rgmyy0rgmyy0r_dfnma9.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S" },
{ id: 2, name: "50K RED PACKET CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804998/Gemini_Generated_Image_vtkas1vtkas1vtka_oumu7o.png", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", link: "https://rzp.io/rzp/IgGktT5" },
{ id: 3, name: "10K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_md8zx9md8zx9md8z_yegmmu.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S" },
{ id: 4, name: "50K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804978/Gemini_Generated_Image_79nvx179nvx179nv_xg3bis.png", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", link: "https://rzp.io/rzp/IgGktT5" },
{ id: 5, name: "100K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_si6wdtsi6wdtsi6w_1_ob3o8v.png", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", link: "https://rzp.io/rzp/1Thvvcy" },
{ id: 6, name: "250K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_si6wdtsi6wdtsi6w_w9aomo.png", price: 4200, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", link: "https://rzp.io/rzp/y5vVPoSu" },
{ id: 7, name: "500K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_n9tkkdn9tkkdn9tk_ljcct9.png", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", link: "https://rzp.io/rzp/aRxqcoS" }];


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
{ icon: <Zap size={22} />, label: "Instant Delivery", val: "⚡ Instant" },
{ icon: <Lock size={22} />, label: "Secure Payment", val: "🔒 Secure" },
{ icon: <Trophy size={22} />, label: "Best Rates", val: "🏆 Lowest" },
{ icon: <MessageSquare size={22} />, label: "Live Support", val: "💬 24/7" },
{ icon: <Package size={22} />, label: "Happy Users", val: "📦 10k+" }];


const STEPS = [
{ icon: <Search size={28} />, title: "Choose Package", desc: "Browse our collection and pick your ideal coin bundle" },
{ icon: <CreditCard size={28} />, title: "Secure Payment", desc: "Pay safely via Razorpay with UPI, cards or wallets" },
{ icon: <Download size={28} />, title: "Instant Delivery", desc: "Coins are credited to your account within minutes" },
{ icon: <CheckCircle2 size={28} />, title: "Start Playing", desc: "Enjoy your coins with full ID safety guarantee" }];


/* ── Reusable fade-in wrapper ─────────────────────────── */
function FadeIn({ children, className = "", delay = 0 }: {children: React.ReactNode;className?: string;delay?: number;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      style={{ willChange: "transform, opacity" }}>
      {children}
    </motion.div>);
}

/* ── Section heading ──────────────────────────────────── */
function SectionHeading({ title, subtitle }: {title: string;subtitle: string;}) {
  return (
    <FadeIn className="mb-12 md:mb-16 text-center">
      <h2 className="text-3xl md:text-4xl font-display text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 text-base max-w-lg mx-auto">{subtitle}</p>
    </FadeIn>);

}

/* ── Product Card ─────────────────────────────────────── */
function ProductCard({ product, index, buyer, onRequireVerify }: {product: typeof PRODUCTS[0];index: number;buyer: VerifiedBuyer | null;onRequireVerify: () => void;}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const badge = PRODUCT_BADGES[product.id];
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    if (!buyer) {
      onRequireVerify();
      return;
    }
    setBuying(true);
    const { error } = await supabase.from("orders").insert({
      weplay_id: buyer.weplay_id,
      weplay_name: buyer.weplay_name,
      email: "",
      phone: null,
      product_id: String(product.id),
      product_name: product.name,
      price: product.price,
      status: "pending",
    });
    setBuying(false);
    if (error) {
      toast({ title: "Could not start order", description: error.message, variant: "destructive" });
      return;
    }
    window.open(product.link, "_blank", "noopener,noreferrer");
    toast({ title: "Order created", description: "Complete payment in the new tab. Coins credit within minutes." });
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
  };
  const resetTilt = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: -15 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      className="group relative bg-card rounded-2xl md:rounded-3xl border border-border/40 flex flex-col transition-[box-shadow,border-color,transform] duration-300 overflow-hidden active:scale-[0.97] [transform-style:preserve-3d]"
      style={{ boxShadow: "0 8px 30px -8px rgba(79,70,229,0.15), 0 2px 6px rgba(0,0,0,0.04)", willChange: "transform, opacity" }}>

      {/* Outer glow on hover */}
      <div className="absolute -inset-[1px] rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/30 via-accent/15 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] -z-10" />

      {/* Top gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${badge?.color === "accent" ? "bg-gradient-to-r from-accent/0 via-accent to-accent/0" : "bg-gradient-to-r from-primary/0 via-primary to-primary/0"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Image section */}
      <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-secondary via-muted/60 to-secondary/30 overflow-hidden relative m-2 md:m-3 mb-0 rounded-xl md:rounded-2xl [transform:translateZ(30px)]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms] ease-out" />

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out" />

        {badge &&
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.35, type: "spring", stiffness: 300, damping: 14 }}
          className={`absolute top-1.5 right-1.5 md:top-2.5 md:right-2.5 flex items-center gap-1 md:gap-1.5 px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-xl text-[7px] md:text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xl ${
          badge.color === "accent" ?
          "bg-accent/25 text-accent border border-accent/30 shadow-[0_4px_16px_-3px_hsl(var(--accent)/0.4)]" :
          "bg-primary/25 text-primary border border-primary/30 shadow-[0_4px_16px_-3px_hsl(var(--primary)/0.4)]"}`
          }>
            <motion.span animate={{ scale: [1, 1.3, 1], rotate: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="hidden md:inline-flex">
              {badge.icon}
            </motion.span>
            {badge.text}
          </motion.div>
        }

        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.45, type: "spring", stiffness: 250 }}
          className="absolute bottom-1.5 left-1.5 md:bottom-2.5 md:left-2.5 px-1.5 py-0.5 md:px-3 md:py-1.5 rounded-md md:rounded-xl bg-foreground/85 backdrop-blur-lg text-background text-[8px] md:text-[10px] font-extrabold tracking-wide shadow-lg">
          <span className="text-accent">-</span>{discount}%
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-2.5 md:px-5 md:pb-5 md:pt-4 flex flex-col flex-grow">
        <h3 className="text-[11px] md:text-[15px] font-extrabold text-foreground tracking-tight leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-muted-foreground text-[9px] md:text-xs mb-2 md:mb-4 mt-0.5 md:mt-1 flex-grow leading-snug line-clamp-2">{product.desc}</p>

        <div className="bg-secondary/80 rounded-lg md:rounded-2xl p-2 md:p-3.5 mb-2.5 md:mb-4 border border-border/30">
          <span className="text-[7px] md:text-[9px] text-muted-foreground font-semibold uppercase tracking-[0.15em] hidden md:block">Your Price</span>
          <div className="flex items-baseline gap-1.5 md:gap-2 md:mt-0.5">
            <span className="text-base md:text-2xl font-extrabold font-price text-foreground">₹{product.price}</span>
            <span className="text-[10px] md:text-xs text-muted-foreground line-through decoration-destructive/50">₹{product.mrp}</span>
          </div>
        </div>

        <motion.button
          onClick={handleBuy}
          disabled={buying}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2.5 md:py-4 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground rounded-xl md:rounded-2xl font-extrabold text-center flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm transition-all duration-300 hover:shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.4)] relative overflow-hidden group/btn disabled:opacity-70">

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />

          <span className="relative z-10 flex items-center gap-1.5 md:gap-2 uppercase tracking-wider text-[10px] md:text-[13px]">
            {buying ? (
              <><Loader2 size={13} className="animate-spin" /> Processing…</>
            ) : buyer ? (
              <>Buy Now <ArrowRight size={12} className="md:hidden" /><ArrowRight size={15} className="hidden md:inline group-hover/btn:translate-x-1.5 transition-transform duration-300" /></>
            ) : (
              <><UserCheck size={13} /> Verify to Buy</>
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>);

}

/* ── Floating orb for hero ────────────────────────────── */
function FloatingOrb({ delay, x, y, size, color = "primary" }: {delay: number;x: string;y: string;size: number;color?: string;}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color === "accent" ? "bg-accent/8" : "bg-primary/8"} blur-sm`}
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        x: [0, 10, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1]
      }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: "easeInOut" }} />);


}

/* ── Animated counter ─────────────────────────────────── */
function AnimatedStat({ value, label, delay }: {value: string;label: string;delay: number;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 150 }}
      className="text-center relative group">
      
      <motion.div
        className="text-xl md:text-2xl font-display text-foreground"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}>
        
        {value}
      </motion.div>
      <div className="text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wide uppercase">{label}</div>
    </motion.div>);

}

/* ── Daily Countdown Bar ───────────────────────────────── */
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
    <div
      className="sticky top-0 z-[60] w-full py-1.5 md:py-2 px-3 flex items-center justify-center gap-1.5 md:gap-2 flex-nowrap text-primary-foreground"
      style={{
        background: "linear-gradient(135deg, #4F46E5, #6366F1)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "12px"
      }}>
      <span className="font-semibold tracking-wide text-[11px] md:text-[14px] whitespace-nowrap">🔥 70% OFF ENDS IN:</span>
      <div className="flex items-center gap-1">
        {[
        { val: pad(time.h), label: "h" },
        { val: pad(time.m), label: "m" },
        { val: pad(time.s), label: "s" }].
        map((t) =>
        <span
          key={t.label}
          className="inline-flex items-center justify-center min-w-[28px] md:min-w-[32px] px-1 md:px-1.5 py-0.5 rounded-md font-bold text-[11px] md:text-[14px] tabular-nums"
          style={{ background: "rgba(255,255,255,0.2)" }}>
            {t.val}{t.label}
          </span>
        )}
      </div>
      <span className="text-primary-foreground/70 text-[10px] md:text-xs font-medium hidden sm:inline whitespace-nowrap">• Limited Offer</span>
    </div>);

}


/* ── Verification Panel ────────────────────────────────── */
const verifySchema = z.object({
  weplay_id: z.string().trim().min(3, "WePlay ID must be at least 3 characters").max(40, "Too long"),
  weplay_name: z.string().trim().min(2, "Name required").max(60, "Too long"),
});

function VerificationPanel({ buyer, onVerified }: { buyer: VerifiedBuyer | null; onVerified: (b: VerifiedBuyer | null) => void }) {
  const [form, setForm] = useState<VerifiedBuyer>({ weplay_id: buyer?.weplay_id ?? "", weplay_name: buyer?.weplay_name ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(!buyer);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = verifySchema.safeParse(form);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (flat[i.path[0] as string] = i.message));
      setErrors(flat);
      return;
    }
    setErrors({});
    onVerified(parsed.data as VerifiedBuyer);
    setEditing(false);
    toast({ title: "Verified ✓", description: "You can now top-up any package." });
  };

  return (
    <section id="verify" className="px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-4 relative z-10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl md:rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-xl p-4 md:p-6 overflow-hidden"
          style={{ boxShadow: "0 20px 50px -20px hsl(var(--primary) / 0.25)" }}>

          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-2 mb-3 md:mb-4">
            <span className={`inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl ${buyer && !editing ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/15 text-primary"}`}>
              {buyer && !editing ? <CheckCircle2 size={18} /> : <UserCheck size={18} />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Step 1 · Verify Your Player</div>
              <h3 className="text-base md:text-xl font-display leading-tight text-foreground">
                {buyer && !editing ? "You're verified — ready to top-up" : "Verify before top-up"}
              </h3>
            </div>
            {buyer && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 text-[11px] md:text-xs font-bold text-primary hover:text-primary/80 px-2.5 py-1.5 rounded-lg border border-primary/20 bg-primary/5">
                <Pencil size={12} /> Edit
              </button>
            )}
          </div>

          {buyer && !editing ? (
            <div className="relative grid grid-cols-2 gap-2 md:gap-3">
              <div className="rounded-xl border border-border/60 bg-secondary/50 px-3 py-2.5">
                <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">WePlay ID</div>
                <div className="text-sm md:text-base font-extrabold text-foreground truncate">{buyer.weplay_id}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/50 px-3 py-2.5">
                <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">WePlay Name</div>
                <div className="text-sm md:text-base font-extrabold text-foreground truncate">{buyer.weplay_name}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 md:gap-3">
              <label className="block">
                <span className="sr-only">WePlay ID</span>
                <input
                  value={form.weplay_id}
                  onChange={(e) => setForm({ ...form, weplay_id: e.target.value })}
                  placeholder="WePlay ID (e.g. WP123456)"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.weplay_id ? "border-destructive" : "border-border"}`}
                />
                {errors.weplay_id && <span className="text-[11px] text-destructive mt-1 block">{errors.weplay_id}</span>}
              </label>
              <label className="block">
                <span className="sr-only">WePlay Name</span>
                <input
                  value={form.weplay_name}
                  onChange={(e) => setForm({ ...form, weplay_name: e.target.value })}
                  placeholder="WePlay Name (in-game)"
                  className={`w-full px-4 py-3 rounded-xl border bg-background text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.weplay_name ? "border-destructive" : "border-border"}`}
                />
                {errors.weplay_name && <span className="text-[11px] text-destructive mt-1 block">{errors.weplay_name}</span>}
              </label>
              <button
                type="submit"
                className="py-3 md:py-3 px-5 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.97] transition-all hover:shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.4)]">
                Verify <CheckCircle2 size={14} />
              </button>
            </form>
          )}

          <p className="relative text-[10px] md:text-[11px] text-muted-foreground text-center md:text-left mt-3 leading-relaxed">
            🔒 We only need your Player ID & Name — never your password. Verify once and top-up any plan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
const Index = () => {
  const { scrollY, scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.92]);
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  const [buyer, setBuyer] = useState<VerifiedBuyer | null>(() => {
    try {
      const raw = localStorage.getItem(VERIFY_KEY);
      return raw ? (JSON.parse(raw) as VerifiedBuyer) : null;
    } catch { return null; }
  });
  const persistBuyer = (b: VerifiedBuyer | null) => {
    setBuyer(b);
    if (b) localStorage.setItem(VERIFY_KEY, JSON.stringify(b));
    else localStorage.removeItem(VERIFY_KEY);
  };
  const scrollToVerify = () => {
    const el = document.getElementById("verify");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    toast({ title: "Verify first", description: "Enter your WePlay ID & Name to unlock Buy Now." });
  };

  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem("lw_splash_seen");
    return !seen;
  });
  const [splashDone, setSplashDone] = useState(false);


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
    <SplashScreen show={showSplash} onComplete={() => setSplashDone(true)} />
    <div className={`min-h-screen bg-background text-foreground antialiased overflow-x-hidden ${showSplash ? "overflow-hidden h-screen" : ""}`}>
      {/* ─── SCROLL PROGRESS BAR ──────────────────────────── */}
      <motion.div
        aria-hidden
        style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[80] bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)] pointer-events-none"
      />

      {/* ─── 0. DAILY COUNTDOWN BAR ───────────────────────── */}
      <DailyCountdownBar />


      {/* ─── 1. PREMIUM STICKY HEADER ─────────────────────── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-[30px] md:top-[36px] z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40">
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-[72px] flex items-center justify-between">
          <motion.img
            src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
            alt="Lowest Weplay"
            className="w-[90px] md:w-[150px] h-auto object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }} />
          
          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
              {[
              { label: "Products", href: "#products" },
              { label: "Partners", href: "#partners" },
              { label: "How It Works", href: "#how-it-works" }].
              map((item) =>
              <motion.a
                key={item.label}
                href={item.href}
                className="relative hover:text-primary transition-colors duration-300"
                whileHover={{ y: -1 }}>
                
                  {item.label}
                  <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }} />
                
                </motion.a>
              )}
            </div>
            <motion.span
              className="flex items-center gap-1.5 text-accent font-bold text-[10px] md:text-xs px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15"
              animate={{
                boxShadow: [
                "0 0 0px hsl(var(--accent)/0)",
                "0 0 16px hsl(var(--accent)/0.2)",
                "0 0 0px hsl(var(--accent)/0)"]

              }}
              transition={{ duration: 2.5, repeat: Infinity }}>
              
              <ShieldCheck size={13} /> ID Safe
            </motion.span>
          </div>
        </div>
      </motion.nav>

      {/* ─── PREMIUM HERO ─────────────────────────────────── */}
      <motion.header
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative pt-8 md:pt-20 pb-14 md:pb-32 px-4 md:px-6 overflow-hidden">
        
        {/* Layered light background */}
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.35] pointer-events-none mix-blend-overlay" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full pointer-events-none animate-aurora"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.14), transparent 60%)" }} />
        <div className="absolute top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none animate-aurora"
          style={{ background: "radial-gradient(circle, hsl(var(--primary-glow)/0.16), transparent 65%)", animationDelay: "-6s" }} />
        <div className="absolute bottom-0 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none animate-aurora"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)/0.10), transparent 65%)", animationDelay: "-12s" }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full glass text-[10px] md:text-xs font-semibold mb-6 md:mb-10 shadow-card">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
              <Crown size={11} /> Official
            </span>
            <span className="text-muted-foreground">WePlay CC Top-up Partner</span>
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-bold">Live</span>
          </motion.div>

          {/* Main heading */}
          <div className="mb-5 md:mb-7">
            <motion.h1
              className="text-[2.2rem] leading-[1.08] md:text-7xl lg:text-[5.5rem] font-display tracking-tight">
              
              <motion.span
                initial={{ opacity: 0, y: 70, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block">
                
                Get More.
              </motion.span>
              <br className="md:hidden" />
              {" "}
              <motion.span
                initial={{ opacity: 0, y: 70, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block relative">
                
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    Pay Less.
                  </span>
                  <motion.span
                    className="absolute -bottom-1.5 md:-bottom-2.5 left-0 right-0 h-[3px] md:h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }} />
                  
                </span>
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-muted-foreground text-xs md:text-lg max-w-sm md:max-w-xl mx-auto mb-7 md:mb-12 leading-relaxed px-2">
            
            India's most trusted Weplay CC topup service. Guaranteed ID safety, instant delivery & best prices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 px-2">
            
            <motion.a
              href="#products"
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-gradient-to-r from-primary to-[hsl(244,80%,65%)] text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 relative overflow-hidden group active:scale-95"
              style={{ boxShadow: "var(--shadow-primary), 0 0 40px hsl(244 63% 58% / 0.15)" }}>
              
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent skew-x-[-20deg]"
                initial={{ x: "-150%" }}
                animate={{ x: "250%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />
              
              {/* Glow ring on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 20px hsl(244 63% 80% / 0.3), 0 0 30px hsl(244 63% 58% / 0.25)" }} />

              <span className="relative z-10 flex items-center gap-2.5">
                <Sparkles size={15} className="group-hover:rotate-12 transition-transform duration-300" />
                Browse Packages
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.a>

            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.06, y: -6 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-card/60 backdrop-blur-xl text-foreground rounded-2xl font-bold text-sm border border-border/50 flex items-center justify-center gap-2.5 transition-all duration-300 relative overflow-hidden group hover:border-primary/30 active:scale-95"
              style={{ boxShadow: "var(--shadow-card)" }}>
              
              {/* Subtle border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 15px hsl(244 63% 58% / 0.06)" }} />

              <span className="relative z-10 flex items-center gap-2">
                How It Works
                <ArrowRight size={15} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </span>
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 md:mt-20 inline-flex items-center gap-4 md:gap-10 px-5 md:px-12 py-4 md:py-6 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/40"
            style={{ boxShadow: "0 20px 50px -15px rgb(0 0 0 / 0.06)" }}>
            
            <AnimatedStat value="10K+" label="Customers" delay={1.0} />
            <div className="w-px h-9 bg-border/50" />
            <AnimatedStat value="₹50L+" label="Delivered" delay={1.1} />
            <div className="w-px h-9 bg-border/50" />
            <AnimatedStat value="4.9★" label="Rating" delay={1.2} />
          </motion.div>
        </div>
      </motion.header>

      {/* ─── 2. TRUST BADGES ──────────────────────────────── */}
      <section className="py-6 md:py-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 [perspective:1200px]">
          {TRUST_BADGES.map((badge, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24, rotateX: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06, y: -5, rotateX: 6, rotateY: -4, transition: { type: "spring", stiffness: 400 } }}
            className="group relative flex flex-col items-center p-4 rounded-2xl bg-card border border-border cursor-default transition-colors duration-300 hover:border-primary/30 [transform-style:preserve-3d]"
            style={{ boxShadow: "0 10px 30px -12px rgba(79,70,229,0.18), 0 2px 6px rgba(0,0,0,0.04)" }}>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-primary mb-2 [transform:translateZ(20px)] group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5 relative">{badge.label}</span>
              <span className="text-sm font-bold text-foreground relative">{badge.val}</span>
            </motion.div>
          )}
        </div>
      </section>


      {/* ─── 3. PARTNERS CAROUSEL ─────────────────────────── */}
      <section id="partners" className="py-14 md:py-20 overflow-hidden">
        <SectionHeading title="Top Partners" subtitle="Trusted by the biggest names in the community" />
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex gap-5 animate-scroll-left whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((src, i) =>
            <div key={i} className="flex-shrink-0 h-72 w-56 md:h-80 md:w-64 rounded-2xl overflow-hidden border border-border bg-card p-2 hover:scale-[1.03] transition-transform duration-500" style={{ boxShadow: "0 10px 30px -8px rgba(79,70,229,0.18)" }}>
                <img src={src} alt="Partner" className="w-full h-full object-cover rounded-xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. PRODUCTS ──────────────────────────────────── */}
      <VerificationPanel buyer={buyer} onVerified={persistBuyer} />

      <section id="products" className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary to-secondary/80" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn className="mb-14 md:mb-20 text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/6 border border-primary/12 text-primary text-[10px] font-bold mb-4 md:mb-5">
              
              <Sparkles size={12} /> PREMIUM PACKAGES
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-display text-foreground">
              Choose Your <span className="text-primary">Package</span>
            </h2>
            <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base max-w-lg mx-auto">Select your desired coin amount and proceed to secure checkout</p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-7">
            {PRODUCTS.map((product, i) =>
            <ProductCard key={product.id} product={product} index={i} buyer={buyer} onRequireVerify={scrollToVerify} />
            )}
          </div>
        </div>
      </section>

      {/* ─── 5. YOUTUBE VIDEO ─────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Watch Demo" subtitle="See how easy and fast the topup process is" />
          <FadeIn>
            <div
              className="aspect-video rounded-2xl overflow-hidden border border-border bg-card"
              style={{ boxShadow: "var(--shadow-elevated)" }}>
              
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/wGYGm31bhZM"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
              
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 6. ID SAFE GUARANTEE ─────────────────────────── */}
      <section className="py-14 md:py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="relative bg-card rounded-2xl border border-primary/15 p-8 md:p-12 text-center animate-gentle-glow">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full p-3">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-display text-foreground mt-4 mb-4">
                ID Safe <span className="text-primary">Guarantee</span>
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Your WePlay account ID is 100% safe with us. We are an official topup partner and use secure payment gateways. No password required — only your Player ID.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm font-semibold text-foreground">
                {["No Password Needed", "Official Partner", "Instant Refund Policy"].map((item) =>
                <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/8 text-accent border border-accent/15">
                    <CheckCircle2 size={14} /> {item}
                  </span>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 7. HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="How It Works" subtitle="Get your coins in 4 simple steps" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 [perspective:1400px]">
            {STEPS.map((step, i) =>
            <FadeIn key={i} delay={i * 0.1} className="relative">
                <motion.div
                initial={{ opacity: 0, y: 40, rotateX: -18 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, rotateX: 6, rotateY: -4, transition: { duration: 0.25 } }}
                className="group relative bg-card rounded-2xl border border-border p-6 text-center h-full hover:border-primary/30 transition-colors duration-300 [transform-style:preserve-3d] overflow-hidden"
                style={{ boxShadow: "0 12px 34px -14px rgba(79,70,229,0.2), 0 2px 6px rgba(0,0,0,0.04)" }}>

                  {/* Step number watermark */}
                  <span aria-hidden className="absolute -top-4 -right-2 text-[6rem] font-display text-primary/[0.06] leading-none select-none pointer-events-none [transform:translateZ(0)]">
                    {i + 1}
                  </span>
                  {/* Gradient glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary mb-4 [transform:translateZ(30px)] group-hover:scale-110 group-hover:shadow-[0_10px_25px_-8px_hsl(var(--primary)/0.5)] transition-all duration-300" style={{ animation: `step-bounce 3s ease-in-out ${i * 0.5}s infinite` }}>
                    {step.icon}
                  </div>
                  <div className="relative text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Step {i + 1}</div>
                  <h3 className="relative text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="relative text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
                {i < 3 &&
              <motion.div
                animate={{ x: [0, 4, 0], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                className="hidden md:block absolute top-1/2 -right-3 text-primary/50">
                    <ArrowRight size={18} />
                  </motion.div>
              }
              </FadeIn>
            )}
          </div>

        </div>
      </section>

      {/* ─── CUSTOMER REVIEWS ────────────────────────────── */}
      <section className="py-16 px-4 md:px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Customer Reviews" subtitle="Real feedback from our happy gamers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 [perspective:1400px]">
            {[
              { name: "Rahul", text: "Very nice this website is very good for your weplay life dont wast your money come hare and enjoy" },
              { name: "Ankit G", text: "Maine 50K RED PACKET liya tha. Payment ke baad 10 minute tak kuch nahi aaya toh thoda tension hua. Phir support se baat ki aur 2 minute mein coins aa gaye. Good service" },
              { name: "Eren R", text: "Bhai kya mst website hai phle trust nhi hua tha but ab roj topup karta hu yahi se" },
              { name: "Deepak Kumar", text: "Pehle lag raha tha scam hoga kyunki ID maang rahe the. But unhone bola sirf ID chahiye password nahi. Safe hai bhai" },
              { name: "Neha Jhaal", text: "Raat 1 baje order kiya tha, socha tha kal subah tak wait karna padega coins aa gaye. Thoda slow tha par aa gaya. Trusted website hai" },
              { name: "Amit Tiwari", text: "Sabse sasta recharge yahi mila. Ab yahi se lunga hamesha." },
              { name: "Rohit Yadav", text: "Bhai pehle dar lag raha tha par 2 min mein recharge aa gaya. Highly recommended!" },
              { name: "Sneha", text: "Best experience, trusted hai guys go for it" },
              { name: "Akash007", text: "Legit site hai, coins turant credit ho gaye account mein." },
              { name: "Priya S", text: "ID dalte time dar lag raha tha, support se baat ki unhone bola 100% safe hai. Maine try kiya aur 5 minute mein coins aa gaye. Achi website hai, trusted hai." },
            ].map((review, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -6, rotateX: 4, rotateY: -3, transition: { type: "spring", stiffness: 300 } }}
                  className="group relative bg-card rounded-2xl border border-border p-5 h-full transition-colors duration-300 hover:border-primary/30 [transform-style:preserve-3d]"
                  style={{ boxShadow: "0 10px 28px -14px rgba(79,70,229,0.18), 0 2px 6px rgba(0,0,0,0.04)" }}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative text-amber-400 text-sm mb-2">⭐⭐⭐⭐</div>
                  <p className="relative text-foreground text-sm leading-relaxed mb-3">"{review.text}"</p>
                  <div className="relative flex items-center gap-2 flex-wrap">
                    <p className="text-muted-foreground text-xs font-semibold">— {review.name}</p>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      Verified Purchase
                    </span>
                  </div>
                </motion.div>
              </FadeIn>

            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. PREMIUM FOOTER ────────────────────────────── */}
      <footer className="py-12 px-4 md:px-6 border-t border-border bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <img
              src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
              alt="Lowest Weplay"
              className="w-[100px] h-auto opacity-60" />
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/refund-policy" className="hover:text-primary transition-colors duration-200">Refund Policy</Link>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors duration-200">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact Us</Link>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Lowest Weplay. All rights reserved. Official Partner.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>);

};

export default Index;