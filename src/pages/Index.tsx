import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package,
  ArrowRight, Search, CreditCard, Download, CheckCircle2,
} from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "10K RED PACKET CC", img: "https://i.ibb.co/cSKD3KTJ/Gemini-Generated-Image-yy0rgmyy0rgmyy0r.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S" },
  { id: 2, name: "50K RED PACKET CC", img: "https://i.ibb.co/S4mD86b7/Gemini-Generated-Image-vtkas1vtkas1vtka.png", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", link: "https://rzp.io/rzp/IgGktT5" },
  { id: 3, name: "10K GOLD CC", img: "https://i.ibb.co/67QGZVkC/Gemini-Generated-Image-md8zx9md8zx9md8z.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S" },
  { id: 4, name: "50K GOLD CC", img: "https://i.ibb.co/vCN4LnQz/Gemini-Generated-Image-79nvx179nvx179nv.png", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", link: "https://rzp.io/rzp/IgGktT5" },
  { id: 5, name: "100K GOLD CC", img: "https://i.ibb.co/HT2nQycN/Gemini-Generated-Image-si6wdtsi6wdtsi6w-1.png", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", link: "https://rzp.io/rzp/1Thvvcy" },
  { id: 6, name: "250K GOLD CC", img: "https://i.ibb.co/7xmFjMhF/Gemini-Generated-Image-si6wdtsi6wdtsi6w.png", price: 4200, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", link: "https://rzp.io/rzp/y5vVPoSu" },
  { id: 7, name: "500K GOLD CC", img: "https://i.ibb.co/3m27gLp0/Gemini-Generated-Image-n9tkkdn9tkkdn9tk.png", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", link: "https://rzp.io/rzp/aRxqcoS" },
];

const PARTNERS = [
  "https://i.ibb.co/0RR4Pnw4/IMG-20260207-WA0006-jpg.jpg", "https://i.ibb.co/PvRLkRKD/IMG-20260207-WA0008-jpg.jpg", "https://i.ibb.co/8ndyfLhX/IMG-20260207-WA0007-jpg.jpg",
  "https://i.ibb.co/B2BKn1yd/IMG-20260207-WA0013-jpg.jpg", "https://i.ibb.co/mFv2cBxY/IMG-20260207-WA0012-jpg.jpg", "https://i.ibb.co/5Wprxhbn/IMG-20260207-WA0015-jpg.jpg",
  "https://i.ibb.co/6JsWj7xz/IMG-20260207-WA0011-jpg.jpg", "https://i.ibb.co/xStFSBcM/IMG-20260207-WA0009-jpg.jpg", "https://i.ibb.co/zWQpk8C9/IMG-20260207-WA0014-jpg.jpg",
  "https://i.ibb.co/BH8QYGVj/IMG-20260207-WA0005-jpg.jpg",
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.3 } }}
      className="group bg-card rounded-2xl p-5 border border-border flex flex-col hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-shadow duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="aspect-[4/3] rounded-xl bg-secondary overflow-hidden mb-5">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
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

      <motion.a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-bold text-center flex items-center justify-center gap-2 text-sm transition-shadow duration-200 hover:shadow-[0_8px_24px_-4px_hsl(244_63%_58%/0.3)]"
      >
        BUY NOW <ArrowRight size={15} />
      </motion.a>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════ */
const Index = () => {
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
    <div className="min-h-screen bg-background text-foreground antialiased">

      {/* ─── 1. STICKY HEADER ─────────────────────────────── */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-18 flex items-center justify-between">
          <img
            src="https://i.ibb.co/vCHmxWCc/Gemini-Generated-Image-qxp195qxp195qxp1-removebg-preview.png"
            alt="Lowest Weplay"
            className="w-[120px] md:w-[150px] h-auto object-contain"
          />
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#products" className="hover:text-primary transition-colors duration-300">Products</a>
            <a href="#partners" className="hover:text-primary transition-colors duration-300">Partners</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors duration-300">How It Works</a>
            <div className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1.5 text-accent font-bold text-xs">
              <ShieldCheck size={15} /> ID Safe
            </span>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <header className="pt-14 md:pt-20 pb-10 md:pb-14 px-4 md:px-6 bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs md:text-sm font-bold mb-6"
          >
            <ShieldCheck size={14} />
            OFFICIAL WEPLAY TOPUP PARTNER
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.1] mb-5"
          >
            Premium Coins.{" "}
            <span className="text-primary">Lowest Prices.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
          >
            Official WePlay top-up partner. Guaranteed ID safety with instant delivery.
          </motion.p>
        </div>
      </header>

      {/* ─── 2. TRUST BADGES ──────────────────────────────── */}
      <section className="py-6 md:py-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3">
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="flex flex-col items-center p-4 rounded-xl bg-card border border-border cursor-default transition-shadow duration-300 hover:shadow-[var(--shadow-elevated)]"
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
                  className="bg-card rounded-2xl border border-border p-6 text-center h-full"
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

      {/* ─── 8. FOOTER ────────────────────────────────────── */}
      <footer className="py-10 px-4 md:px-6 border-t border-border bg-card">
        <div className="max-w-5xl mx-auto text-center">
          <img
            src="https://i.ibb.co/vCHmxWCc/Gemini-Generated-Image-qxp195qxp195qxp1-removebg-preview.png"
            alt="Lowest Weplay"
            className="w-[100px] h-auto mx-auto mb-4 opacity-60"
          />
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground mb-4">
            <span>Refund Policy</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Lowest Weplay. All rights reserved. Official Partner.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
