import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, CheckCircle2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";

const NAMES = [
  "Rahul S.", "Aman K.", "Priya M.", "Sahil V.", "Rohit D.", "Ankit R.",
  "Neha J.", "Karan B.", "Vikas T.", "Simran K.", "Arjun P.", "Deepak N.",
  "Ritik G.", "Pooja S.", "Manish Y.", "Harsh L.", "Sneha A.", "Yash C.",
  "Abhishek M.", "Tanya R.", "Nikhil W.", "Kunal S.", "Ayush B.", "Farhan Q.",
  "Gaurav H.", "Ishaan D.", "Jatin M.", "Kabir S.", "Lakshay P.", "Mohit V.",
];

const CITIES = ["Delhi", "Mumbai", "Lucknow", "Patna", "Jaipur", "Pune", "Indore", "Surat", "Kolkata", "Bhopal", "Chandigarh", "Hyderabad"];

// Exclude the ₹479 packs from the purchase popups
const POPUP_PRODUCTS = PRODUCTS.filter((p) => p.price !== 479);

const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Purchase = { key: number; name: string; city: string; plan: string; mins: number };

export default function LiveSocialProof() {
  const [viewers, setViewers] = useState(() => 1000 + Math.floor(Math.random() * 4000));
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const keyRef = useRef(0);

  // live viewers counter — drifts randomly, stays within 1k–5k
  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => {
        const next = v + Math.round((Math.random() - 0.45) * 90);
        return Math.min(5000, Math.max(1000, next));
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // rolling purchase notifications
  useEffect(() => {
    let showT: ReturnType<typeof setTimeout>;
    let hideT: ReturnType<typeof setTimeout>;

    const loop = () => {
      const p = rand(POPUP_PRODUCTS);
      keyRef.current += 1;
      setPurchase({
        key: keyRef.current,
        name: rand(NAMES),
        city: rand(CITIES),
        plan: p.name,
        mins: 1 + Math.floor(Math.random() * 9),
      });
      hideT = setTimeout(() => setPurchase(null), 5200);
      showT = setTimeout(loop, 5200 + 6000 + Math.random() * 7000);
    };

    showT = setTimeout(loop, 4000);
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
    };
  }, []);

  return (
    <>
      {/* live viewers pill */}
      <div className="fixed bottom-4 right-4 z-[70] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex items-center gap-2 rounded-full border border-border/70 bg-card/85 backdrop-blur-xl px-3 py-2 shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Eye size={14} className="text-muted-foreground" aria-hidden />
          <p className="text-[11px] md:text-xs font-bold text-foreground tabular-nums">
            {viewers.toLocaleString("en-IN")}
            <span className="ml-1 font-semibold text-muted-foreground">watching now</span>
          </p>
        </motion.div>
      </div>

      {/* purchase popups */}
      <div className="fixed bottom-4 left-4 z-[70] pointer-events-none max-w-[86vw]">
        <AnimatePresence mode="wait">
          {purchase && (
            <motion.div
              key={purchase.key}
              initial={{ opacity: 0, x: -30, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/90 backdrop-blur-xl px-3.5 py-3 shadow-xl">
              <div className="mt-0.5 grid place-items-center h-8 w-8 rounded-xl bg-emerald-500/12 text-emerald-600 shrink-0">
                <CheckCircle2 size={16} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-bold text-foreground leading-snug truncate">
                  {purchase.name} <span className="font-semibold text-muted-foreground">from {purchase.city}</span>
                </p>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-snug">
                  bought <span className="font-bold text-primary">{purchase.plan}</span> · {purchase.mins} min ago
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
