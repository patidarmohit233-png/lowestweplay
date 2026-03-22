import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Gamepad2, User, Mail, Phone,
  CheckCircle2, ShieldCheck, Loader2, Sparkles, Flame, Crown,
  Star, Zap, Lock, Clock,
} from "lucide-react";

const BADGES: Record<string, { text: string; icon: React.ReactNode; color: string }> = {
  "1": { text: "STARTER PICK", icon: <Zap size={11} />, color: "primary" },
  "2": { text: "BEST SELLER", icon: <Flame size={11} />, color: "accent" },
  "3": { text: "POPULAR", icon: <Star size={11} />, color: "primary" },
  "4": { text: "HOT DEAL", icon: <Flame size={11} />, color: "accent" },
  "5": { text: "MOST VALUE", icon: <Sparkles size={11} />, color: "primary" },
  "6": { text: "TOP CHOICE", icon: <Crown size={11} />, color: "accent" },
  "7": { text: "MEGA PACK", icon: <Crown size={11} />, color: "primary" },
};

const PRODUCTS: Record<string, { name: string; price: number; mrp: number; desc: string; img: string; link: string }> = {
  "1": { name: "10K RED PACKET CC", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804999/Gemini_Generated_Image_yy0rgmyy0rgmyy0r_dfnma9.png", link: "https://razorpay.me/@fluxfinds?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D" },
  "2": { name: "50K RED PACKET CC", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804998/Gemini_Generated_Image_vtkas1vtkas1vtka_oumu7o.png", link: "https://razorpay.me/@fluxfinds?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D" },
  "3": { name: "10K GOLD CC", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_md8zx9md8zx9md8z_yegmmu.png", link: "https://razorpay.me/@fluxfinds?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D" },
  "4": { name: "50K GOLD CC", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804978/Gemini_Generated_Image_79nvx179nvx179nv_xg3bis.png", link: "https://razorpay.me/@fluxfinds?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D" },
  "5": { name: "100K GOLD CC", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_si6wdtsi6wdtsi6w_1_ob3o8v.png", link: "https://razorpay.me/@fluxfinds?amount=PJ6ahFrCviFu2k0RR%2FxHaQ%3D%3D" },
  "6": { name: "250K GOLD CC", price: 4200, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_si6wdtsi6wdtsi6w_w9aomo.png", link: "https://razorpay.me/@fluxfinds?amount=oh4Guho1gKcvyRP5As1tWg%3D%3D" },
  "7": { name: "500K GOLD CC", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_n9tkkdn9tkkdn9tk_ljcct9.png", link: "https://razorpay.me/@fluxfinds?amount=Uj2fVBg%2FvclD1RF0o2z%2BbA%3D%3D" },
};

/* ── Animated field wrapper ─────────────────────────── */
function FieldWrapper({ icon, label, helper, error, valid, children, delay = 0 }: {
  icon: React.ReactNode; label: string; helper: string; error?: string; valid?: boolean; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2"
    >
      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <motion.span
          className="text-primary w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center"
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.span>
        {label}
        <AnimatePresence>
          {valid && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="ml-auto"
            >
              <CheckCircle2 size={16} className="text-accent" />
            </motion.span>
          )}
        </AnimatePresence>
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-destructive font-medium pl-1"
          >
            {error}
          </motion.p>
        ) : (
          <motion.p
            key="helper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground pl-1"
          >
            {helper}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Floating particle ──────────────────────────────── */
function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/6 blur-sm pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ y: [0, -20, 0], opacity: [0.15, 0.5, 0.15], scale: [1, 1.4, 1] }}
      transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const Checkout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("product") || "1";
  const product = PRODUCTS[productId];
  const badge = BADGES[productId];

  const [form, setForm] = useState({ weplayId: "", weplayName: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [step, setStep] = useState(0); // 0 = product summary, auto-advances

  useEffect(() => {
    const saved = localStorage.getItem("lw_customer");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((f) => ({ ...f, ...parsed }));
        setSaveInfo(true);
      } catch { /* ignore */ }
    }
    // Auto-advance step for entrance animation
    const t = setTimeout(() => setStep(1), 100);
    return () => clearTimeout(t);
  }, []);

  if (!product) {
    navigate("/");
    return null;
  }

  const discount = Math.round((1 - product.price / product.mrp) * 100);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.weplayId.trim()) e.weplayId = "WePlay ID is required";
    if (!form.weplayName.trim()) e.weplayName = "WePlay name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit number";
    return e;
  };

  const isFieldValid = (field: string) => {
    if (!touched[field]) return false;
    const v = validate();
    return !v[field] && form[field as keyof typeof form].trim() !== "";
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const v = validate();
    setErrors((prev) => ({ ...prev, [field]: v[field] || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { weplayId: true, weplayName: true, email: true, phone: true };
    setTouched(allTouched);
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    if (saveInfo) {
      localStorage.setItem("lw_customer", JSON.stringify({ weplayId: form.weplayId, weplayName: form.weplayName, email: form.email, phone: form.phone }));
    } else {
      localStorage.removeItem("lw_customer");
    }

    // Save order to database
    try {
      await supabase.from("orders").insert({
        weplay_id: form.weplayId.trim(),
        weplay_name: form.weplayName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        product_id: productId,
        product_name: product.name,
        price: product.price,
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    }

    localStorage.setItem("lw_checkout", JSON.stringify({ productId, ...form }));
    setTimeout(() => navigate(`/payment?product=${productId}`), 400);
  };

  const inputCls = (field: string) =>
    `w-full h-12 rounded-xl border bg-background/60 backdrop-blur-sm px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-background/80 ${
      errors[field] && touched[field] ? "border-destructive ring-1 ring-destructive/20" : isFieldValid(field) ? "border-accent/40 bg-accent/[0.03]" : "border-border hover:border-primary/25"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background flex items-start justify-center px-4 py-8 md:py-16 relative overflow-hidden">
      {/* Background particles */}
      <FloatingParticle delay={0} x="8%" y="12%" size={14} />
      <FloatingParticle delay={1.5} x="88%" y="8%" size={10} />
      <FloatingParticle delay={0.8} x="75%" y="60%" size={16} />
      <FloatingParticle delay={2.2} x="15%" y="70%" size={8} />
      <FloatingParticle delay={1} x="50%" y="85%" size={12} />

      {/* Background glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-accent/[0.03] rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[520px] relative z-10"
      >
        {/* Premium glass card */}
        <div className="bg-card/70 backdrop-blur-2xl rounded-3xl border border-border/50 overflow-hidden" style={{ boxShadow: "0 25px 60px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.05) inset" }}>

          {/* ─── Header ─────────────────────────────────── */}
          <div className="p-5 md:p-7 border-b border-border/40 relative overflow-hidden">
            {/* Subtle header gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.02] pointer-events-none" />

            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Products
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative"
            >
              <h1 className="text-xl md:text-2xl font-display text-foreground mb-1">Complete Your Purchase</h1>
              <p className="text-xs text-muted-foreground">Fill in your details to proceed securely</p>
            </motion.div>

            {/* ─── Product summary card ──────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 border border-border/30 overflow-hidden relative group"
            >
              {/* Badge */}
              {badge && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className={`absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    badge.color === "accent"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {badge.icon}
                  </motion.span>
                  {badge.text}
                </motion.div>
              )}

              <div className="flex items-center gap-4 p-4">
                <motion.div
                  className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-background/40 shrink-0 border border-border/20"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{product.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold font-price text-foreground">₹{product.price}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
                      className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold"
                    >
                      {discount}% OFF
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── Trust indicators ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="px-5 md:px-7 pt-4 pb-1"
          >
            <div className="flex items-center justify-center gap-4 md:gap-6">
              {[
                { icon: <Lock size={12} />, text: "Encrypted" },
                { icon: <Zap size={12} />, text: "Instant" },
                { icon: <Clock size={12} />, text: "24/7 Support" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                >
                  <span className="text-primary/70">{item.icon}</span>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── Form ────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="p-5 md:p-7 space-y-5">
            <FieldWrapper delay={0.3} icon={<Gamepad2 size={15} />} label="WePlay ID" helper="Enter your WePlay ID (e.g., WP123456)" error={touched.weplayId ? errors.weplayId : undefined} valid={isFieldValid("weplayId")}>
              <input
                className={inputCls("weplayId")}
                placeholder="WP123456"
                value={form.weplayId}
                onChange={(e) => setForm({ ...form, weplayId: e.target.value })}
                onBlur={() => handleBlur("weplayId")}
              />
            </FieldWrapper>

            <FieldWrapper delay={0.38} icon={<User size={15} />} label="WePlay Name" helper="Your in-game display name" error={touched.weplayName ? errors.weplayName : undefined} valid={isFieldValid("weplayName")}>
              <input
                className={inputCls("weplayName")}
                placeholder="Your display name"
                value={form.weplayName}
                onChange={(e) => setForm({ ...form, weplayName: e.target.value })}
                onBlur={() => handleBlur("weplayName")}
              />
            </FieldWrapper>

            <FieldWrapper delay={0.46} icon={<Mail size={15} />} label="Email Address" helper="For payment confirmation" error={touched.email ? errors.email : undefined} valid={isFieldValid("email")}>
              <input
                type="email"
                className={inputCls("email")}
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => handleBlur("email")}
              />
            </FieldWrapper>

            <FieldWrapper delay={0.54} icon={<Phone size={15} />} label="Phone Number" helper="For delivery updates (optional)" error={touched.phone ? errors.phone : undefined} valid={isFieldValid("phone")}>
              <div className="flex gap-2">
                <div className="h-12 px-3.5 rounded-xl border border-border bg-secondary/50 backdrop-blur-sm flex items-center text-sm font-semibold text-muted-foreground shrink-0">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  className={inputCls("phone")}
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  onBlur={() => handleBlur("phone")}
                />
              </div>
            </FieldWrapper>

            {/* Save info */}
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
                />
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Save my details for next time</span>
            </motion.label>

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-[hsl(260_55%_52%)] to-[hsl(270_60%_55%)] text-primary-foreground font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-[0_12px_30px_-8px_hsl(var(--primary)/0.4)] disabled:opacity-70 relative overflow-hidden group"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
              {loading ? (
                <Loader2 size={18} className="animate-spin relative z-10" />
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  PROCEED TO PAYMENT <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </motion.button>

            {/* Security footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex flex-col items-center gap-2 pt-1"
            >
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-accent" /> Your data is secure and encrypted
              </p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
                <span>🔐 256-bit SSL</span>
                <span>•</span>
                <span>Powered by Razorpay</span>
              </div>
            </motion.div>
          </form>
        </div>

        {/* Bottom trust card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="mt-4 p-3.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/30 flex items-center justify-center gap-6 text-[11px] text-muted-foreground"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-accent" /> Verified Seller</span>
          <span className="flex items-center gap-1.5"><Star size={13} className="text-primary" /> 4.9★ Rating</span>
          <span className="flex items-center gap-1.5"><Zap size={13} className="text-primary" /> 10K+ Orders</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Checkout;
