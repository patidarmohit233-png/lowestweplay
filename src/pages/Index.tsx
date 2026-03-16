import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package, ArrowRight, Sparkles, Crown } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "10K RED PACKET CC", img: "https://i.ibb.co/cSKD3KTJ/Gemini-Generated-Image-yy0rgmyy0rgmyy0r.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S", tier: "red" },
  { id: 2, name: "50K RED PACKET CC", img: "https://i.ibb.co/S4mD86b7/Gemini-Generated-Image-vtkas1vtkas1vtka.png", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", link: "https://rzp.io/rzp/IgGktT5", tier: "red" },
  { id: 3, name: "10K GOLD CC", img: "https://i.ibb.co/67QGZVkC/Gemini-Generated-Image-md8zx9md8zx9md8z.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", link: "https://rzp.io/rzp/pWMzS6S", tier: "gold" },
  { id: 4, name: "50K GOLD CC", img: "https://i.ibb.co/vCN4LnQz/Gemini-Generated-Image-79nvx179nvx179nv.png", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", link: "https://rzp.io/rzp/IgGktT5", tier: "gold" },
  { id: 5, name: "100K GOLD CC", img: "https://i.ibb.co/HT2nQycN/Gemini-Generated-Image-si6wdtsi6wdtsi6w-1.png", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", link: "https://rzp.io/rzp/1Thvvcy", tier: "gold" },
  { id: 6, name: "250K GOLD CC", img: "https://i.ibb.co/7xmFjMhF/Gemini-Generated-Image-si6wdtsi6wdtsi6w.png", price: 4200, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", link: "https://rzp.io/rzp/y5vVPoSu", tier: "gold" },
  { id: 7, name: "500K GOLD CC", img: "https://i.ibb.co/3m27gLp0/Gemini-Generated-Image-n9tkkdn9tkkdn9tk.png", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", link: "https://rzp.io/rzp/aRxqcoS", tier: "gold" },
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

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } },
};

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="mb-14 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-5xl font-display text-foreground"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="text-muted-foreground mt-3 text-base md:text-lg max-w-xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isPopular = product.id === 5;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative glass-card rounded-2xl p-5 flex flex-col overflow-hidden ${isPopular ? "ring-2 ring-primary/50 animate-pulse-glow" : ""}`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <Crown size={12} /> POPULAR
        </div>
      )}
      {product.tier === "gold" && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-background" style={{ background: "var(--gradient-gold)" }}>
          <Sparkles size={11} /> GOLD
        </div>
      )}

      <div className="aspect-[4/3] rounded-xl bg-secondary/50 mb-5 overflow-hidden relative">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1.5 tracking-tight">{product.name}</h3>
      <p className="text-muted-foreground text-sm mb-5 flex-grow leading-relaxed">{product.desc}</p>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-bold font-price text-foreground">₹{product.price}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
        </div>
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="px-3 py-1.5 rounded-full text-xs font-bold text-accent"
          style={{ background: "hsl(160 84% 45% / 0.12)" }}
        >
          SAVE {Math.round((1 - product.price / product.mrp) * 100)}%
        </motion.div>
      </div>

      <motion.a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-glow w-full py-3.5 rounded-xl font-bold text-center text-primary-foreground flex items-center justify-center gap-2 text-sm"
      >
        BUY NOW <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </motion.a>
    </motion.div>
  );
}

const Index = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 glass border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <img src="https://i.ibb.co/vCHmxWCc/Gemini-Generated-Image-qxp195qxp195qxp1-removebg-preview.png" alt="Lowest Weplay" className="w-[120px] md:w-[150px] h-auto object-contain" />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#products" className="hover:text-foreground transition-colors duration-300">Products</a>
            <a href="#partners" className="hover:text-foreground transition-colors duration-300">Partners</a>
            <div className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2 text-accent font-bold">
              <ShieldCheck size={16} />
              ID Safe Guarantee
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <header ref={heroRef} className="relative pt-20 md:pt-28 pb-16 md:pb-24 px-4 md:px-6 hero-grid" style={{ background: "var(--gradient-hero)" }}>
        {/* Ambient orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 text-primary text-xs md:text-sm font-bold mb-8 shimmer-badge"
          >
            <ShieldCheck size={14} />
            OFFICIAL WEPLAY TOPUP PARTNER
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl lg:text-7xl font-display mb-6 leading-[1.1]"
          >
            Premium Coins.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              Lowest Prices.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Official WePlay top-up partner. Guaranteed ID safety with instant delivery.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-14"
          >
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={i}
                variants={stagger.item}
                whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                className="glass-card flex flex-col items-center p-4 rounded-xl cursor-default"
              >
                <div className="text-primary mb-2">{badge.icon}</div>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">{badge.label}</span>
                <span className="text-sm font-bold text-foreground">{badge.val}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </header>

      {/* Products */}
      <section id="products" className="relative py-20 md:py-28 px-4 md:px-6 section-glow-top">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Available Packages" subtitle="Select your desired coin amount to proceed to secure checkout." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="relative py-20 md:py-28 overflow-hidden section-glow-top">
        <SectionHeading title="Top Partners" subtitle="Trusted by the biggest names in the community" />
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-6 animate-scroll-left whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((src, i) => (
              <div key={i} className="flex-shrink-0 h-56 w-40 md:h-64 md:w-48 rounded-xl overflow-hidden glass-card p-1.5">
                <img src={src} alt="Partner" className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="relative py-20 md:py-28 px-4 md:px-6 section-glow-top">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="How it Works" subtitle="Watch a quick walkthrough of our seamless topup process" />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="aspect-video rounded-2xl overflow-hidden glass-card p-1.5"
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
              className="rounded-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 border-t border-border/30 text-center text-muted-foreground text-sm section-glow-top">
        <p>© {new Date().getFullYear()} Lowest Weplay. All rights reserved. Official Partner.</p>
      </footer>
    </div>
  );
};

export default Index;
