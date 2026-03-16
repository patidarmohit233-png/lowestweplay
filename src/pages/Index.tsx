import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Lock, Trophy, MessageSquare, Package } from "lucide-react";

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
  { icon: <Zap size={20} />, label: "Instant Delivery", val: "⚡ Instant" },
  { icon: <Lock size={20} />, label: "Secure Payment", val: "🔒 Secure" },
  { icon: <Trophy size={20} />, label: "Best Rates", val: "🏆 Lowest" },
  { icon: <MessageSquare size={20} />, label: "Live Support", val: "💬 24/7" },
  { icon: <Package size={20} />, label: "Happy Users", val: "📦 10k+" },
];

const Index = () => {
  useEffect(() => {
    // Tawk.to chat widget
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
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <img src="https://i.ibb.co/KxqYpjD1" alt="Lowest Weplay" className="h-[50px] w-[150px] object-contain" />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#products" className="hover:text-primary transition-colors">Products</a>
            <a href="#partners" className="hover:text-primary transition-colors">Partners</a>
            <div className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2 text-accent">
              <ShieldCheck size={18} />
              ID Safe Guarantee
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
          >
            <ShieldCheck size={16} />
            OFFICIAL WEPLAY TOPUP PARTNER
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display mb-6"
          >
            Premium Coins. <span className="text-primary">Lowest Prices.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Official WePlay top-up partner. Guaranteed ID safety with instant delivery.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex flex-col items-center p-4 rounded-2xl bg-muted border border-border"
              >
                <div className="text-primary mb-2">{badge.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{badge.label}</span>
                <span className="text-sm font-bold">{badge.val}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Products */}
      <section id="products" className="py-20 px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-display">Available Packages</h2>
            <p className="text-muted-foreground mt-2">Select your desired coin amount to proceed to secure checkout.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group bg-card rounded-3xl p-6 border border-border flex flex-col"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="aspect-square rounded-2xl bg-muted mb-6 overflow-hidden border border-border">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">{product.desc}</p>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold font-price">₹{product.price}</span>
                    <span className="ml-2 text-sm text-muted-foreground line-through">₹{product.mrp}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold">
                    SAVE {Math.round((1 - product.price / product.mrp) * 100)}%
                  </div>
                </div>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-center hover:opacity-90 transition-opacity block"
                  style={{ boxShadow: "var(--shadow-primary)" }}
                >
                  BUY NOW
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="py-24 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <h2 className="text-3xl font-display">Top Partners</h2>
          <p className="text-muted-foreground mt-2">Trusted by the biggest names in the community</p>
        </div>
        <div className="flex gap-8 animate-scroll-left whitespace-nowrap">
          {[...PARTNERS, ...PARTNERS].map((src, i) => (
            <img key={i} src={src} alt="Partner" className="h-64 w-48 object-cover rounded-2xl flex-shrink-0 border border-border" style={{ boxShadow: "var(--shadow-card)" }} />
          ))}
        </div>
      </section>

      {/* Video */}
      <section className="py-24 px-6 bg-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display text-background mb-12">How it Works</h2>
          <div className="aspect-video rounded-3xl overflow-hidden border-4 border-foreground/80" style={{ boxShadow: "var(--shadow-elevated)" }}>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Lowest Weplay. All rights reserved. Official Partner.</p>
      </footer>
    </div>
  );
};

export default Index;
