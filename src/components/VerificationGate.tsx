import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowRight, KeyRound, Lock, ShieldCheck, Sparkles, Gamepad2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const LOGO = "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png";

export type VerifiedBuyer = { game: string; user_id: string; name: string };

const verifySchema = z.object({
  game: z.string().min(1, "Select a game"),
  user_id: z.string().trim().min(3, "ID must be at least 3 characters").max(40, "Too long"),
  name: z.string().trim().optional(),
}).refine((data) => {
  if (['WePlay', 'Jackaroo'].includes(data.game)) {
    return data.name && data.name.trim().length >= 2;
  }
  return true;
}, {
  message: "Name required for this game",
  path: ["name"],
});

const GAMES = [
  { id: 'WePlay', name: 'WePlay', icon: '🎮', needsName: true },
  { id: 'Jackaroo', name: 'Jackaroo', icon: '🃏', needsName: true },
  { id: 'BGMI', name: 'BGMI', icon: '🔫', needsName: false },
  { id: 'Free Fire', name: 'Free Fire', icon: '🔥', needsName: false },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function VerificationGate({ onVerified }: { onVerified: (b: VerifiedBuyer) => void }) {
  const [form, setForm] = useState<VerifiedBuyer>({ game: "WePlay", user_id: "", name: "" });
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

    const { data: existingUser } = await supabase
      .from('customers')
      .select('*')
      .eq('weplay_id', parsed.data.user_id)
      .single();

    const { error } = await supabase.from('customers').upsert({
      weplay_id: parsed.data.user_id,
      weplay_name: parsed.data.name || parsed.data.user_id,
      last_active: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      return;
    }
    
    onVerified({
      game: parsed.data.game,
      user_id: parsed.data.user_id,
      name: parsed.data.name || parsed.data.user_id
    });

    if (existingUser) {
      toast({ title: `Welcome back, ${existingUser.weplay_name}! 👋`, description: `Logged in to your ${parsed.data.game} account.` });
    } else {
      toast({ title: `Welcome, ${parsed.data.name || parsed.data.user_id}! 👋`, description: "Your account has been created." });
    }

  };

  const field =
    "w-full px-4 py-3.5 rounded-2xl border bg-secondary/50 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-card transition-all";

  const currentGame = GAMES.find(g => g.id === form.game);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-0 z-[100] min-h-[100dvh] w-full flex items-center justify-center px-4 py-10 overflow-y-auto"
    >
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-[10px]"
        style={{ background: "linear-gradient(160deg, hsl(var(--background)/0.7), hsl(var(--primary)/0.12) 55%, hsl(var(--primary-glow)/0.18))" }}
      />
      <div aria-hidden className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-[30rem]"
      >
        <div
          className="rounded-[2rem] p-[1.5px] shadow-elevated"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.5), hsl(var(--primary-glow)/0.25), hsl(var(--accent)/0.3))" }}
        >
          <div className="rounded-[1.9rem] bg-card/90 backdrop-blur-2xl p-6 md:p-8">
            <div className="text-center">
              <img src={LOGO} alt="Lowest Weplay" className="mx-auto w-[180px] md:w-[210px] h-auto object-contain" />
              <p className="mt-2 text-[11.5px] md:text-[13px] font-semibold text-muted-foreground uppercase tracking-widest">Premium Gaming Top-Up</p>
              <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary">
                <Sparkles size={11} /> Verify to continue
              </span>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-border bg-secondary/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                  <Gamepad2 size={17} />
                </span>
                <h1 className="text-[14.5px] md:text-base font-extrabold text-foreground">Select Game & Enter Details</h1>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {GAMES.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setForm({ ...form, game: g.id })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                        form.game === g.id
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card/50 border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <span>{g.icon}</span>
                      {g.name}
                    </button>
                  ))}
                </div>

                <label className="block">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">{form.game} ID</span>
                  <div className="relative mt-1.5">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
                    <input
                      autoFocus
                      value={form.user_id}
                      onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                      placeholder={`Enter your ${form.game} ID`}
                      className={`${field} pl-11 ${errors.user_id ? "border-destructive" : "border-border"}`}
                    />
                  </div>
                  {errors.user_id && <span className="text-[11px] text-destructive mt-1 block">{errors.user_id}</span>}
                </label>

                {currentGame?.needsName && (
                  <label className="block">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Character Name</span>
                    <div className="relative mt-1.5">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={16} />
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter your character name"
                        className={`${field} pl-11 ${errors.name ? "border-destructive" : "border-border"}`}
                      />
                    </div>
                    {errors.name && <span className="text-[11px] text-destructive mt-1 block">{errors.name}</span>}
                  </label>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl text-primary-foreground font-extrabold text-[11.5px] uppercase tracking-[0.16em] flex items-center justify-center gap-2 shadow-primary disabled:opacity-70 mt-2"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? "Verifying…" : "🔓 Verify & Login"} <ArrowRight size={14} />
                </motion.button>
              </form>

              <p className="mt-4 flex items-start gap-1.5 text-[11px] md:text-[12px] text-muted-foreground leading-relaxed">
                <Lock size={13} className="mt-[1px] shrink-0 text-accent" />
                Your data is stored securely. We only need your ID for processing.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 text-[10px] md:text-[11px] font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-accent">
                <ShieldCheck size={12} /> Secure Connection
              </span>
              <span>·</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.main>
  );
}
