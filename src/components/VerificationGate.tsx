import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowRight, KeyRound, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import LOGO from "@/assets/logo.png";

export type VerifiedBuyer = { weplay_id: string; weplay_name: string };

const verifySchema = z.object({
  weplay_id: z.string().trim().min(3, "WePlay ID must be at least 3 characters").max(40, "Too long"),
  weplay_name: z.string().trim().min(2, "Name required").max(60, "Too long"),
});

const EASE = [0.22, 1, 0.36, 1] as const;

export default function VerificationGate({ onVerified }: { onVerified: (b: VerifiedBuyer) => void }) {
  const [form, setForm] = useState<VerifiedBuyer>({ weplay_id: "", weplay_name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = verifySchema.safeParse(form);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (flat[i.path[0] as string] = i.message));
      setErrors(flat);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.rpc("upsert_customer", {
      p_weplay_id: parsed.data.weplay_id,
      p_weplay_name: parsed.data.weplay_name,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      return;
    }
    onVerified(parsed.data as VerifiedBuyer);
    toast({ title: `Welcome, ${parsed.data.weplay_name}! 👋`, description: "Your WePlay ID is now your account ID." });
  };

  const field =
    "w-full px-4 py-3.5 rounded-2xl border bg-secondary/50 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-card transition-all";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="min-h-[100dvh] w-full flex items-center justify-center px-4 py-10 relative overflow-hidden bg-background"
    >
      {/* soft white → purple gradient background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, hsl(var(--background)), hsl(var(--primary)/0.09) 55%, hsl(var(--primary-glow)/0.16))" }}
      />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full pointer-events-none animate-aurora"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.18), transparent 62%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none animate-aurora"
        style={{ background: "radial-gradient(circle, hsl(var(--primary-glow)/0.18), transparent 65%)", animationDelay: "-6s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="relative z-10 w-full max-w-[30rem]"
      >
        <div
          className="rounded-[2rem] p-[1.5px] shadow-elevated"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.5), hsl(var(--primary-glow)/0.25), hsl(var(--accent)/0.3))" }}
        >
          <div className="rounded-[1.9rem] bg-card/90 backdrop-blur-2xl p-6 md:p-8">
            {/* brand */}
            <div className="text-center">
              <img src={LOGO} alt="Lowest Weplay — WePlay top-up store" className="mx-auto w-[180px] md:w-[210px] h-auto object-contain" />
              <p className="mt-2 text-[11.5px] md:text-[13px] font-semibold text-muted-foreground">India's Cheapest WePlay Top-Up</p>
              <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
                <Sparkles size={11} /> Verify to continue
              </span>
            </div>

            {/* form */}
            <div className="mt-6 rounded-[1.4rem] border border-border bg-secondary/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                  <KeyRound size={17} />
                </span>
                <h1 className="text-[14.5px] md:text-base font-extrabold text-foreground">Enter Your Details to Continue</h1>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <label className="block">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">WePlay ID</span>
                  <input
                    autoFocus
                    value={form.weplay_id}
                    onChange={(e) => setForm({ ...form, weplay_id: e.target.value })}
                    placeholder="Enter your WePlay ID"
                    className={`${field} mt-1.5 ${errors.weplay_id ? "border-destructive" : "border-border"}`}
                  />
                  {errors.weplay_id && <span className="text-[11px] text-destructive mt-1 block">{errors.weplay_id}</span>}
                </label>

                <label className="block">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Your Name</span>
                  <input
                    value={form.weplay_name}
                    onChange={(e) => setForm({ ...form, weplay_name: e.target.value })}
                    placeholder="Enter your Name"
                    className={`${field} mt-1.5 ${errors.weplay_name ? "border-destructive" : "border-border"}`}
                  />
                  {errors.weplay_name && <span className="text-[11px] text-destructive mt-1 block">{errors.weplay_name}</span>}
                </label>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl text-primary-foreground font-extrabold text-[11.5px] uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-primary disabled:opacity-70"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? "Verifying…" : "🚀 Verify & Login"} <ArrowRight size={14} />
                </motion.button>
              </form>

              <p className="mt-3.5 flex items-start gap-1.5 text-[11px] md:text-[12px] text-muted-foreground leading-relaxed">
                <Lock size={13} className="mt-[1px] shrink-0 text-accent" />
                We never ask for your password. Only your WePlay ID & Name.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-[10px] md:text-[11px] font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-accent">
                <ShieldCheck size={12} /> 100% ID Safe
              </span>
              <span>·</span>
              <span>Instant Delivery</span>
              <span>·</span>
              <span>24×7 Support</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.main>
  );
}
