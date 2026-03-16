import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

const LINKS: Record<string, string> = {
  "1": "https://razorpay.me/@fluxfinds?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D",
  "2": "https://razorpay.me/@fluxfinds?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D",
  "3": "https://razorpay.me/@fluxfinds?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D",
  "4": "https://razorpay.me/@fluxfinds?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D",
  "5": "https://razorpay.me/@fluxfinds?amount=PJ6ahFrCviFu2k0RR%2FxHaQ%3D%3D",
  "6": "https://razorpay.me/@fluxfinds?amount=oh4Guho1gKcvyRP5As1tWg%3D%3D",
  "7": "https://razorpay.me/@fluxfinds?amount=Uj2fVBg%2FvclD1RF0o2z%2BbA%3D%3D",
};

const Payment = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("product") || "1";
  const link = LINKS[productId];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!link) { navigate("/"); return; }

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100));
    }, 30);

    const timer = setTimeout(() => {
      window.location.href = link;
    }, 1500);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [link, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[420px] bg-card/80 backdrop-blur-2xl rounded-2xl border border-border/60 p-8 md:p-10 text-center"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {/* Animated lock */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6"
        >
          <Lock size={28} />
        </motion.div>

        <h1 className="text-xl font-display text-foreground mb-2">Preparing Secure Payment</h1>
        <p className="text-sm text-muted-foreground mb-8">You'll be redirected to Razorpay</p>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(270_60%_55%)]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Spinner */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Loader2 size={16} className="animate-spin text-primary" />
          Redirecting...
        </div>

        <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-accent" /> Do not refresh this page
        </p>
      </motion.div>
    </div>
  );
};

export default Payment;
