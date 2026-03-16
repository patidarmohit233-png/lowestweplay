import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Gamepad2, User, Mail, Phone,
  CheckCircle2, ShieldCheck, Loader2,
} from "lucide-react";

const PRODUCTS: Record<string, { name: string; price: number; mrp: number; desc: string; img: string; link: string }> = {
  "1": { name: "10K RED PACKET CC", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", img: "https://i.ibb.co/cSKD3KTJ/Gemini-Generated-Image-yy0rgmyy0rgmyy0r.png", link: "https://razorpay.me/@fluxfinds?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D" },
  "2": { name: "50K RED PACKET CC", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", img: "https://i.ibb.co/S4mD86b7/Gemini-Generated-Image-vtkas1vtkas1vtka.png", link: "https://razorpay.me/@fluxfinds?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D" },
  "3": { name: "10K GOLD CC", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", img: "https://i.ibb.co/67QGZVkC/Gemini-Generated-Image-md8zx9md8zx9md8z.png", link: "https://razorpay.me/@fluxfinds?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D" },
  "4": { name: "50K GOLD CC", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", img: "https://i.ibb.co/vCN4LnQz/Gemini-Generated-Image-79nvx179nvx179nv.png", link: "https://razorpay.me/@fluxfinds?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D" },
  "5": { name: "100K GOLD CC", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", img: "https://i.ibb.co/HT2nQycN/Gemini-Generated-Image-si6wdtsi6wdtsi6w-1.png", link: "https://razorpay.me/@fluxfinds?amount=PJ6ahFrCviFu2k0RR%2FxHaQ%3D%3D" },
  "6": { name: "250K GOLD CC", price: 4200, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", img: "https://i.ibb.co/7xmFjMhF/Gemini-Generated-Image-si6wdtsi6wdtsi6w.png", link: "https://razorpay.me/@fluxfinds?amount=oh4Guho1gKcvyRP5As1tWg%3D%3D" },
  "7": { name: "500K GOLD CC", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", img: "https://i.ibb.co/3m27gLp0/Gemini-Generated-Image-n9tkkdn9tkkdn9tk.png", link: "https://razorpay.me/@fluxfinds?amount=Uj2fVBg%2FvclD1RF0o2z%2BbA%3D%3D" },
};

function FieldWrapper({ icon, label, helper, error, valid, children }: {
  icon: React.ReactNode; label: string; helper: string; error?: string; valid?: boolean; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-1.5"
    >
      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary">{icon}</span>
        {label}
        {valid && <CheckCircle2 size={14} className="text-accent ml-auto" />}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive font-medium">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{helper}</p>
      )}
    </motion.div>
  );
}

const Checkout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("product") || "1";
  const product = PRODUCTS[productId];

  const [form, setForm] = useState({ weplayId: "", weplayName: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lw_customer");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((f) => ({ ...f, ...parsed }));
        setSaveInfo(true);
      } catch { /* ignore */ }
    }
  }, []);

  if (!product) {
    navigate("/");
    return null;
  }

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

  const handleSubmit = (e: React.FormEvent) => {
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
    localStorage.setItem("lw_checkout", JSON.stringify({ productId, ...form }));
    setTimeout(() => navigate(`/payment?product=${productId}`), 400);
  };

  const inputCls = (field: string) =>
    `w-full h-12 rounded-xl border bg-background/60 px-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary ${
      errors[field] && touched[field] ? "border-destructive ring-1 ring-destructive/20" : isFieldValid(field) ? "border-accent/40" : "border-border"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-start justify-center px-4 py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[500px]"
      >
        {/* Glass card */}
        <div className="bg-card/80 backdrop-blur-2xl rounded-2xl border border-border/60 overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>

          {/* Header */}
          <div className="p-5 md:p-6 border-b border-border/60">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back to Products
            </button>
            <h1 className="text-xl md:text-2xl font-display text-foreground">Complete Your Purchase</h1>

            {/* Product summary */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/40"
            >
              <img src={product.img} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold font-price text-foreground">₹{product.price}</p>
                <p className="text-xs text-muted-foreground line-through">₹{product.mrp}</p>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
            <FieldWrapper icon={<Gamepad2 size={16} />} label="WePlay ID" helper="Enter your WePlay ID (e.g., WP123456)" error={touched.weplayId ? errors.weplayId : undefined} valid={isFieldValid("weplayId")}>
              <input
                className={inputCls("weplayId")}
                placeholder="WP123456"
                value={form.weplayId}
                onChange={(e) => setForm({ ...form, weplayId: e.target.value })}
                onBlur={() => handleBlur("weplayId")}
              />
            </FieldWrapper>

            <FieldWrapper icon={<User size={16} />} label="WePlay Name" helper="Your in-game display name" error={touched.weplayName ? errors.weplayName : undefined} valid={isFieldValid("weplayName")}>
              <input
                className={inputCls("weplayName")}
                placeholder="Your display name"
                value={form.weplayName}
                onChange={(e) => setForm({ ...form, weplayName: e.target.value })}
                onBlur={() => handleBlur("weplayName")}
              />
            </FieldWrapper>

            <FieldWrapper icon={<Mail size={16} />} label="Email Address" helper="For payment confirmation" error={touched.email ? errors.email : undefined} valid={isFieldValid("email")}>
              <input
                type="email"
                className={inputCls("email")}
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onBlur={() => handleBlur("email")}
              />
            </FieldWrapper>

            <FieldWrapper icon={<Phone size={16} />} label="Phone Number" helper="For delivery updates (optional)" error={touched.phone ? errors.phone : undefined} valid={isFieldValid("phone")}>
              <div className="flex gap-2">
                <div className="h-12 px-3 rounded-xl border border-border bg-secondary/60 flex items-center text-sm font-semibold text-muted-foreground shrink-0">
                  +91
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
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
              />
              <span className="text-xs text-muted-foreground">Save my details for next time</span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[hsl(270_60%_55%)] text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 transition-shadow duration-200 hover:shadow-[var(--shadow-primary)] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>PROCEED TO PAYMENT <ArrowRight size={15} /></>
              )}
            </motion.button>

            {/* Privacy */}
            <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-accent" /> Your data is secure and encrypted
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
