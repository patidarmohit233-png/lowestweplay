import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, Sparkles, ShieldCheck, Clock, Mail } from "lucide-react";

const confettiColors = [
  "hsl(244 63% 58%)",
  "hsl(160 84% 39%)",
  "hsl(45 93% 58%)",
  "hsl(330 80% 60%)",
  "hsl(200 80% 55%)",
];

function ConfettiPiece({ index }: { index: number }) {
  const left = Math.random() * 100;
  const delay = Math.random() * 0.8;
  const duration = 1.5 + Math.random() * 1.5;
  const size = 6 + Math.random() * 6;
  const color = confettiColors[index % confettiColors.length];
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none"
      style={{
        left: `${left}%`,
        top: "-5%",
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        rotate: `${rotation}deg`,
      }}
      initial={{ y: 0, opacity: 1 }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, (Math.random() - 0.5) * 80],
        rotate: [rotation, rotation + 360 * (Math.random() > 0.5 ? 1 : -1)],
        opacity: [1, 1, 0],
      }}
      transition={{ duration, delay, ease: "easeIn" }}
    />
  );
}

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const productName = params.get("product") || "Your Package";
  const orderId = params.get("order") || "";
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-background via-secondary/20 to-background flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      {/* Background glow */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.08 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.5), transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] bg-card/80 backdrop-blur-2xl rounded-3xl border border-border/60 p-6 md:p-10 text-center relative z-10"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
          className="relative mx-auto mb-6"
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto"
            animate={{ boxShadow: ["0 0 0 0 hsl(var(--accent) / 0.2)", "0 0 0 20px hsl(var(--accent) / 0)", "0 0 0 0 hsl(var(--accent) / 0)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          >
            <CheckCircle2 size={40} className="text-accent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Sparkles size={14} className="text-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl md:text-3xl font-display text-foreground mb-2"
        >
          Order Placed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="text-sm text-muted-foreground mb-6"
        >
          Your order has been received successfully
        </motion.p>

        {/* Order details card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="bg-secondary/50 rounded-2xl border border-border/40 p-4 mb-6 text-left space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Product</p>
              <p className="text-sm font-semibold text-foreground">{productName}</p>
            </div>
          </div>

          {orderId && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <ShieldCheck size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</p>
                <p className="text-xs font-mono text-foreground">{orderId.slice(0, 8)}...</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Status steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-3 mb-6"
        >
          {[
            { icon: <CheckCircle2 size={14} />, text: "Order received", done: true },
            { icon: <Clock size={14} />, text: "Payment verification in progress", done: false },
            { icon: <Mail size={14} />, text: "Confirmation email will be sent", done: false },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.15 }}
              className={`flex items-center gap-2.5 text-xs ${step.done ? "text-accent font-medium" : "text-muted-foreground"}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step.done ? "bg-accent/15" : "bg-secondary"}`}>
                {step.icon}
              </span>
              {step.text}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors active:scale-[0.97]"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-[11px] text-muted-foreground mt-4"
        >
          Need help? Contact us at fluxfindindia@gmail.com
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;
