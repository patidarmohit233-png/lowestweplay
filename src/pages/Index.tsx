import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package,
  ArrowRight, Search, CreditCard, Download, CheckCircle2,
  Sparkles, Star, Crown, Flame } from
"lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
{ icon: <Zap size={20} />, label: "Instant Delivery", val: "⚡ Instant" },
{ icon: <Lock size={20} />, label: "Secure Payment", val: "🔒 Secure" },
{ icon: <Trophy size={20} />, label: "Best Rates", val: "🏆 Lowest" },
{ icon: <MessageSquare size={20} />, label: "Live Support", val: "💬 24/7" },
{ icon: <Package size={20} />, label: "Happy Users", val: "📦 10k+" }];

const STEPS = [
{ icon: <Search size={26} />, title: "Choose Package", desc: "Browse our collection and pick your ideal coin bundle" },
{ icon: <CreditCard size={26} />, title: "Secure Payment", desc: "Pay safely via Razorpay with UPI, cards or wallets" },
{ icon: <Download size={26} />, title: "Instant Delivery", desc: "Coins are credited to your account within minutes" },
{ icon: <CheckCircle2 size={26} />, title: "Start Playing", desc: "Enjoy your coins with full ID safety guarantee" }];

const REVIEWS = [
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
];

/* ── Reusable fade-in wrapper (optimized) ────────────── */
function FadeIn({ children, className = "", delay = 0 }: {children: React.ReactNode;className?: string;delay?: number;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      style={{ willChange: inView ? "auto" : "opacity, transform" }}>
      {children}
    </motion.div>);
}

/* ── Section heading ──────────────────────────────────── */
function SectionHeading({ title, subtitle }: {title: string;subtitle: string;}) {
  return (
    <FadeIn className="mb-10 md:mb-14 text-center">
      <h2 className="text-2xl md:text-4xl font-display text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-lg mx-auto">{subtitle}</p>
    </FadeIn>);
}

/* ── Product Card (optimized for mobile) ──────────────── */
function ProductCard({ product, index }: {product: typeof PRODUCTS[0];index: number;}) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const badge = PRODUCT_BADGES[product.id];
  const discount = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: isMobile ? index * 0.04 : index * 0.07, ease: "easeOut" }}
      whileHover={isMobile ? undefined : { y: -6, transition: { duration: 0.25, type: "spring", stiffness: 300, damping: 22 } }}
      className="group relative bg-card rounded-2xl border border-border/60 flex flex-col hover:border-primary/25 transition-colors duration-300 overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)", willChange: "auto" }}>
      
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${badge?.color === "accent" ? "bg-gradient-to-r from-transparent via-accent to-transparent" : "bg-gradient-to-r from-transparent via-primary to-transparent"} opacity-60`} />

      {/* Image */}
      <div className="aspect-[4/3] bg-secondary overflow-hidden relative m-2.5 md:m-3 rounded-xl">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md ${
            badge.color === "accent" ?
            "bg-accent/20 text-accent border border-accent/20" :
            "bg-primary/20 text-primary border border-primary/20"}`}>
            {badge.icon}
            {badge.text}
          </div>
        )}

        {/* Discount */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-foreground/80 backdrop-blur-sm text-background text-[10px] font-bold">
          {discount}% OFF
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-1.5 flex flex-col flex-grow">
        <h3 className="text-sm md:text-base font-bold text-foreground mb-0.5 tracking-tight">{product.name}</h3>
        <p className="text-muted-foreground text-xs mb-3 flex-grow leading-relaxed">{product.desc}</p>

        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl md:text-2xl font-bold font-price text-foreground">₹{product.price}</span>
              <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-accent font-semibold">
            <Zap size={11} />
            Instant
          </div>
        </div>

        <button
          onClick={() => navigate(`/checkout?product=${product.id}`)}
          className="w-full py-3 md:py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-center flex items-center justify-center gap-2 text-sm active:scale-[0.97] transition-all duration-200 hover:shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.3)]">
          BUY NOW <ArrowRight size={14} />
        </button>
      </div>
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
      className="sticky top-0 z-[60] w-full py-2 px-3 flex items-center justify-center gap-2 flex-wrap text-sm text-primary-foreground"
      style={{
        background: "linear-gradient(135deg, #4F46E5, #6366F1)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "13px"
      }}>
      <span className="font-semibold tracking-wide">🔥 70% SALES ENDS IN:</span>
      <div className="flex items-center gap-1">
        {[
        { val: pad(time.h), label: "h" },
        { val: pad(time.m), label: "m" },
        { val: pad(time.s), label: "s" }].
        map((t) =>
        <span
          key={t.label}
          className="inline-flex items-center justify-center min-w-[30px] px-1.5 py-0.5 rounded-md font-bold tabular-nums text-xs"
          style={{ background: "rgba(255,255,255,0.2)" }}>
            {t.val}{t.label}
          </span>
        )}
      </div>
      <span className="text-white/80 text-xs font-medium hidden sm:inline">• Limited Time Offer</span>
    </div>);
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
const Index = () => {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 40]);

  useEffect(() => {
    const s1 = document.createElement("script");
    s1.id = "chatway";
    s1.async = true;
    s1.src = "https://cdn.chatway.app/widget.js?id=tpVsNxrxmjZJ";
    document.body.appendChild(s1);
    return () => { document.body.removeChild(s1); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      {/* ─── 0. DAILY COUNTDOWN BAR ───────────────────────── */}
      <DailyCountdownBar />

      {/* ─── 1. STICKY HEADER ─────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-[36px] z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <img
            src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
            alt="Lowest Weplay"
            className="w-[100px] md:w-[140px] h-auto object-contain" />
          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
              {[
              { label: "Products", href: "#products" },
              { label: "Partners", href: "#partners" },
              { label: "How It Works", href: "#how-it-works" }].
              map((item) =>
              <a
                key={item.label}
                href={item.href}
                className="hover:text-primary transition-colors duration-200">
                {item.label}
              </a>
              )}
            </div>
            <span className="flex items-center gap-1.5 text-accent font-bold text-[10px] md:text-xs px-2.5 py-1 rounded-full bg-accent/8 border border-accent/15">
              <ShieldCheck size={12} /> ID Safe
            </span>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <motion.header
        style={isMobile ? undefined : { opacity: heroOpacity, y: heroY }}
        className="relative pt-8 md:pt-16 pb-16 md:pb-28 px-4 md:px-6 overflow-hidden">
        
        {/* Simple gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-background to-accent/[0.03]" />
        
        {/* Single subtle glow */}
        <div
          className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[600px] rounded-full pointer-events-none opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }} />

        {/* Dot pattern (static) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/6 border border-primary/12 text-primary text-[10px] md:text-xs font-bold mb-6 md:mb-8">
            <Crown size={14} />
            OFFICIAL WEPLAY CC TOP-UP PARTNER
            <Sparkles size={12} className="text-primary/50" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-[2.5rem] leading-[1.08] md:text-6xl lg:text-7xl font-display tracking-tight mb-4 md:mb-6">
            Get More.{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Pay Less.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground text-sm md:text-lg max-w-sm md:max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed">
            India's most trusted Weplay CC topup service. Guaranteed ID safety, instant delivery & best prices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#products"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-[hsl(244,80%,65%)] text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 relative overflow-hidden group"
              style={{ boxShadow: "var(--shadow-primary)" }}>
              {/* Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent skew-x-[-20deg] animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles size={14} />
                Browse Packages
                <ArrowRight size={15} />
              </span>
            </a>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-10 py-4 bg-card/60 backdrop-blur-lg text-foreground rounded-2xl font-bold text-sm border border-border/50 flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 hover:border-primary/30"
              style={{ boxShadow: "var(--shadow-soft)" }}>
              How It Works
              <ArrowRight size={14} className="opacity-60" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-10 md:mt-16 inline-flex items-center gap-4 md:gap-8 px-6 md:px-10 py-4 md:py-5 rounded-2xl bg-card/50 backdrop-blur-lg border border-border/40"
            style={{ boxShadow: "var(--shadow-card)" }}>
            {[
              { value: "10K+", label: "Customers" },
              { value: "₹50L+", label: "Delivered" },
              { value: "4.9★", label: "Rating" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4 md:gap-8">
                {i > 0 && <div className="w-px h-8 bg-border/50" />}
                <div className="text-center">
                  <div className="text-lg md:text-xl font-display text-foreground">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5 tracking-wide uppercase">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.header>

      {/* ─── 2. TRUST BADGES ──────────────────────────────── */}
      <section className="py-5 md:py-8 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
          {TRUST_BADGES.map((badge, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            className="flex flex-col items-center p-3 md:p-4 rounded-xl bg-card border border-border transition-colors duration-200 hover:border-primary/20">
              <div className="text-primary mb-1.5">{badge.icon}</div>
              <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{badge.label}</span>
              <span className="text-xs md:text-sm font-bold text-foreground">{badge.val}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── 3. PARTNERS CAROUSEL ─────────────────────────── */}
      <section id="partners" className="py-10 md:py-16 overflow-hidden">
        <SectionHeading title="Top Partners" subtitle="Trusted by the biggest names in the community" />
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 animate-scroll-left whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((src, i) =>
            <div key={i} className="flex-shrink-0 h-44 w-32 md:h-56 md:w-40 rounded-xl overflow-hidden border border-border bg-card p-1" style={{ boxShadow: "var(--shadow-soft)" }}>
                <img src={src} alt="Partner" loading="lazy" className="w-full h-full object-cover rounded-lg" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 4. PRODUCTS ──────────────────────────────────── */}
      <section id="products" className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary to-secondary/80" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn className="mb-10 md:mb-16 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/6 border border-primary/12 text-primary text-[10px] font-bold mb-3 md:mb-4">
              <Sparkles size={11} /> PREMIUM PACKAGES
            </span>
            <h2 className="text-2xl md:text-4xl font-display text-foreground">
              Choose Your <span className="text-primary">Package</span>
            </h2>
            <p className="text-muted-foreground mt-2 md:mt-3 text-sm md:text-base max-w-lg mx-auto">Select your desired coin amount and proceed to secure checkout</p>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {PRODUCTS.map((product, i) =>
            <ProductCard key={product.id} product={product} index={i} />
            )}
          </div>
        </div>
      </section>

      {/* ─── 5. YOUTUBE VIDEO ─────────────────────────────── */}
      <section className="py-12 md:py-20 px-4 md:px-6">
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
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 6. ID SAFE GUARANTEE ─────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="relative bg-card rounded-2xl border border-primary/15 p-6 md:p-10 text-center" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-full p-2.5">
                <ShieldCheck size={22} />
              </div>
              <h2 className="text-xl md:text-3xl font-display text-foreground mt-3 mb-3">
                ID Safe <span className="text-primary">Guarantee</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                Your WePlay account ID is 100% safe with us. We are an official topup partner and use secure payment gateways. No password required — only your Player ID.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6 text-xs md:text-sm font-semibold text-foreground">
                {["No Password Needed", "Official Partner", "Instant Refund Policy"].map((item) =>
                <span key={item} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/8 text-accent border border-accent/15">
                    <CheckCircle2 size={12} /> {item}
                  </span>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 7. HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="How It Works" subtitle="Get your coins in 4 simple steps" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {STEPS.map((step, i) =>
            <FadeIn key={i} delay={i * 0.08} className="relative">
                <div
                className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-6 text-center h-full hover:border-primary/20 transition-colors duration-200"
                style={{ boxShadow: "var(--shadow-soft)" }}>
                  <div className="inline-flex items-center justify-center w-11 h-11 md:w-14 md:h-14 rounded-xl bg-primary/8 text-primary mb-3">
                    {step.icon}
                  </div>
                  <div className="text-[9px] md:text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Step {i + 1}</div>
                  <h3 className="text-xs md:text-base font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-[11px] md:text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 &&
              <div className="hidden md:block absolute top-1/2 -right-3 text-border">
                    <ArrowRight size={16} />
                  </div>
              }
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* ─── CUSTOMER REVIEWS ────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Customer Reviews" subtitle="Real feedback from our happy gamers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REVIEWS.map((review, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <div className="bg-card rounded-xl border border-border p-4 h-full" style={{ boxShadow: "var(--shadow-soft)" }}>
                  <div className="text-amber-400 text-sm mb-1.5">⭐⭐⭐⭐</div>
                  <p className="text-foreground text-sm leading-relaxed mb-2.5">"{review.text}"</p>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-xs font-semibold">— {review.name}</p>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.403 12.652a3 3 0 010-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                      Verified
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. FOOTER ────────────────────────────────────── */}
      <footer className="py-10 px-4 md:px-6 border-t border-border bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <img
              src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
              alt="Lowest Weplay"
              className="w-[90px] h-auto opacity-60" />
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <Link to="/refund-policy" className="hover:text-primary transition-colors duration-200">Refund Policy</Link>
              <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-200">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors duration-200">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors duration-200">Contact Us</Link>
            </div>
          </div>
          <div className="border-t border-border pt-5 text-center">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} Lowest Weplay. All rights reserved. Official Partner.
            </p>
          </div>
        </div>
      </footer>
    </div>);
};

export default Index;
