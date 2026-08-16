import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Zap, Copy, Check, Loader2, ArrowRight,
  CreditCard, QrCode, AlertTriangle, ArrowLeftRight, Receipt, Search, Star, ChevronDown } from
"lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import { trackEvent } from "@/lib/analytics";

export const UPI_IDS = [
"shubhsharmaa@slc",
"BHARATPE.9D0G0R0Y6T421308@unitype",
"lowestweplayrechargee@nyes",
"lowestweplayy@axl",
"lowestweplay@ibl",
"lowestweplayrecharge@ybl"];

export const UPI_ID = UPI_IDS[UPI_IDS.length - 1];

const pickUpiId = () => UPI_IDS[Math.floor(Math.random() * UPI_IDS.length)];

const PAYEE = "Lowest Weplay";

const UPI_APPS = [
{ key: "paytm", name: "Paytm", scheme: "paytmmp://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
{ key: "bhim", name: "BHIM", scheme: "upi://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" },
{ key: "gpay", name: "G-Pay", scheme: "tez://upi/pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
{ key: "phonepe", name: "PhonePe", scheme: "phonepe://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" }];


const RAZORPAY_LOGO = "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg";

function upiQuery(upiId: string, amount: number, note: string) {
  return `pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(PAYEE)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

type VerifiedBuyer = { game: string; user_id: string; name: string };
type Method = "upi" | "razorpay";

export default function PaymentModal({
  product,
  buyer,
  onClose
}: {product: Product | null;buyer: VerifiedBuyer;onClose: () => void;}) {

  const [method, setMethod] = useState<Method | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [txn, setTxn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  /* one random UPI ID per checkout session, saved with the order */
  const [assignedUpi] = useState(pickUpiId);

  if (!product) return null;
  const note = `${product.name} · ${buyer.user_id}`;

  /* Order is created ONLY when the buyer verifies their transaction ID */
  const createOrder = async (m: Method) => {
    setCreating(true);
    trackEvent('payment_started', { method: m, product_id: product.id, product_name: product.name });
    
    // Switch back to direct insert as RPC might be missing in external DB
    const { data, error } = await supabase.from('orders').insert({
      weplay_id: buyer.user_id,
      weplay_name: buyer.name || (buyer as any).weplay_name || "Player",
      product_id: String(product.id),
      product_name: String(product.name),
      price: product.price * quantity,
      coins_amount: product.coinsAmount * quantity,
      payment_method: m,
      upi_id: m === "upi" ? assignedUpi : ""
    }).select().single();
    
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
    
    setOrderId(data.id);
    setOrderCode(data.order_code);
    return data.id;
  };


  const payWithApp = (app: typeof UPI_APPS[0]) => {
    setMethod("upi");
    setActiveApp(app.key);
    window.location.href = `${app.scheme}?${upiQuery(assignedUpi, product.price * quantity, note)}`;
  };

  const openRazorpay = () => {
    setMethod("razorpay");
    window.open(product.link, "_blank", "noopener,noreferrer");
  };

  const verify = async () => {
    const value = txn.trim();
    if (value.length < 4) {
      toast({ title: "Enter a valid ID", description: method === "upi" ? "UTR is usually 12 digits." : "Paste your Razorpay transaction ID.", variant: "destructive" });
      return;
    }
    setVerifying(true);
    const id = orderId ?? (await createOrder(method ?? "upi"));
    if (!id) {
      setVerifying(false);
      return;
    }
    
    // Using a more robust update that avoids specific column cache issues if they persist
    const { error } = await supabase
      .from("orders")
      .update({ transaction_id: value })
      .eq("id", id);
      
    setVerifying(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    trackEvent('payment_verified', { method: method, order_id: id, order_code: orderCode });
    toast({ title: "Payment submitted ✓", description: "We're verifying it — track status with your Lowest WePlay ID." });
  };

  const copyUpi = async () => {
    await navigator.clipboard.writeText(assignedUpi);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=6&data=${encodeURIComponent(
    `upi://pay?${upiQuery(assignedUpi, product.price * quantity, note)}`
  )}`;

  /* shared verification block inside each card (plain render fn — keeps input mounted) */
  const isLessRecommended = product.id === 1 || product.id === 3; // ₹479 packs

  const renderVerify = (label: string, placeholder: string) =>
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
          isLessRecommended 
            ? "bg-amber-50 border-amber-200 text-amber-900" 
            : "bg-indigo-50 border-indigo-200 text-indigo-900"
        }`}>
          {isLessRecommended ? (
            "We have already stated in our videos and policies that we do not recommend this ₹479 pack. Please choose any other pack besides the ₹479 one, and we will process it immediately."
          ) : (
            "Your order will be processed within 10-30 minutes. Thank you for choosing Lowest Weplay!"
          )}
        </div>
      </div>

      <button 
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-secondary border border-border text-[11px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-colors"
      >
        Close Receipt
      </button>
    </div> :

  <div onClick={(e) => e.stopPropagation()} className="mt-4 rounded-2xl border-2 border-warning/50 bg-warning/[0.09] p-3.5">
      <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-foreground">
        <Search size={13} strokeWidth={3} /> {label}
      </label>
      <div className="relative mt-2">
        <input
      value={txn}
      onChange={(e) => setTxn(e.target.value)}
      placeholder={placeholder}
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
        Please enter your transaction ID after completing payment. Orders without transaction ID will not be processed.
      </p>
    </div>;


  const expand = { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } };

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
          className="relative w-full md:max-w-[920px] h-[92vh] md:h-auto md:max-h-[90vh] flex flex-col bg-card/95 backdrop-blur-3xl border-t md:border border-border/60 rounded-t-[2.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden shadow-[0_-8px_40px_-15px_rgba(0,0,0,0.1)]">

          {/* ── HEADER ─────────────── */}
          <div className="relative shrink-0 px-6 pt-3 pb-5 md:px-7 md:pt-6 bg-gradient-to-b from-primary/[0.08] to-transparent">
            <div className="md:hidden mx-auto mb-5 h-1.5 w-12 rounded-full bg-muted-foreground/20 active:bg-muted-foreground/40 transition-colors" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/12 text-primary text-[9.5px] font-extrabold uppercase tracking-[0.14em]">
                  Step 2 of 2 · Choose payment
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

            {/* ── TWO EXPANDABLE OPTION CARDS ── */}
            <div className="mt-5 grid gap-4 md:grid-cols-2 items-start">

              {/* OPTION 1 — UPI */}
              <motion.div
                whileHover={{ y: -3 }}
                onClick={() => setMethod((m) => m === "upi" ? null : "upi")}
                role="button"
                aria-expanded={method === "upi"}
                className={`relative cursor-pointer rounded-[1.5rem] border-2 p-4 md:p-5 transition-all backdrop-blur-xl bg-gradient-to-br from-accent/12 via-accent/[0.06] to-card/70 ${
                method === "upi" ? "border-accent shadow-[0_16px_40px_-18px_hsl(var(--accent)/0.55)]" : "border-accent/25 hover:border-accent/60 shadow-card"}`}>

                <span className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-[0.12em] shadow-card">
                  <Star size={10} strokeWidth={3} /> Recommended · Fastest
                </span>

                <div className="flex items-center justify-between gap-3 mt-1">
                  <h3 className="text-[15px] md:text-base font-extrabold text-foreground">⚡ UPI Payment (Fastest)</h3>
                  <ChevronDown size={18} strokeWidth={3}
                    className={`shrink-0 text-accent transition-transform duration-300 ${method === "upi" ? "rotate-180" : ""}`} />
                </div>

                {/* always-visible app logos */}
                <div className="mt-4 grid grid-cols-4 gap-2.5">
                  {UPI_APPS.map((app) =>
                  <button key={app.key} onClick={(e) => {e.stopPropagation();payWithApp(app);}} disabled={creating}
                    aria-label={`Pay ₹${product.price * quantity} with ${app.name}`}
                    className="group flex flex-col items-center gap-1.5 disabled:opacity-60">
                      <span className={`w-full aspect-square rounded-2xl bg-card border grid place-items-center p-2.5 shadow-card transition-all active:scale-[0.94] ${
                    activeApp === app.key ? "border-accent shadow-[0_8px_24px_-10px_hsl(var(--accent)/0.5)]" : "border-border group-hover:border-accent/50"}`}>
                        {creating && activeApp === app.key ?
                      <Loader2 size={18} className="animate-spin text-accent" /> :
                      <img src={app.logo} alt={`${app.name} logo`} loading="lazy" className="max-h-6 w-auto object-contain" />
                      }
                      </span>
                      <span className={`text-[9.5px] font-extrabold leading-none ${activeApp === app.key ? "text-accent" : "text-muted-foreground"}`}>{app.name}</span>
                    </button>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {method === "upi" &&
                  <motion.div {...expand} className="overflow-hidden">
                      {/* VPA row */}
                      <div className="mt-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-accent/25">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-9 h-9 shrink-0 rounded-xl grid place-items-center bg-accent/15 text-accent">
                            <ArrowLeftRight size={15} strokeWidth={2.5} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Pay to UPI ID</p>
                            <p className="text-[13.5px] font-extrabold text-foreground truncate">{assignedUpi}</p>
                          </div>
                        </div>
                        <button onClick={(e) => {e.stopPropagation();copyUpi();}}
                        className="shrink-0 px-3 py-2 rounded-xl bg-secondary border border-border text-foreground text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 active:scale-95 transition-transform">
                          {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.6} />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>

                      {/* QR */}
                      <div className="mt-4 flex flex-col items-center">
                        <div className="p-3.5 bg-card border border-border rounded-[1.5rem] shadow-elevated">
                          <img src={qrSrc} alt={`UPI QR code to pay ₹${product.price * quantity}`} width={156} height={156}
                          className="w-[156px] h-[156px] rounded-xl" />
                        </div>
                        <p className="mt-2.5 inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                          <QrCode size={12} /> Scan &amp; pay ₹{product.price * quantity}
                        </p>
                      </div>

                      {renderVerify("🔍 Enter UTR / UPI Reference", "Type your UTR here (12 digits)")}
                    </motion.div>
                  }
                </AnimatePresence>
              </motion.div>

              {/* OPTION 2 — RAZORPAY */}
              <motion.div
                whileHover={{ y: -3 }}
                onClick={() => {
                  if (quantity > 1) {
                    toast({ title: "Bulk orders restricted", description: "Quantities greater than 1 are only available via UPI payment.", variant: "destructive" });
                    return;
                  }
                  setMethod((m) => m === "razorpay" ? null : "razorpay");
                }}
                role="button"
                aria-expanded={method === "razorpay"}
                className={`relative cursor-pointer rounded-[1.5rem] border-2 p-4 md:p-5 transition-all backdrop-blur-xl bg-gradient-to-br from-primary/12 via-primary/[0.06] to-card/70 ${
                quantity > 1 ? "opacity-50 grayscale cursor-not-allowed border-dashed" : 
                method === "razorpay" ? "border-primary shadow-[0_16px_40px_-18px_hsl(var(--primary)/0.55)]" : "border-primary/25 hover:border-primary/60 shadow-card"}`}>

                <span className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-[0.12em] shadow-card">
                  {quantity > 1 ? "UPI Only for Bulk" : "Cards · Netbanking · Wallets"}
                </span>

                <div className="flex items-center justify-between gap-3 mt-1">
                  <h3 className="text-[15px] md:text-base font-extrabold text-foreground">💳 Razorpay Payment</h3>
                  <ChevronDown size={18} strokeWidth={3}
                    className={`shrink-0 text-primary transition-transform duration-300 ${method === "razorpay" ? "rotate-180" : ""}`} />
                </div>

                <div className="mt-4 rounded-2xl bg-card border border-primary/25 p-5 grid place-items-center">
                  <img src={RAZORPAY_LOGO} alt="Razorpay logo" loading="lazy" className="h-9 w-auto object-contain" />
                </div>

                <AnimatePresence initial={false}>
                  {method === "razorpay" &&
                  <motion.div {...expand} className="overflow-hidden">
                      <div className="mt-4 rounded-2xl border border-border bg-card/70 p-3.5 flex items-start gap-3">
                        <span className="w-9 h-9 shrink-0 rounded-xl bg-primary/12 grid place-items-center text-primary">
                          <Receipt size={16} />
                        </span>
                        <p className="text-[12px] text-muted-foreground leading-relaxed">
                          Pay <span className="font-extrabold text-foreground">₹{product.price * quantity}</span> using UPI, cards, netbanking or wallets.
                        </p>
                      </div>

                      <button onClick={(e) => {e.stopPropagation();openRazorpay();}} disabled={creating}
                      className="relative mt-4 w-full py-4 rounded-2xl font-extrabold text-primary-foreground overflow-hidden active:scale-[0.98] transition-transform disabled:opacity-70"
                      style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
                        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-primary-foreground/25 blur-md animate-shine" />
                        <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-[11.5px]">
                          {creating ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                          Continue to Payment <ArrowRight size={14} />
                        </span>
                      </button>

                      {renderVerify("🔍 Enter Your Transaction ID", "Type your Razorpay Transaction ID")}
                    </motion.div>
                  }
                </AnimatePresence>
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
