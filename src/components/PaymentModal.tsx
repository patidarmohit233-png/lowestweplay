import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Zap, Copy, Check, Loader2, ArrowRight,
  CreditCard, QrCode, AlertTriangle, ArrowLeftRight, Receipt } from
"lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";

export const UPI_ID = "lowestweplay@ybl";
const PAYEE = "Lowest Weplay";

const UPI_APPS = [
{ key: "paytm", name: "Paytm", scheme: "paytmmp://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
{ key: "bhim", name: "BHIM", scheme: "upi://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" },
{ key: "gpay", name: "G-Pay", scheme: "tez://upi/pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
{ key: "phonepe", name: "PhonePe", scheme: "phonepe://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" }];


function upiQuery(amount: number, note: string) {
  return `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
}

type Buyer = { weplay_id: string; weplay_name: string };

export default function PaymentModal({
  product,
  buyer,
  onClose




}: {product: Product | null;buyer: Buyer;onClose: () => void;}) {
  const [tab, setTab] = useState<"upi" | "razorpay">("upi");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [txn, setTxn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) return null;
  const note = `${product.name} · ${buyer.weplay_id}`;

  const ensureOrder = async (method: "upi" | "razorpay") => {
    if (orderId) return orderId;
    setCreating(true);
    const { data, error } = await supabase.rpc("create_order", {
      p_weplay_id: buyer.weplay_id,
      p_weplay_name: buyer.weplay_name,
      p_product_id: String(product.id),
      p_product_name: product.name,
      p_price: product.price,
      p_coins: product.coins,
      p_payment_method: method
    });
    setCreating(false);
    const row = Array.isArray(data) ? data[0] : null;
    if (error || !row) {
      toast({ title: "Could not create order", description: error?.message ?? "Please try again.", variant: "destructive" });
      return null;
    }
    setOrderId(row.id);
    setOrderCode(row.order_code);
    return row.id as string;
  };

  const payWithApp = async (app: typeof UPI_APPS[0]) => {
    setActiveApp(app.key);
    const id = await ensureOrder("upi");
    if (!id) return;
    window.location.href = `${app.scheme}?${upiQuery(product.price, note)}`;
  };

  const openRazorpay = async () => {
    const id = await ensureOrder("razorpay");
    if (!id) return;
    window.open(product.link, "_blank", "noopener,noreferrer");
  };

  const verify = async () => {
    const value = txn.trim();
    if (value.length < 4) {
      toast({ title: "Enter a valid ID", description: tab === "upi" ? "UTR is usually 12 digits." : "Paste your Razorpay transaction ID.", variant: "destructive" });
      return;
    }
    const id = await ensureOrder(tab);
    if (!id) return;
    setVerifying(true);
    const { error } = await supabase.rpc("attach_transaction", { p_order_id: id, p_transaction_id: value });
    setVerifying(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Payment submitted ✓", description: "We're verifying it — track status with your WePlay ID." });
  };

  const copyUpi = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=6&data=${encodeURIComponent(
    `upi://pay?${upiQuery(product.price, note)}`
  )}`;

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
          initial={{ y: 60, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:max-w-[420px] max-h-[94dvh] flex flex-col bg-card border border-border/70 rounded-t-[2rem] md:rounded-[2rem] shadow-elevated overflow-hidden">

          {/* ── HEADER: amount is the hero ─────────────── */}
          <div className="relative shrink-0 px-5 pt-4 pb-6 md:px-6 md:pt-6 bg-gradient-to-b from-primary/[0.07] to-transparent">
            <div className="md:hidden mx-auto mb-4 h-1.5 w-11 rounded-full bg-border" />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex px-2 py-0.5 rounded-md bg-primary/12 text-primary text-[9.5px] font-extrabold uppercase tracking-[0.14em]">
                  Step 2 of 2
                </span>
                <h2 className="mt-2 text-[1.35rem] md:text-2xl font-display leading-tight text-foreground truncate">
                  {product.name}
                </h2>
              </div>
              <button onClick={onClose} aria-label="Close payment"
                className="shrink-0 w-9 h-9 rounded-full bg-secondary text-muted-foreground grid place-items-center active:scale-90 hover:text-foreground transition-all">
                <X size={17} strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-5 flex items-baseline gap-2.5">
              <span className="text-[2.5rem] md:text-5xl font-price font-extrabold text-foreground leading-none tracking-tight">
                ₹{product.price}
              </span>
              <span className="text-muted-foreground text-[12.5px] font-semibold">Final amount</span>
            </div>
            <p className="mt-1.5 text-[11.5px] font-bold text-accent">{product.coins} coins</p>
          </div>

          {/* ── SCROLL BODY ────────────────────────────── */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* receipt pill */}
            <div className="mx-5 md:mx-6 rounded-2xl border border-border bg-secondary/60 px-4 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Player ID</p>
                <p className="text-[13.5px] font-extrabold text-foreground truncate mt-0.5">{buyer.weplay_id}</p>
              </div>
              <div className="h-8 w-px bg-border shrink-0" />
              <div className="min-w-0 text-right">
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Order ID</p>
                <p className="text-[13.5px] font-extrabold text-primary truncate mt-0.5">{orderCode ? `#${orderCode}` : "—"}</p>
              </div>
            </div>

            {/* tabs */}
            <div className="px-5 md:px-6 mt-5">
              <div className="relative flex p-1.5 rounded-2xl bg-secondary/80 border border-border">
                {([
                { key: "upi" as const, label: "UPI Payment", tag: "Fastest" },
                { key: "razorpay" as const, label: "Razorpay", tag: "Cards / Netbanking" }]).
                map((t) =>
                <button key={t.key} onClick={() => setTab(t.key)}
                  className="relative flex-1 py-2.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors">
                    {tab === t.key &&
                  <motion.span layoutId="payTab" transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-card shadow-card border border-border/60" />
                  }
                    <span className={`relative z-10 text-[12.5px] font-extrabold leading-none flex items-center gap-1.5 ${tab === t.key ? "text-foreground" : "text-muted-foreground"}`}>
                      {t.label}
                      {t.key === "upi" &&
                    <span className="px-1.5 py-0.5 rounded bg-accent/15 text-accent text-[8.5px] font-black uppercase tracking-wide">⚡ {t.tag}</span>
                    }
                    </span>
                    {t.key === "razorpay" &&
                  <span className={`relative z-10 text-[9px] font-bold leading-none ${tab === t.key ? "text-muted-foreground" : "text-muted-foreground/70"}`}>{t.tag}</span>
                  }
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {tab === "upi" ?
              <motion.div key="upi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }} className="px-5 md:px-6 pt-5 pb-6 space-y-5">

                  {/* payment rail */}
                  <div className="grid grid-cols-4 gap-3">
                    {UPI_APPS.map((app) =>
                  <button key={app.key} onClick={() => payWithApp(app)} disabled={creating}
                    aria-label={`Pay ₹${product.price} with ${app.name}`}
                    className="group flex flex-col items-center gap-2 disabled:opacity-60">
                        <span className={`w-full aspect-square rounded-2xl bg-card border grid place-items-center p-2.5 shadow-card transition-all active:scale-[0.94] ${
                    activeApp === app.key ? "border-primary shadow-[0_8px_24px_-10px_hsl(var(--primary)/0.5)]" : "border-border group-hover:border-primary/40"}`}>

                          {creating && activeApp === app.key ?
                      <Loader2 size={18} className="animate-spin text-primary" /> :
                      <img src={app.logo} alt="" loading="lazy" className="max-h-6 w-auto object-contain" />
                      }
                        </span>
                        <span className={`text-[10px] font-extrabold leading-none ${activeApp === app.key ? "text-primary" : "text-muted-foreground"}`}>{app.name}</span>
                      </button>
                  )}
                  </div>

                  {/* VPA row */}
                  <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-primary/[0.06] border border-primary/15">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 shrink-0 rounded-xl grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                        <ArrowLeftRight size={15} strokeWidth={2.5} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-primary/70">Pay to UPI ID</p>
                        <p className="text-[13.5px] font-extrabold text-foreground truncate">{UPI_ID}</p>
                      </div>
                    </div>
                    <button onClick={copyUpi}
                      className="shrink-0 px-3 py-2 rounded-xl bg-card border border-primary/20 text-primary text-[10px] font-extrabold uppercase tracking-wide shadow-card inline-flex items-center gap-1.5 active:scale-95 transition-transform">
                      {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.6} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* QR moment */}
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-card border border-border rounded-[1.75rem] shadow-elevated">
                      <img src={qrSrc} alt={`UPI QR code to pay ₹${product.price}`} width={168} height={168}
                        className="w-[168px] h-[168px] rounded-xl" />
                    </div>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                      <QrCode size={12} /> Scan &amp; pay ₹{product.price}
                    </p>

                    <div className="flex items-center gap-4 mt-5">
                      {["100% Secure", "Instant", "24/7 Live"].map((t) =>
                    <span key={t} className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-[9px] font-extrabold uppercase tracking-wide text-muted-foreground">{t}</span>
                        </span>
                    )}
                    </div>
                  </div>
                </motion.div> :

              <motion.div key="rzp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }} className="px-5 md:px-6 pt-5 pb-6 space-y-4">

                  <div className="rounded-2xl border border-border bg-secondary/50 p-4 flex items-start gap-3">
                    <span className="w-9 h-9 shrink-0 rounded-xl bg-card border border-border grid place-items-center text-primary">
                      <Receipt size={16} />
                    </span>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Pay <span className="font-extrabold text-foreground">₹{product.price}</span> securely on Razorpay — UPI, cards, netbanking and wallets supported.
                    </p>
                  </div>

                  <button onClick={openRazorpay} disabled={creating}
                  className="relative w-full py-4 rounded-2xl font-extrabold text-primary-foreground overflow-hidden active:scale-[0.98] transition-transform disabled:opacity-70"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
                    <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-primary-foreground/25 blur-md animate-shine" />
                    <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-[11.5px]">
                      {creating ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                      Continue to Payment <ArrowRight size={14} />
                    </span>
                  </button>

                  <div className="flex items-center justify-center gap-4 pt-1">
                    {["100% Secure", "Instant", "24/7 Live"].map((t) =>
                  <span key={t} className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[9px] font-extrabold uppercase tracking-wide text-muted-foreground">{t}</span>
                      </span>
                  )}
                  </div>
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {/* ── STICKY FOOTER ACTION ───────────────────── */}
          <div className="shrink-0 border-t border-border bg-secondary/60 backdrop-blur-xl px-5 md:px-6 pt-4 pb-5 space-y-3">
            {done ?
            <div className="rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3.5 flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 rounded-full bg-accent/20 text-accent grid place-items-center">
                  <Check size={15} strokeWidth={3} />
                </span>
                <p className="text-[12px] font-bold text-foreground leading-relaxed">
                  Order {orderCode} is now <span className="text-accent">processing</span>. Track it anytime with your WePlay ID.
                </p>
              </div> :

            <>
                <div className="relative">
                  <input
                  value={txn}
                  onChange={(e) => setTxn(e.target.value)}
                  aria-label={tab === "upi" ? "UTR / UPI reference number" : "Razorpay transaction ID"}
                  placeholder={tab === "upi" ? "Enter Transaction ID (UTR)" : "Enter Razorpay Transaction ID"}
                  className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-card border border-border text-base font-bold text-foreground placeholder:font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />

                  <Receipt size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none" />
                </div>

                <button onClick={verify} disabled={verifying}
                className="relative w-full py-4 rounded-2xl font-extrabold text-primary-foreground overflow-hidden active:scale-[0.98] transition-transform disabled:opacity-70"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
                  <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-[12px]">
                    {verifying ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                    Verify Payment
                  </span>
                </button>

                <p className="text-[10px] text-center text-muted-foreground font-medium leading-relaxed px-2 flex items-start justify-center gap-1.5">
                  <AlertTriangle size={12} className="text-destructive shrink-0 mt-[1px]" />
                  Enter your transaction ID after paying — orders without it are not processed.
                </p>
              </>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);

}
