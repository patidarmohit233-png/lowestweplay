import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Gamepad2, Gift, Loader2, ShieldCheck, ShoppingBag, Ticket, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import { trackEvent } from "@/lib/analytics";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/payment-methods";

type VerifiedBuyer = { game: string; user_id: string; name: string };

const METHOD_ICONS = {
  google_play: Gamepad2,
  amazon_pay_egift: ShoppingBag,
  flipkart_egift: Gift,
} satisfies Record<PaymentMethodId, typeof Gamepad2>;

export default function PaymentModal({
  product,
  buyer,
  onClose,
}: { product: Product | null; buyer: VerifiedBuyer; onClose: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!product) return null;

  const amount = product.price;
  const coins = product.coinsAmount;
  const selected = PAYMENT_METHODS.find((method) => method.id === selectedMethod);
  const isRefundRestricted = product.id === 1 || product.id === 3;

  const verify = async () => {
    const code = voucherCode.trim();
    if (!selectedMethod) {
      toast({ title: "Choose a payment option", description: "Select one of the three voucher options first.", variant: "destructive" });
      return;
    }
    if (code.length < 4) {
      toast({ title: "Enter your voucher code", description: "Paste the full, unused voucher code.", variant: "destructive" });
      return;
    }
    const weplayId = buyer.user_id.trim();
    if (!weplayId) {
      toast({ title: "Verify your WePlay ID", description: "Please verify your WePlay ID again, then retry.", variant: "destructive" });
      return;
    }

    setVerifying(true);
    trackEvent("payment_started", { method: selectedMethod, product_id: product.id, product_name: product.name });
    const { data, error } = await supabase.rpc("submit_voucher_order", {
      p_weplay_id: weplayId,
      p_weplay_name: buyer.name || "Player",
      p_product_id: String(product.id),
      p_product_name: product.name,
      p_price: amount,
      p_coins_amount: coins,
      p_redeem_code: code,
      p_payment_method: selectedMethod,
    });

    setVerifying(false);
    if (error || !data) {
      toast({ title: "Verification failed", description: error?.message ?? "Please check the voucher code and try again.", variant: "destructive" });
      return;
    }

    setOrderCode(data.order_code);
    setDone(true);
    trackEvent("payment_verified", { method: selectedMethod, order_id: data.id, order_code: data.order_code });
    toast({ title: "Payment submitted", description: "Your voucher is being checked. Track the order in My Account." });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-foreground/45 backdrop-blur-md p-0 md:p-6"
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
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{coins.toLocaleString()} coins</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close payment" className="shrink-0 rounded-full text-muted-foreground">
                <X size={18} />
              </Button>
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
                <p className="mt-0.5 font-price text-2xl font-extrabold text-primary">₹{amount.toLocaleString("en-IN")}</p>
              </div>
            </section>

            {!done ? <>
              <section>
                <h3 className="text-sm font-extrabold text-foreground">Choose how to pay</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = METHOD_ICONS[method.id];
                    const active = selectedMethod === method.id;
                    return (
                      <Button
                        key={method.id}
                        type="button"
                        variant={active ? "default" : "outline"}
                        aria-pressed={active}
                        onClick={() => { setSelectedMethod(method.id); setVoucherCode(""); }}
                        className={`h-auto min-h-20 flex-col whitespace-normal px-2 py-3 text-center text-xs leading-snug ${active ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                        <Icon size={19} />
                        <span>{method.shortLabel}</span>
                      </Button>
                    );
                  })}
                </div>
              </section>

              {selected && <motion.section
                key={selected.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-4 border-t border-border pt-4">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground"><Ticket size={16} className="text-primary" /> {selected.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.instructions}</p>
                  <p className="mt-2 text-xs font-bold text-foreground">Voucher amount must be exactly ₹{amount.toLocaleString("en-IN")}.</p>
                </div>
                <div>
                  <label htmlFor="voucher-code" className="mb-1.5 block text-xs font-bold text-foreground">Paste voucher code</label>
                  <input
                    id="voucher-code" value={voucherCode} onChange={(event) => setVoucherCode(event.target.value)}
                    placeholder="Enter the full voucher code" autoComplete="off" spellCheck={false}
                    className="w-full rounded-md border border-input bg-background px-3 py-3 text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-warning" /> Submit only a valid, unused voucher for the exact amount. Your order is created when you select Verify Payment.</p>
                <Button onClick={verify} disabled={verifying || !voucherCode.trim()} className="w-full py-6 text-sm font-extrabold uppercase active:scale-[0.98]">
                  {verifying ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                  Verify Payment
                </Button>
              </motion.section>}
            </> : <section className="space-y-4 rounded-lg border border-accent/30 bg-accent/10 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><Check size={19} strokeWidth={3} /></span>
                <div>
                  <h3 className="text-sm font-black uppercase text-foreground">Order received</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Order <span className="font-extrabold text-primary">#{orderCode}</span> is being verified.</p>
                </div>
              </div>
              <div className="space-y-2 border-t border-border/70 pt-3 text-sm">
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Payment</span><span className="text-right font-bold">{selected?.label}</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Player ID</span><span className="font-bold">{buyer.user_id}</span></div>
                <div className="flex justify-between gap-3"><span className="text-muted-foreground">Amount</span><span className="font-bold">₹{amount.toLocaleString("en-IN")}</span></div>
              </div>
              {isRefundRestricted && <p className="rounded-md border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-warning-foreground">The ₹479 pack is not recommended and is not eligible for refund requests.</p>}
              <Button variant="outline" onClick={onClose} className="w-full">Close receipt</Button>
            </section>}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}