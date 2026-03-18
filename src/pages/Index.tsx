import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package,
  ArrowRight, Search, CreditCard, Download, CheckCircle2,
  Sparkles, Star, Crown,
} from "lucide-react";

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.3, type: "spring", stiffness: 300 } }}
      className="group bg-card rounded-2xl p-5 border border-border flex flex-col hover:border-primary/20 transition-all duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="aspect-[4/3] rounded-xl bg-secondary overflow-hidden mb-5 relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">{product.name}</h3>
      <p className="text-muted-foreground text-sm mb-5 flex-grow leading-relaxed">{product.desc}</p>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-price text-foreground">₹{product.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
          SAVE {Math.round((1 - product.price / product.mrp) * 100)}%
        </span>
      </div>

      <motion.button
        onClick={() => navigate(`/checkout?product=${product.id}`)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-center flex items-center justify-center gap-2 text-sm transition-all duration-200 hover:shadow-[var(--shadow-primary)]"
      >
        BUY NOW <ArrowRight size={15} />
      </motion.button>
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
    s1.async = true;
    s1.src = "https://embed.tawk.to/698116f4c089511c3e6b3b82/1jgg43co1";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
    return () => { document.body.removeChild(s1); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">

      {/* ─── 1. PREMIUM STICKY HEADER ─────────────────────── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-[72px] flex items-center justify-between">
          <motion.img
            src="https://i.ibb.co/vCHmxWCc/Gemini-Generated-Image-qxp195qxp195qxp1-removebg-preview.png"
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
        className="relative pt-12 md:pt-24 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden"
      >
        {/* Layered background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-background" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[800px] bg-primary/[0.05] rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />
        <div className="absolute top-[100px] right-[-100px] w-[300px] h-[300px] bg-accent/[0.04] rounded-full blur-[80px] pointer-events-none" />

        {/* Floating orbs */}
        <FloatingOrb delay={0} x="10%" y="15%" size={12} />
        <FloatingOrb delay={1.2} x="85%" y="10%" size={8} color="accent" />
        <FloatingOrb delay={0.6} x="75%" y="55%" size={14} />
        <FloatingOrb delay={2} x="20%" y="65%" size={6} color="accent" />
        <FloatingOrb delay={0.8} x="50%" y="80%" size={10} />
        <FloatingOrb delay={1.5} x="92%" y="40%" size={9} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 180, damping: 15 }}
            className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-[10px] md:text-sm font-bold mb-6 md:mb-8"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Crown size={14} />
            </motion.span>
            OFFICIAL WEPLAY CC TOP-UP PARTNER
            <motion.span
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={14} className="text-primary/60" />
            </motion.span>
          </motion.div>

          {/* Main heading with staggered word animation */}
          <div className="overflow-hidden mb-5 md:mb-6">
            <motion.h1
              className="text-[2.5rem] leading-[1.08] md:text-7xl lg:text-8xl font-display"
            >
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                Premium Coins.
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block relative"
              >
                <span className="text-primary">Lowest Prices.</span>
                <motion.span
                  className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-[3px] md:h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                />
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-muted-foreground text-sm md:text-lg max-w-md md:max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed"
          >
            Official Weplay CC Top-up Partner. Guaranteed ID safety with instant delivery.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.a
              href="#products"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-shadow duration-300 hover:shadow-[var(--shadow-primary)] relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Browse Packages <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-4 bg-card text-foreground rounded-2xl font-bold text-sm border border-border flex items-center justify-center gap-2 hover:border-primary/25 transition-all duration-300 hover:shadow-[var(--shadow-card)]"
            >
              How It Works
            </motion.a>
          </motion.div>

          {/* Stats row with glassmorphism card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-12 md:mt-16 inline-flex items-center gap-6 md:gap-10 px-6 md:px-10 py-4 md:py-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <AnimatedStat value="10K+" label="Customers" delay={0.9} />
            <div className="w-px h-8 bg-border/60" />
            <AnimatedStat value="₹50L+" label="Delivered" delay={1.0} />
            <div className="w-px h-8 bg-border/60" />
            <AnimatedStat value="4.9★" label="Rating" delay={1.1} />
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
      <section id="products" className="py-16 md:py-24 px-4 md:px-6 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Available Packages" subtitle="Select your desired coin amount to proceed to secure checkout" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              src="https://i.ibb.co/vCHmxWCc/Gemini-Generated-Image-qxp195qxp195qxp1-removebg-preview.png"
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
