import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Check, CircleCheck, Loader2, ShieldCheck, Smartphone, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import { trackEvent } from "@/lib/analytics";
import { UPI_APPS } from "@/lib/payment-methods";

type VerifiedBuyer = { game: string; user_id: string; name: string };
type UpiApp = (typeof UPI_APPS)[number];

const APP_STYLES: Record<UpiApp, string> = {
  PhonePe: "bg-violet-100 text-violet-700",
  "Google Pay": "bg-sky-100 text-sky-700",
  Paytm: "bg-blue-100 text-blue-700",
};

const APP_MARKS: Record<UpiApp, string> = {
  PhonePe: "P",
  "Google Pay": "G",
  Paytm: "Pay",
};

export default function PaymentModal({
  product,
  buyer,
  onClose,
}: { product: Product | null; buyer: VerifiedBuyer; onClose: () => void }) {
  const [selectedApp, setSelectedApp] = useState<UpiApp | null>(null);
  const [paymentOpened, setPaymentOpened] = useState(false);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!product) return null;

  const openPayment = () => {
    if (!selectedApp) {
      toast({ title: "Choose your UPI app", description: "Select PhonePe, Google Pay, or Paytm first.", variant: "destructive" });
      return;
    }
    const paymentWindow = window.open(product.link, "_blank", "noopener,noreferrer");
    if (!paymentWindow) {
      toast({ title: "Allow the payment page", description: "Your browser blocked the new tab. Allow pop-ups, then try again.", variant: "destructive" });
      return;
    }
    setPaymentOpened(true);
    trackEvent("payment_started", { method: "upi", upi_app: selectedApp, product_id: product.id, product_name: product.name });
  };

  const submitReference = async () => {
    const value = reference.trim();
    if (!selectedApp || !paymentOpened) return;
    if (!/^[A-Za-z0-9_-]{6,80}$/.test(value)) {
      toast({ title: "Check your transaction reference", description: "Enter the UPI transaction ID shown by your payment app (6–80 letters or numbers). Do not enter your UPI PIN or OTP.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.rpc("submit_upi_order", {
      p_weplay_id: buyer.user_id.trim(),
      p_weplay_name: buyer.name || "Player",
      p_product_id: String(product.id),
      p_transaction_id: value,
      p_payment_app: selectedApp,
    });
    setSubmitting(false);
    if (error || !data) {
      toast({ title: "Could not submit payment reference", description: error?.message ?? "Please check it and try again.", variant: "destructive" });
      return;
    }
    setOrderCode(data.order_code);
    setDone(true);
    trackEvent("payment_verified", { method: "upi", upi_app: selectedApp, order_id: data.id, order_code: data.order_code });
    toast({ title: "Payment reference received", description: "Your payment will be checked before the top-up is processed." });
  };

  const refundRestricted = product.id === 1 || product.id === 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/45 p-0 backdrop-blur-md md:items-center md:p-6"
        onClick={onClose} role="dialog" aria-modal="true" aria-label="Complete payment">
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] border-t border-border/60 bg-card/95 shadow-2xl backdrop-blur-3xl md:h-auto md:max-h-[90vh] md:max-w-[560px] md:rounded-[1.5rem] md:border">
          <header className="shrink-0 border-b border-border/60 bg-secondary/30 px-5 pb-4 pt-3 md:px-7 md:pt-6">
            <div className="mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/20 md:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-primary"><ShieldCheck size={13} /> Secure checkout</span>
                <h2 className="mt-1 truncate font-display text-xl text-foreground">{product.name}</h2>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{product.coinsAmount.toLocaleString()} coins</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close payment" className="shrink-0 rounded-full text-muted-foreground"><X size={18} /></Button>
            </div>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 md:px-7 md:py-6">
            <section className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary/50 px-4 py-3" aria-label="Order details">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Player ID</p>
                <p className="mt-0.5 truncate text-sm font-extrabold text-foreground">{buyer.user_id}</p>
              </div>
              <div className="shrink-0 border-l border-border pl-4 text-right">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Final amount</p>
                <p className="mt-0.5 font-price text-2xl font-extrabold text-primary">₹{product.price.toLocaleString("en-IN")}</p>
              </div>
            </section>

            {!done ? <>
              <section>
                <h3 className="text-sm font-extrabold text-foreground">Choose your UPI app</h3>
                <div className="mt-3 grid grid-cols-1 gap-2.5">
                  {UPI_APPS.map((app) => {
                    const active = selectedApp === app;
                    return (
                      <Button key={app} type="button" variant={active ? "default" : "outline"} aria-pressed={active}
                        onClick={() => setSelectedApp(app)}
                        className={`h-auto min-h-[72px] justify-start gap-3 whitespace-normal rounded-lg px-3 py-3 text-left ${active ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                        <span aria-hidden="true" className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-base font-black ${active ? "bg-primary-foreground/15 text-primary-foreground" : APP_STYLES[app]}`}>{APP_MARKS[app]}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-extrabold leading-snug">{app}</span>
                          <span className={`mt-1 block text-xs font-medium ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Pay ₹{product.price.toLocaleString("en-IN")} securely via UPI</span>
                        </span>
                        {active && <CircleCheck size={19} className="shrink-0" aria-label="Selected" />}
                      </Button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-4 border-t border-border pt-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground"><Smartphone size={16} className="text-primary" /> How to pay</h3>
                  <ol className="mt-3 space-y-2">
                    <li className="flex items-start gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2.5"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">1</span><span className="pt-0.5 text-xs leading-relaxed text-foreground">Choose PhonePe, Google Pay, or Paytm above, then continue to the secure payment page.</span></li>
                    <li className="flex items-start gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2.5"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">2</span><span className="pt-0.5 text-xs leading-relaxed text-foreground">On that page, choose UPI and complete ₹{product.price.toLocaleString("en-IN")} in the selected app. Confirm the amount and merchant before paying.</span></li>
                    <li className="flex items-start gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2.5"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">3</span><span className="pt-0.5 text-xs leading-relaxed text-foreground">Return here and enter only the UPI transaction reference shown in the app.</span></li>
                  </ol>
                </div>

                {!paymentOpened ? <Button onClick={openPayment} disabled={!selectedApp} className="w-full py-6 text-sm font-extrabold uppercase active:scale-[0.98]">
                  <ArrowUpRight size={16} /> Continue to secure payment
                </Button> : <>
                  <div>
                    <label htmlFor="upi-reference" className="mb-1.5 block text-xs font-bold text-foreground">UPI transaction reference</label>
                    <input id="upi-reference" value={reference} onChange={(event) => setReference(event.target.value)}
                      placeholder="Enter the reference from your payment app" autoComplete="off" spellCheck={false}
                      className="w-full rounded-md border border-input bg-background px-3 py-3 text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  <p role="alert" className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs font-semibold leading-relaxed text-warning-foreground"><AlertTriangle size={15} className="mt-0.5 shrink-0" /> Never share your UPI PIN or OTP here. Only enter the transaction reference shown after you pay; the payment is checked before top-up.</p>
                  <Button onClick={submitReference} disabled={submitting || !reference.trim()} className="w-full py-6 text-sm font-extrabold uppercase active:scale-[0.98]">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} Submit payment reference
                  </Button>
                </>}
              </section>
            </> : <section className="space-y-4 rounded-lg border border-accent/30 bg-accent/10 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><Check size={19} strokeWidth={3} /></span>
                <div><h3 className="text-sm font-black uppercase text-foreground">Payment reference received</h3><p className="mt-1 text-sm text-muted-foreground">Order <span className="font-extrabold text-primary">#{orderCode}</span> is awaiting payment review.</p></div>
              </div>
              <div className="space-y-2 border-t border-border/70 pt-3 text-sm">
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">UPI app</span><span className="text-right font-bold">{selectedApp}</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Player ID</span><span className="font-bold">{buyer.user_id}</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Amount</span><span className="font-bold">₹{product.price.toLocaleString("en-IN")}</span></div>
              </div>
              {refundRestricted && <p className="rounded-md border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-warning-foreground">The ₹479 pack is not recommended and is not eligible for refund requests.</p>}
              <Button variant="outline" onClick={onClose} className="w-full">Close receipt</Button>
            </section>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}