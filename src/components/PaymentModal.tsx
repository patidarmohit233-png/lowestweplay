import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Zap, Copy, Check, ShieldCheck, Clock, MessageSquare,
  Loader2, ArrowRight, CreditCard, QrCode, AlertTriangle } from
"lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";

export const UPI_ID = "lowestweplay@ybl";
const PAYEE = "Lowest Weplay";

const UPI_APPS = [
{ key: "paytm", name: "Paytm", scheme: "paytmmp://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
{ key: "bhim", name: "BHIM", scheme: "upi://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" },
{ key: "gpay", name: "Google Pay", scheme: "tez://upi/pay", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
{ key: "phonepe", name: "PhonePe", scheme: "phonepe://pay", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/PhonePe-Logo.svg" }];


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

  const payWithApp = async (scheme: string) => {
    const id = await ensureOrder("upi");
    if (!id) return;
    window.location.href = `${scheme}?${upiQuery(product.price, note)}`;
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

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
    `upi://pay?${upiQuery(product.price, note)}`
  )}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-foreground/40 backdrop-blur-sm p-0 md:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Complete payment">

        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full md:max-w-lg max-h-[92dvh] overflow-y-auto bg-card border border-border rounded-t-[1.75rem] md:rounded-[1.75rem] shadow-elevated">

          {/* header */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border/60 px-4 md:px-6 py-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[9.5px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Step 2 · Payment</div>
              <h3 className="text-[15px] md:text-lg font-display text-foreground truncate mt-0.5">{product.name} · ₹{product.price}</h3>
            </div>
            <button onClick={onClose} aria-label="Close payment"
              className="w-9 h-9 rounded-xl border border-border bg-secondary/70 grid place-items-center active:scale-95 transition-transform">
              <X size={16} />
            </button>
          </div>

          <div className="px-4 md:px-6 pb-6 pt-4">
            {/* order summary */}
            <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-3 mb-4 grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-muted-foreground">Player ID</span><div className="font-extrabold text-foreground truncate">{buyer.weplay_id}</div></div>
              <div><span className="text-muted-foreground">Coins</span><div className="font-extrabold text-foreground truncate">{product.coins}</div></div>
              {orderCode &&
              <div className="col-span-2"><span className="text-muted-foreground">Order ID</span><div className="font-extrabold text-foreground">{orderCode}</div></div>
              }
            </div>

            {/* tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-secondary/70 border border-border mb-5">
              {([
              { key: "upi" as const, label: "UPI Payment", tag: "⚡ Fastest" },
              { key: "razorpay" as const, label: "Razorpay", tag: "Cards / Netbanking" }]).
              map((t) =>
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`py-2.5 rounded-xl text-[11.5px] font-extrabold transition-all ${
                tab === t.key ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}>

                  <span className="block">{t.label}</span>
                  <span className="block text-[9px] font-bold text-muted-foreground mt-0.5">{t.tag}</span>
                </button>
              )}
            </div>

            {tab === "upi" ?
            <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {UPI_APPS.map((app) =>
                <button key={app.key} onClick={() => payWithApp(app.scheme)} disabled={creating}
                  className="rounded-2xl border border-border bg-card px-2 py-3 flex flex-col items-center gap-2 active:scale-[0.96] transition-all hover:border-primary/40 hover:shadow-card disabled:opacity-60">
                      <img src={app.logo} alt={`${app.name} UPI`} loading="lazy" className="h-6 w-auto object-contain" />
                      <span className="text-[9px] font-extrabold text-foreground leading-none text-center">{app.name}</span>
                    </button>
                )}
                </div>

                <div className="rounded-2xl border border-border bg-secondary/50 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">UPI ID</div>
                    <div className="text-sm font-extrabold text-foreground truncate">{UPI_ID}</div>
                  </div>
                  <button onClick={copyUpi} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/25 bg-primary/8 text-primary text-[11px] font-extrabold active:scale-95 transition-transform">
                    {copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground mb-3">
                    <QrCode size={12} /> Scan &amp; pay ₹{product.price}
                  </div>
                  <img src={qrSrc} alt={`UPI QR code for ₹${product.price}`} width={200} height={200}
                  className="mx-auto rounded-xl border border-border bg-background" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                { icon: <ShieldCheck size={14} />, t: "100% Secure" },
                { icon: <Clock size={14} />, t: "Instant Delivery" },
                { icon: <MessageSquare size={14} />, t: "24/7 Support" }].
                map((b) =>
                <div key={b.t} className="rounded-xl border border-border bg-secondary/50 px-2 py-2.5 flex flex-col items-center gap-1 text-center">
                      <span className="text-accent">{b.icon}</span>
                      <span className="text-[9px] font-extrabold text-foreground leading-tight">{b.t}</span>
                    </div>
                )}
                </div>
              </div> :

            <div className="space-y-4">
                <button onClick={openRazorpay} disabled={creating}
                className="relative w-full py-3.5 rounded-2xl font-extrabold text-primary-foreground overflow-hidden active:scale-[0.97] transition-all disabled:opacity-70"
                style={{ background: "var(--gradient-primary)" }}>
                  <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-[0.12em] text-[11.5px]">
                    {creating ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                    Continue to Payment <ArrowRight size={14} />
                  </span>
                </button>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pay ₹{product.price} securely on Razorpay — UPI, cards, netbanking and wallets supported.
                </p>
              </div>
            }

            {/* transaction verification */}
            <div className="mt-5 pt-5 border-t border-border">
              <label className="block">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  {tab === "upi" ? "Enter UTR / UPI Reference Number" : "Enter Razorpay Transaction ID"}
                </span>
                <div className="mt-2 flex flex-col md:flex-row gap-2">
                  <input
                    value={txn}
                    onChange={(e) => setTxn(e.target.value)}
                    disabled={done}
                    placeholder={tab === "upi" ? "e.g. 412345678901" : "e.g. pay_XXXXXXXXXXXX"}
                    className="flex-1 px-4 py-3.5 rounded-2xl border border-border bg-secondary/60 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary focus:bg-card transition-all disabled:opacity-60" />

                  <button onClick={verify} disabled={verifying || done}
                    className="py-3.5 px-5 rounded-2xl font-extrabold text-[11px] uppercase tracking-[0.14em] text-primary-foreground inline-flex items-center justify-center gap-2 active:scale-[0.96] transition-all disabled:opacity-70"
                    style={{ background: "var(--gradient-primary)" }}>
                    {verifying ? <Loader2 size={14} className="animate-spin" /> : done ? <Check size={14} /> : <Zap size={14} />}
                    {done ? "Submitted" : "Verify Payment"}
                  </button>
                </div>
              </label>
              <p className="mt-3 text-[10.5px] leading-relaxed text-muted-foreground flex gap-1.5">
                <AlertTriangle size={13} className="text-destructive shrink-0 mt-[1px]" />
                Please enter your transaction ID after completing payment. Orders without a transaction ID will not be processed.
              </p>
              {done &&
              <div className="mt-3 rounded-2xl border border-accent/30 bg-accent/8 px-4 py-3 text-[11.5px] font-bold text-foreground">
                  Order {orderCode} is now <span className="text-accent">processing</span>. Track it anytime with your WePlay ID.
                </div>
              }
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);

}
