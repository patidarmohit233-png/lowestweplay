import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BookOpen, Check, Loader2, Receipt, Search, ShieldCheck, ShoppingBag, X, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";
import { trackEvent } from "@/lib/analytics";
import { AMAZON_PAY_EGIFT_LABEL, AMAZON_PAY_EGIFT_METHOD, AMAZON_PAY_VOUCHER_PIN_LENGTH, isValidAmazonPayVoucherPin } from "@/lib/payment-methods";
import amazonVoucherImage from "@/assets/amazon-pay-egift-card.jpg.asset.json";
import phonePeGuideImage from "@/assets/phonepe-amazon-guide-v2.jpg.asset.json";

type VerifiedBuyer = { game: string; user_id: string; name: string };

export default function PaymentModal({
  product,
  buyer,
  onClose,
}: {
  product: Product | null;
  buyer: VerifiedBuyer;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [txn, setTxn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showVoucherSteps, setShowVoucherSteps] = useState(false);

  if (!product) return null;

  const totalPrice = product.price * quantity;
  const totalCoins = product.coinsAmount * quantity;
  const verify = async () => {
    const code = txn.trim();
    if (!isValidAmazonPayVoucherPin(code)) {
      toast({ title: "Enter a valid voucher code", description: "The Amazon Pay voucher code must contain exactly 14 letters or numbers.", variant: "destructive" });
      return;
    }

    const weplayId = String(buyer.user_id || "").trim();
    if (!weplayId) {
      toast({ title: "Verify your WePlay ID", description: "Please verify your WePlay ID again, then retry.", variant: "destructive" });
      return;
    }

    setVerifying(true);
    trackEvent("payment_started", { method: AMAZON_PAY_EGIFT_METHOD, product_id: product.id, product_name: product.name });

    try {
      const { data, error } = await supabase.rpc("submit_voucher_order", {
        p_weplay_id: weplayId,
        p_weplay_name: String(buyer.name || "Player"),
        p_product_id: String(product.id),
        p_product_name: String(product.name),
        p_price: Math.round(totalPrice),
        p_coins_amount: Math.round(totalCoins),
        p_redeem_code: code,
        p_payment_method: AMAZON_PAY_EGIFT_METHOD,
      });

      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.id || !row.order_code) {
        throw new Error("The order could not be confirmed. Please try again.");
      }

      setOrderCode(row.order_code);
      setDone(true);
      trackEvent("payment_verified", { method: AMAZON_PAY_EGIFT_METHOD, order_id: row.id, order_code: row.order_code });
      toast({ title: "Voucher submitted", description: "Your order is with our team for code and payment review." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please check your connection and try again.";
      console.error("Voucher order submission failed:", error);
      toast({ title: "Could not submit voucher", description: message, variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  const lessRecommended = product.id === 1 || product.id === 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/45 backdrop-blur-md p-0 md:items-center md:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Complete payment"
      >
        <motion.div
          initial={{ y: "100%", opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-border/60 bg-card/95 shadow-2xl backdrop-blur-3xl md:h-auto md:max-h-[90vh] md:max-w-[560px] md:rounded-[2rem]"
        >
          <div className="relative shrink-0 bg-gradient-to-b from-primary/[0.08] to-transparent px-6 pb-5 pt-3 md:px-7 md:pt-6">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-muted-foreground/20 md:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex rounded-md bg-primary/12 px-2 py-0.5 text-[9.5px] font-extrabold uppercase text-primary">
                  Step 2 of 2 · Secure payment
                </span>
                <h2 className="mt-2 truncate font-display text-[1.35rem] leading-tight text-foreground md:text-2xl">{product.name}</h2>
                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="font-price text-[2.25rem] font-extrabold leading-none text-foreground md:text-[2.75rem]">₹{totalPrice}</span>
                  <span className="text-[12.5px] font-semibold text-muted-foreground">Final amount</span>
                </div>
                <p className="mt-1.5 text-[11.5px] font-bold text-accent">
                  {totalCoins >= 100000 ? `${(totalCoins / 100000).toFixed(1)} Lakh` : totalCoins.toLocaleString()} coins
                </p>
              </div>
              <button onClick={onClose} aria-label="Close payment" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-all hover:text-foreground">
                <X size={17} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-10 md:px-7">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/60 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[9.5px] font-extrabold uppercase text-muted-foreground">Player ID</p>
                <p className="mt-0.5 truncate text-[13.5px] font-extrabold text-foreground">{buyer.user_id}</p>
              </div>
              <div className="h-8 w-px shrink-0 bg-border" />
              <div className="min-w-0 text-right">
                <p className="text-[9.5px] font-extrabold uppercase text-muted-foreground">Order ID</p>
                <p className="mt-0.5 truncate text-[13.5px] font-extrabold text-primary">{orderCode ? `#${orderCode}` : "Created after submission"}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-secondary/50 p-4">
              <span className="text-xs font-extrabold uppercase text-muted-foreground">Select quantity</span>
              <div className="flex items-center gap-3">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background font-bold">−</button>
                <span className="min-w-6 text-center text-lg font-extrabold">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background font-bold">+</button>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-card/50 p-5">
              <div className="flex items-center gap-2 text-foreground">
                <ShoppingBag size={16} className="text-primary" />
                <h3 className="text-sm font-extrabold">{AMAZON_PAY_EGIFT_LABEL}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherSteps((visible) => !visible)}
                aria-expanded={showVoucherSteps}
                aria-label="Show Amazon Pay e-Gift Card steps"
                className="mt-3 block w-full overflow-hidden rounded-2xl border-2 border-border bg-background text-left transition-transform active:scale-[0.99]"
              >
                <img
                  src={amazonVoucherImage.url}
                  onError={(event) => { event.currentTarget.src = "/amazon-pay-egift-card.jpg"; }}
                  alt="Amazon Pay e-Gift Card"
                  loading="lazy"
                  className="mx-auto aspect-[500/317] w-[82%] bg-warning/10 object-contain"
                />
                <span className="block px-3 py-2 text-center text-[11px] font-extrabold text-primary">{showVoucherSteps ? "Hide purchase steps" : "Tap the voucher image to see steps"}</span>
              </button>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">Buy an Amazon Pay e-Gift Card for <strong className="text-foreground">₹{totalPrice}</strong>, then enter its code below.</p>
              {showVoucherSteps && (
                <div className="mt-3 rounded-2xl border border-border bg-secondary/60 p-4">
                  <p className="text-[12px] font-black uppercase text-foreground">After buying your voucher</p>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[12px] leading-relaxed text-muted-foreground">
                    <li>Choose an Amazon Pay e-Gift Card for <strong className="text-foreground">₹{totalPrice}</strong>.</li>
                    <li>Complete the purchase and open the gift card details.</li>
                    <li>Copy its voucher code, then paste it in the box below.</li>
                  </ol>
                </div>
              )}

              {done ? (
                <div className="mt-4 space-y-4 rounded-2xl border border-accent/30 bg-accent/10 p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><Check size={20} strokeWidth={3} /></span>
                    <div>
                      <h4 className="text-[15px] font-black uppercase text-foreground">Voucher submitted</h4>
                      <p className="mt-1 text-[12px] font-semibold leading-relaxed text-muted-foreground">Order <span className="font-extrabold text-primary">#{orderCode}</span> is awaiting review by our team.</p>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-xl border border-border bg-card p-4 text-[11px] font-bold">
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">Voucher type</span><span className="text-right text-foreground">{AMAZON_PAY_EGIFT_LABEL}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">Player ID</span><span className="text-right text-foreground">{buyer.user_id}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-muted-foreground">Amount</span><span className="text-primary">₹{totalPrice}</span></div>
                  </div>
                  <p className={`rounded-xl border p-3 text-[11px] font-semibold leading-relaxed ${lessRecommended ? "border-warning/30 bg-warning/10 text-foreground" : "border-border bg-secondary text-muted-foreground"}`}>
                    {lessRecommended ? "This ₹479 pack is less recommended. Your submitted order will still be reviewed." : "We will review the voucher and update your order status. Thank you for choosing Lowest WePlay."}
                  </p>
                  <button onClick={onClose} className="w-full rounded-xl border border-border bg-secondary py-3 text-[11px] font-black uppercase text-foreground transition-colors hover:bg-secondary/80">Close receipt</button>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border-2 border-warning/50 bg-warning/[0.09] p-3.5">
                  <label htmlFor="amazon-voucher-code" className="flex items-center gap-1.5 text-[11px] font-black uppercase text-foreground">
                    <Search size={13} strokeWidth={3} /> Enter Amazon Pay voucher code
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="amazon-voucher-code"
                      value={txn}
                      onChange={(event) => setTxn(event.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, AMAZON_PAY_VOUCHER_PIN_LENGTH))}
                      placeholder="Enter the 14-character code"
                      autoComplete="off"
                      inputMode="text"
                      type="text"
                      spellCheck={false}
                      maxLength={AMAZON_PAY_VOUCHER_PIN_LENGTH}
                      pattern="[A-Za-z0-9]{14}"
                      aria-describedby="amazon-voucher-code-hint"
                      className="w-full rounded-2xl border-2 border-warning/50 bg-card py-3.5 pl-4 pr-11 text-base font-bold text-foreground placeholder:font-semibold placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Receipt size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                  </div>
                  <p id="amazon-voucher-code-hint" className="mt-1.5 text-[11px] font-semibold text-muted-foreground">Enter exactly 14 letters or numbers. Other characters are removed.</p>
                  <button type="button" onClick={verify} disabled={verifying || !isValidAmazonPayVoucherPin(txn.trim())} className="mt-3 w-full rounded-2xl py-3.5 font-extrabold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-primary)" }}>
                    <span className="flex items-center justify-center gap-2 text-[12px] uppercase">
                      {verifying ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                      {verifying ? "Submitting for review…" : "Submit for verification"}
                    </span>
                  </button>
                  <p className="mt-2.5 flex items-start gap-1.5 text-[10.5px] font-semibold leading-relaxed text-muted-foreground">
                    <AlertTriangle size={12} className="mt-[1px] shrink-0 text-destructive" />
                    Check the code before submitting. Submission sends it to our team for review; it does not automatically check the voucher balance with Amazon.
                  </p>
                  <button type="button" onClick={() => setShowGuide((visible) => !visible)} aria-expanded={showGuide} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 py-3 text-[12px] font-black uppercase text-primary transition-transform active:scale-[0.97]">
                    <BookOpen size={15} /> {showGuide ? "Hide PhonePe instructions" : "PhonePe purchase instructions"}
                  </button>
                  {showGuide && (
                    <div className="mt-3 rounded-2xl border border-border bg-secondary/60 p-4">
                      <p className="text-[12px] font-black uppercase text-foreground">Buy through PhonePe</p>
                      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[12px] leading-relaxed text-muted-foreground">
                        <li>Open <strong className="text-foreground">PhonePe</strong> and search for <strong className="text-foreground">Amazon Pay Gift Card</strong> in Gift Cards.</li>
                        <li>Choose <strong className="text-foreground">₹{totalPrice}</strong> and complete payment.</li>
                        <li>Open the gift card, copy its code, and paste it above before submitting.</li>
                      </ol>
                      <img
                        src={phonePeGuideImage.url}
                        onError={(event) => { event.currentTarget.src = "/phonepe-amazon-gift-card-guide.jpg"; }}
                        alt="PhonePe steps for purchasing an Amazon Pay e-voucher"
                        loading="lazy"
                        className="relative left-1/2 mt-3 block w-[calc(100vw-2rem)] max-w-[32rem] -translate-x-1/2 rounded-xl border border-border sm:left-0 sm:w-full sm:max-w-none sm:translate-x-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-5">
              {["Private submission", "Team review", "24/7 support"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span className="text-[9px] font-extrabold uppercase text-muted-foreground">{item}</span>
                </span>
              ))}
            </div>
            <div className="sr-only"><ShieldCheck aria-hidden="true" /></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}