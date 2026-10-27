import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Zap, Check, Loader2, ArrowRight,
  CreditCard, AlertTriangle, Receipt, Search, ShieldCheck } from
"lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import { trackEvent } from "@/lib/analytics";


type VerifiedBuyer = {game: string;user_id: string;name: string;};

export default function PaymentModal({
  product,
  buyer,
  onClose
}: {product: Product | null;buyer: VerifiedBuyer;onClose: () => void;}) {

  const [quantity, setQuantity] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [txn, setTxn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);

  if (!product) return null;

  /* Order is created ONLY when the buyer verifies their transaction ID */
  const createOrder = async () => {
    setCreating(true);
    trackEvent('payment_started', { method: "google_play", product_id: product.id, product_name: product.name });

    const { data, error } = await supabase.rpc('secure_create_order', {
      p_weplay_id: buyer.user_id,
      p_weplay_name: buyer.name || (buyer as any).weplay_name || "Player",
      p_product_id: String(product.id),
      p_product_name: String(product.name),
      p_price: product.price * quantity,
      p_coins_amount: product.coinsAmount * quantity,
      p_payment_method: "google_play"
    });

    setCreating(false);
    if (error || !data) {
      console.error("Order creation error details:", error);
      toast({
        title: "Could not create order",
        description: error?.message ?? "Please try again.",
        variant: "destructive"
      });
      return null;
    }

    setOrderId((data as any).id);
    setOrderCode((data as any).order_code);
    return (data as any).id as string;
  };


  const verify = async () => {
    const value = txn.trim();
    if (value.length < 4) {
      toast({ title: "Enter a valid code", description: "Paste your Google Play redeem code.", variant: "destructive" });
      return;
    }
    const b = buyer as any;
    const weplayId = String(b?.user_id || b?.weplay_id || b?.id || "").trim();
    if (!weplayId) {
      toast({ title: "Verify your WePlay ID", description: "Please verify your WePlay ID again, then retry.", variant: "destructive" });
      return;
    }
    setVerifying(true);
    let id = orderId;
    let error: any = null;
    if (!id) {
      const res = await supabase.rpc('submit_redeem_order' as any, {
        p_weplay_id: weplayId,
        p_weplay_name: String(b?.name || b?.weplay_name || "Player"),
        p_product_id: String(product.id),
        p_product_name: String(product.name),
        p_price: Math.round(product.price * quantity),
        p_coins_amount: Math.round((product.coinsAmount || 0) * quantity),
        p_redeem_code: value,
      } as any);
      error = res.error;
      const row: any = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!error && row?.id) {
        id = row.id;
        setOrderId(row.id);
        setOrderCode(row.order_code);
      }
    } else {
      const res = await supabase.rpc("attach_transaction" as any, {
        p_order_id: id,
        p_transaction_id: value
      } as any);
      error = res.error;
    }

    setVerifying(false);
    if (error || !id) {
      console.error("Order submit error:", error);
      toast({ title: "Verification failed", description: error?.message ?? "Please try again.", variant: "destructive" });
      return;
    }
    setDone(true);
    trackEvent('payment_verified', { method: "google_play", order_id: id, order_code: orderCode });
    toast({ title: "Payment submitted ✓", description: "We're verifying it — track status with your Lowest WePlay ID." });
  };

  const isLessRecommended = product.id === 1 || product.id === 3; // ₹479 packs

  const renderVerify = () =>
  done ?
  <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-accent/20 text-accent grid place-items-center">
          <Check size={20} strokeWidth={3} />
        </span>
        <div className="space-y-1">
          <h4 className="text-[15px] font-black text-foreground uppercase tracking-wider">Order In Process</h4>
          <p className="text-[12px] font-bold text-muted-foreground leading-relaxed">
            Order <span className="text-primary">#{orderCode}</span> has been received and is being verified.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Receipt size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Order Receipt</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">Item:</span>
            <span className="text-foreground">{product.name} (x{quantity})</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">Lowest WePlay ID:</span>
            <span className="text-foreground">{buyer.user_id}</span>
          </div>
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">Amount Paid:</span>
            <span className="text-primary">₹{product.price * quantity}</span>
          </div>
        </div>

        <div className={`mt-3 p-4 rounded-2xl text-[12px] font-bold leading-relaxed border-2 shadow-sm ${
      isLessRecommended ?
      "bg-amber-50 border-amber-200 text-amber-900" :
      "bg-indigo-50 border-indigo-200 text-indigo-900"}`
      }>
          {isLessRecommended ?
        "We have already stated in our videos and policies that we do not recommend this ₹479 pack. Please choose any other pack besides the ₹479 one, and we will process it immediately." :

        "Your order will be processed within 10-30 minutes. Thank you for choosing Lowest Weplay!"
        }
        </div>
      </div>

      <button
      onClick={onClose}
      className="w-full py-3 rounded-xl bg-secondary border border-border text-[11px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-colors">

        Close Receipt
      </button>
    </div> :


  <div onClick={(e) => e.stopPropagation()} className="mt-4 rounded-2xl border-2 border-warning/50 bg-warning/[0.09] p-3.5">
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-foreground">
        <Search size={13} strokeWidth={3} /> 🔍 Enter Google Play Redeem Code
      </label>
      <div className="relative mt-2">
        <input
        value={txn}
        onChange={(e) => setTxn(e.target.value)}
        placeholder="Paste your Google Play redeem code"
        className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-card border-2 border-warning/50 text-base font-bold text-foreground placeholder:font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />

        <Receipt size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
      </div>
      <button onClick={(e) => {e.stopPropagation();verify();}} disabled={verifying}
      className="mt-3 w-full py-3.5 rounded-2xl font-extrabold text-primary-foreground active:scale-[0.98] transition-transform disabled:opacity-70"
      style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
        <span className="flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-[12px]">
          {verifying ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          Verify Payment
        </span>
      </button>
      <p className="mt-2.5 text-[10.5px] text-muted-foreground font-semibold leading-relaxed flex items-start gap-1.5">
        <AlertTriangle size={12} className="text-destructive shrink-0 mt-[1px]" />
        Enter the exact redeem code for the full amount. Wrong or used codes will not be processed.
      </p>
    </div>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-foreground/45 backdrop-blur-md p-0 md:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Complete payment">

        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:max-w-[560px] h-[92vh] md:h-auto md:max-h-[90vh] flex flex-col bg-card/95 backdrop-blur-3xl border-t md:border border-border/60 rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden shadow-[0_-8px_40px_-15px_rgba(0,0,0,0.1)]">

          {/* ── HEADER ─────────────── */}
          <div className="relative shrink-0 px-6 pt-3 pb-5 md:px-7 md:pt-6 bg-gradient-to-b from-primary/[0.08] to-transparent">
            <div className="md:hidden mx-auto mb-5 h-1.5 w-12 rounded-full bg-muted-foreground/20 active:bg-muted-foreground/40 transition-colors" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/12 text-primary text-[9.5px] font-extrabold uppercase tracking-[0.14em]">
                  Step 2 of 2 · Secure payment
                </span>
                <h2 className="mt-2 text-[1.35rem] md:text-2xl font-display leading-tight text-foreground truncate">
                  {product.name}
                </h2>
                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="text-[2.25rem] md:text-[2.75rem] font-price font-extrabold text-foreground leading-none tracking-tight">
                    ₹{product.price * quantity}
                  </span>
                  <span className="text-muted-foreground text-[12.5px] font-semibold">Final amount</span>
                </div>
                <p className="mt-1.5 text-[11.5px] font-bold text-accent">{product.coinsAmount * quantity >= 100000 ? `${(product.coinsAmount * quantity / 100000).toFixed(1)} Lakh` : (product.coinsAmount * quantity).toLocaleString()} coins</p>
              </div>
              <button onClick={onClose} aria-label="Close payment"
                className="shrink-0 w-9 h-9 rounded-full bg-secondary text-muted-foreground grid place-items-center active:scale-90 hover:text-foreground transition-all">
                <X size={17} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ── SCROLL BODY ────────────────────────────── */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 md:px-7 pb-10 scrollbar-none">
            {/* receipt pill */}
            <div className="rounded-2xl border border-border bg-secondary/60 px-4 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Player ID</p>
                <p className="text-[13.5px] font-extrabold text-foreground truncate mt-0.5">{buyer.user_id}</p>
              </div>
              <div className="h-8 w-px bg-border shrink-0" />
              <div className="min-w-0 text-right">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Order ID</p>
                <p className="text-[13.5px] font-extrabold text-primary truncate mt-0.5">{orderCode ? `#${orderCode}` : "—"}</p>
              </div>
            </div>

            {/* QUANTITY PICKER */}
            <div className="mt-5 rounded-2xl border border-border bg-secondary/50 p-4 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Select Quantity</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-background border flex items-center justify-center font-bold">-</button>
                <span className="font-extrabold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-background border flex items-center justify-center font-bold">+</button>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="mt-5 rounded-3xl border border-border bg-card/50 overflow-hidden">
              <div className="px-5 py-3.5 bg-secondary/30 border-b border-border flex items-center gap-2">
                <Receipt size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-foreground">Order Summary</span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-[12.5px]">
                  <span className="text-muted-foreground font-semibold">Package Price</span>
                  <span className="text-foreground font-bold">₹{product.price} × {quantity}</span>
                </div>
                <div className="flex justify-between text-[12.5px]">
                  <span className="text-muted-foreground font-semibold">Subtotal</span>
                  <span className="text-foreground font-bold">₹{product.price * quantity}</span>
                </div>
                <div className="flex justify-between text-[12.5px]">
                  <span className="text-muted-foreground font-semibold">Total Coins</span>
                  <span className="text-accent font-bold">{(product.coinsAmount * quantity).toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-dashed border-border flex justify-between items-center">
                  <span className="text-[13px] font-extrabold text-foreground uppercase tracking-wider">Payable Amount</span>
                  <span className="text-xl font-price font-extrabold text-primary">₹{product.price * quantity}</span>
                </div>
              </div>
            </div>

            {/* ── GOOGLE PLAY REDEEM CODE PAYMENT ── */}
            <div className="mt-6">
              <motion.div
                whileHover={{ y: -3 }}
                className="relative rounded-[1.5rem] border-2 border-primary/40 p-4 md:p-5 transition-all backdrop-blur-xl bg-gradient-to-br from-primary/12 via-primary/[0.06] to-card/70 shadow-[0_16px_40px_-18px_hsl(var(--primary)/0.45)]">

                <span className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.12em] shadow-card">
                  <ShieldCheck size={10} strokeWidth={3} /> Pay with any UPI app
                </span>

                <h3 className="mt-1 flex items-center gap-2 text-[15px] md:text-base font-extrabold text-foreground">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="" className="h-5 w-5 object-contain" />
                  Google Play Redeem Code
                </h3>

                <div className="mt-4 rounded-2xl bg-card border border-primary/25 p-5 grid place-items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Google_Play_2022_logo.svg" alt="Google Play logo" loading="lazy" className="h-10 w-auto object-contain" />
                </div>

                <ol className="mt-4 space-y-2.5">
                  {[
                    <>Open any UPI app (GPay, PhonePe, Paytm etc.)</>,
                    <>Buy a <span className="font-extrabold text-foreground">Google Play Redeem Code</span> worth <span className="font-extrabold text-primary">₹{product.price * quantity}</span></>,
                    <>Copy the code and paste it below, then tap <span className="font-extrabold text-foreground">Verify Payment</span></>,
                  ].map((step, i) =>
                  <li key={i} className="rounded-2xl border border-border bg-card/70 p-3 flex items-start gap-3">
                      <span className="w-7 h-7 shrink-0 rounded-lg bg-primary/12 grid place-items-center text-primary text-[12px] font-black">{i + 1}</span>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{step}</p>
                    </li>
                  )}
                </ol>

                {renderVerify()}
              </motion.div>
            </div>

            {/* trust strip */}
            <div className="flex items-center justify-center gap-5 mt-5">
              {["100% Secure", "Instant", "24/7 Live"].map((t) =>
              <span key={t} className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-muted-foreground">{t}</span>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);

}
