import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package,
  ArrowRight, Search, CreditCard, Download, CheckCircle2,
  Sparkles, Star, Crown, Flame,
} from "lucide-react";

const PRODUCT_BADGES: Record<number, { text: string; icon: React.ReactNode; color: string }> = {
  1: { text: "STARTER PICK", icon: <Zap size={11} />, color: "primary" },
  2: { text: "BEST SELLER", icon: <Flame size={11} />, color: "accent" },
  3: { text: "POPULAR", icon: <Star size={11} />, color: "primary" },
  4: { text: "HOT DEAL", icon: <Flame size={11} />, color: "accent" },
  5: { text: "MOST VALUE", icon: <Sparkles size={11} />, color: "primary" },
  6: { text: "TOP CHOICE", icon: <Crown size={11} />, color: "accent" },
  7: { text: "MEGA PACK", icon: <Crown size={11} />, color: "primary" },
};

const PRODUCTS = [
  { id: 1, name: "10K RED PACKET CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804999/Gemini_Generated_Image_yy0rgmyy0rgmyy0r_dfnma9.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S" },
  { id: 2, name: "50K RED PACKET CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804998/Gemini_Generated_Image_vtkas1vtkas1vtka_oumu7o.png", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", link: "https://rzp.io/rzp/IgGktT5" },
  { id: 3, name: "10K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_md8zx9md8zx9md8z_yegmmu.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S" },
  { id: 4, name: "50K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804978/Gemini_Generated_Image_79nvx179nvx179nv_xg3bis.png", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", link: "https://rzp.io/rzp/IgGktT5" },
  { id: 5, name: "100K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_si6wdtsi6wdtsi6w_1_ob3o8v.png", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", link: "https://rzp.io/rzp/1Thvvcy" },
  { id: 6, name: "250K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_si6wdtsi6wdtsi6w_w9aomo.png", price: 4200, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", link: "https://rzp.io/rzp/y5vVPoSu" },
  { id: 7, name: "500K GOLD CC", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_n9tkkdn9tkkdn9tk_ljcct9.png", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", link: "https://rzp.io/rzp/aRxqcoS" },
];

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
  "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804949/IMG-20260207-WA0005.jpg_uxirw9.jpg",
];

const TRUST_BADGES = [
  { icon: <Zap size={22} />, label: "Instant Delivery", val: "⚡ Instant" },
  { icon: <Lock size={22} />, label: "Secure Payment", val: "🔒 Secure" },
  { icon: <Trophy size={22} />, label: "Best Rates", val: "🏆 Lowest" },
  { icon: <MessageSquare size={22} />, label: "Live Support", val: "💬 24/7" },
  { icon: <Package size={22} />, label: "Happy Users", val: "📦 10k+" },
];

const STEPS = [
  { icon: <Search size={28} />, title: "Choose Package", desc: "Browse our collection and pick your ideal coin bundle" },
  { icon: <CreditCard size={28} />, title: "Secure Payment", desc: "Pay safely via Razorpay with UPI, cards or wallets" },
  { icon: <Download size={28} />, title: "Instant Delivery", desc: "Coins are credited to your account within minutes" },
  { icon: <CheckCircle2 size={28} />, title: "Start Playing", desc: "Enjoy your coins with full ID safety guarantee" },
];

/* ── Reusable fade-in wrapper ─────────────────────────── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Section heading ──────────────────────────────────── */
function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <FadeIn className="mb-12 md:mb-16 text-center">
      <h2 className="text-3xl md:text-4xl font-display text-foreground">
        {title}
      </h2>
      <p className="text-muted-foreground mt-3 text-base max-w-lg mx-auto">{subtitle}</p>
    </FadeIn>
  );
}

/* ── Product Card ─────────────────────────────────────── */
function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const badge = PRODUCT_BADGES[product.id];
  const discount = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.35, type: "spring", stiffness: 280, damping: 20 } }}
      className="group relative bg-card rounded-3xl border border-border/60 flex flex-col hover:border-primary/25 transition-all duration-500 overflow-hidden"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Top gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${badge?.color === "accent" ? "bg-gradient-to-r from-transparent via-accent to-transparent" : "bg-gradient-to-r from-transparent via-primary to-transparent"} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Image section */}
      <div className="aspect-[4/3] bg-gradient-to-br from-secondary via-secondary/80 to-secondary/40 overflow-hidden relative m-3 rounded-2xl">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
        />
        {/* Hover overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -5 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: index * 0.08 + 0.35, type: "spring", stiffness: 300, damping: 15 }}
            className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold backdrop-blur-xl ${
              badge.color === "accent"
                ? "bg-accent/20 text-accent border border-accent/25 shadow-[0_2px_12px_-2px_hsl(var(--accent)/0.3)]"
                : "bg-primary/20 text-primary border border-primary/25 shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.3)]"
            }`}
          >
            <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5 }}>
              {badge.icon}
            </motion.span>
            {badge.text}
          </motion.div>
        )}

        {/* Discount pill */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.08 + 0.4 }}
          className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-foreground/80 backdrop-blur-md text-background text-[10px] font-bold"
        >
          {discount}% OFF
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-foreground mb-1 tracking-tight">{product.name}</h3>
        <p className="text-muted-foreground text-xs mb-4 flex-grow leading-relaxed">{product.desc}</p>

        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-price text-foreground">₹{product.price}</span>
              <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-accent font-semibold">
            <Zap size={11} />
            Instant
          </div>
        </div>

        <motion.button
          onClick={() => navigate(`/checkout?product=${product.id}`)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-center flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:shadow-[0_8px_24px_-4px_hsl(var(--primary)/0.35)] relative overflow-hidden group/btn"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <span className="relative z-10 flex items-center gap-2">
            BUY NOW <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Floating orb for hero ────────────────────────────── */
function FloatingOrb({ delay, x, y, size, color = "primary" }: { delay: number; x: string; y: string; size: number; color?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color === "accent" ? "bg-accent/8" : "bg-primary/8"} blur-sm`}
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        x: [0, 10, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Animated counter ─────────────────────────────────── */
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 150 }}
      className="text-center relative group"
    >
      <motion.div
        className="text-xl md:text-2xl font-display text-foreground"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {value}
      </motion.div>
      <div className="text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wide uppercase">{label}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
const Index = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.92]);
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);

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

      {/* ─── 1. PREMIUM STICKY HEADER ─────────────────────── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-[72px] flex items-center justify-between">
          <motion.img
            src="https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png"
            alt="Lowest Weplay"
            className="w-[110px] md:w-[150px] h-auto object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
              {[
                { label: "Products", href: "#products" },
                { label: "Partners", href: "#partners" },
                { label: "How It Works", href: "#how-it-works" },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative hover:text-primary transition-colors duration-300"
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>
            <motion.span
              className="flex items-center gap-1.5 text-accent font-bold text-[10px] md:text-xs px-3 py-1.5 rounded-full bg-accent/8 border border-accent/15"
              animate={{
                boxShadow: [
                  "0 0 0px hsl(var(--accent)/0)",
                  "0 0 16px hsl(var(--accent)/0.2)",
                  "0 0 0px hsl(var(--accent)/0)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <ShieldCheck size={13} /> ID Safe
            </motion.span>
          </div>
        </div>
      </motion.nav>

      {/* ─── PREMIUM HERO ─────────────────────────────────── */}
      <motion.header
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative pt-10 md:pt-20 pb-20 md:pb-32 px-4 md:px-6 overflow-hidden"
      >
        {/* Layered background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-background to-background" />
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[700px] md:w-[1100px] h-[700px] md:h-[900px] bg-primary/[0.04] rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />
        <div className="absolute top-[50px] right-[-150px] w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating orbs */}
        <FloatingOrb delay={0} x="8%" y="20%" size={16} />
        <FloatingOrb delay={1.2} x="88%" y="12%" size={10} color="accent" />
        <FloatingOrb delay={0.6} x="78%" y="55%" size={18} />
        <FloatingOrb delay={2} x="18%" y="68%" size={8} color="accent" />
        <FloatingOrb delay={0.8} x="45%" y="82%" size={12} />
        <FloatingOrb delay={1.5} x="92%" y="38%" size={11} />
        <FloatingOrb delay={0.3} x="3%" y="45%" size={7} />
        <FloatingOrb delay={1.8} x="60%" y="8%" size={9} color="accent" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 160, damping: 14 }}
            className="inline-flex items-center gap-2.5 px-5 md:px-6 py-2.5 md:py-3 rounded-2xl bg-primary/6 border border-primary/12 text-primary text-[10px] md:text-xs font-bold mb-7 md:mb-10 backdrop-blur-md"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Crown size={15} />
            </motion.span>
            OFFICIAL WEPLAY CC TOP-UP PARTNER
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={14} className="text-primary/50" />
            </motion.span>
          </motion.div>

          {/* Main heading */}
          <div className="mb-5 md:mb-7">
            <motion.h1
              className="text-[2.8rem] leading-[1.05] md:text-7xl lg:text-[5.5rem] font-display tracking-tight"
            >
              <motion.span
                initial={{ opacity: 0, y: 70, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                Get More.
              </motion.span>
              <br className="md:hidden" />
              {" "}
              <motion.span
                initial={{ opacity: 0, y: 70, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block relative"
              >
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    Pay Less.
                  </span>
                  <motion.span
                    className="absolute -bottom-1.5 md:-bottom-2.5 left-0 right-0 h-[3px] md:h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-muted-foreground text-sm md:text-lg max-w-sm md:max-w-xl mx-auto mb-9 md:mb-12 leading-relaxed"
          >
            India's most trusted Weplay CC topup service. Guaranteed ID safety, instant delivery & best prices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.a
              href="#products"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-10 py-4.5 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-[0_12px_30px_-6px_hsl(var(--primary)/0.4)] relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                Browse Packages <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-10 py-4.5 bg-card/80 backdrop-blur-md text-foreground rounded-2xl font-bold text-sm border border-border/60 flex items-center justify-center gap-2 hover:border-primary/25 transition-all duration-300 hover:shadow-[var(--shadow-elevated)]"
            >
              How It Works
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 md:mt-20 inline-flex items-center gap-5 md:gap-10 px-7 md:px-12 py-5 md:py-6 rounded-3xl bg-card/50 backdrop-blur-2xl border border-border/40"
            style={{ boxShadow: "0 20px 50px -15px rgb(0 0 0 / 0.06), var(--shadow-glow)" }}
          >
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
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              whileHover={{ scale: 1.05, y: -3, transition: { type: "spring", stiffness: 400 } }}
              className="flex flex-col items-center p-4 rounded-xl bg-card border border-border cursor-default transition-all duration-300 hover:border-primary/20 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="text-primary mb-2">{badge.icon}</div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">{badge.label}</span>
              <span className="text-sm font-bold text-foreground">{badge.val}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 3. PARTNERS CAROUSEL ─────────────────────────── */}
      <section id="partners" className="py-14 md:py-20 overflow-hidden">
        <SectionHeading title="Top Partners" subtitle="Trusted by the biggest names in the community" />
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex gap-5 animate-scroll-left whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((src, i) => (
              <div key={i} className="flex-shrink-0 h-52 w-40 md:h-60 md:w-44 rounded-xl overflow-hidden border border-border bg-card p-1.5" style={{ boxShadow: "var(--shadow-card)" }}>
                <img src={src} alt="Partner" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. PRODUCTS ──────────────────────────────────── */}
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/6 border border-primary/12 text-primary text-[10px] font-bold mb-4 md:mb-5"
            >
              <Sparkles size={12} /> PREMIUM PACKAGES
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-display text-foreground">
              Choose Your <span className="text-primary">Package</span>
            </h2>
            <p className="text-muted-foreground mt-3 md:mt-4 text-sm md:text-base max-w-lg mx-auto">Select your desired coin amount and proceed to secure checkout</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
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
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/wGYGm31bhZM"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
                {["No Password Needed", "Official Partner", "Instant Refund Policy"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/8 text-accent border border-accent/15">
                    <CheckCircle2 size={14} /> {item}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── 7. HOW IT WORKS ──────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="How It Works" subtitle="Get your coins in 4 simple steps" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative">
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className="bg-card rounded-2xl border border-border p-6 text-center h-full hover:border-primary/20 transition-all duration-300"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/8 text-primary mb-4" style={{ animation: `step-bounce 3s ease-in-out ${i * 0.5}s infinite` }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Step {i + 1}</div>
                  <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-border">
                    <ArrowRight size={18} />
                  </div>
                )}
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
              className="w-[100px] h-auto opacity-60"
            />
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
  );
};

export default Index;
