import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PRODUCTS: Record<string, { name: string; price: number }> = {
  "1": { name: "10K RED PACKET CC", price: 479 },
  "2": { name: "50K RED PACKET CC", price: 1299 },
  "3": { name: "10K GOLD CC", price: 479 },
  "4": { name: "50K GOLD CC", price: 1299 },
  "5": { name: "100K GOLD CC", price: 2199 },
  "6": { name: "250K GOLD CC", price: 4200 },
  "7": { name: "500K GOLD CC", price: 5999 },
};

const schema = z.object({
  weplay_id: z.string().trim().min(3, "WePlay ID must be at least 3 characters").max(40, "Too long"),
  weplay_name: z.string().trim().min(2, "Name required").max(60, "Too long"),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

export default function Verify() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const productId = params.get("product") ?? "";
  const product = useMemo(() => PRODUCTS[productId], [productId]);

  const [form, setForm] = useState({ weplay_id: "", weplay_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "Verify Your Order · Lowest Weplay";
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) {
      toast({ title: "Missing plan", description: "Please pick a plan from the homepage.", variant: "destructive" });
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (flat[i.path[0] as string] = i.message));
      setErrors(flat);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      weplay_id: parsed.data.weplay_id,
      weplay_name: parsed.data.weplay_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      product_id: productId,
      product_name: product.name,
      price: product.price,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground antialiased">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft size={16} /> Back
          </Link>
          <span className="inline-flex items-center gap-1.5 text-accent font-bold text-xs px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <ShieldCheck size={13} /> ID Safe
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} /> Verification Panel
          </span>
          <h1 className="text-3xl md:text-4xl font-display tracking-tight">Confirm Your Order Details</h1>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            After completing payment on Razorpay, fill this quick form so we can credit your coins.
          </p>
        </motion.div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-primary/20 p-8 text-center"
            style={{ boxShadow: "0 20px 50px -20px hsl(var(--primary) / 0.3)" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-display mb-2">Details Received!</h2>
            <p className="text-muted-foreground mb-6">
              We got your info. Coins will be credited to <span className="font-bold text-foreground">{form.weplay_id}</span> shortly.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90">
              Back to Home
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={submit}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 space-y-5"
            style={{ boxShadow: "0 20px 50px -20px rgba(79,70,229,0.2)" }}>

            {product ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary/60 border border-border/50">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Selected Plan</div>
                  <div className="text-sm font-extrabold text-foreground">{product.name}</div>
                </div>
                <div className="text-xl font-extrabold text-primary">₹{product.price}</div>
              </div>
            ) : (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                No plan selected. <Link to="/" className="underline font-bold">Pick one</Link>.
              </div>
            )}

            <Field
              label="WePlay ID"
              placeholder="e.g. WP123456"
              value={form.weplay_id}
              onChange={(v) => setForm({ ...form, weplay_id: v })}
              error={errors.weplay_id}
            />
            <Field
              label="WePlay Name"
              placeholder="Your in-game name"
              value={form.weplay_name}
              onChange={(v) => setForm({ ...form, weplay_name: v })}
              error={errors.weplay_name}
            />
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              error={errors.email}
            />
            <Field
              label="Phone (optional)"
              placeholder="+91…"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              error={errors.phone}
            />

            <button
              type="submit"
              disabled={submitting || !product}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/85 text-primary-foreground rounded-xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.97] transition-all hover:shadow-[0_10px_30px_-5px_hsl(var(--primary)/0.4)]">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit Details <CheckCircle2 size={16} /></>}
            </button>

            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              🔒 We only need your Player ID — never your password. Your details are encrypted and used solely to credit your coins.
            </p>
          </motion.form>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border bg-background text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${error ? "border-destructive" : "border-border"}`}
      />
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}
