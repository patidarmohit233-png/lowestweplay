import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Seo from "@/components/Seo";

const RefundPolicy = () => (
  <>
  <Seo
    title="Refund Policy | 100% Satisfaction Guarantee | Lowest Weplay"
    description="Full refund policy for LowestWePlay coin top-ups. Learn about eligibility for failed deliveries or restricted IDs. Instant support for all refund requests."
    path="/refund-policy"
  />

  <div className="min-h-screen bg-background text-foreground">

    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </nav>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-primary/8 text-primary"><RotateCcw size={24} /></div>
        <h1 className="text-3xl md:text-4xl font-display text-foreground">Refund Policy</h1>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground font-medium">Last updated: March 2026</p>

        <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 1. Refund Eligibility
          </h2>
          <p>We offer full refunds in the following cases:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Coins were not delivered within 24 hours of payment confirmation</li>
            <li>Incorrect amount of coins was delivered</li>
            <li>Coins were delivered to the wrong account due to our error</li>
            <li>Payment was charged but order was not processed</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 2. Non-Refundable Cases
          </h2>
          <p>Refunds will not be provided if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You provided an incorrect LowestWePlay ID</li>
            <li>Coins have already been used in-game</li>
            <li>The request is made after 7 days of purchase</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
          <h2 className="text-lg font-bold text-destructive mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" /> 3. Restricted IDs & Refused Packages
          </h2>
          <p>We cannot process top-ups in the following situations:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The LowestWePlay ID is restricted, banned, or flagged by the game system</li>
            <li>You purchase a package that we have explicitly refused or warned against in our YouTube video or support messages</li>
          </ul>
          <p>In these cases, the order will not be completed and a refund may not be issued unless otherwise stated below.</p>
        </section>

        <section className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" /> 4. ₹479 Pack Refund Condition
          </h2>
          <p>For the ₹479 package, you may be required to purchase an additional pack before we can attempt processing. If the top-up still cannot be completed even after purchasing the additional pack, we will issue a refund.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 5. Refund Process
          </h2>
          <p>To request a refund, contact us at <a href="mailto:fluxfindindia@gmail.com" className="text-primary font-medium hover:underline">fluxfindindia@gmail.com</a> with your order details and reason for refund. Refunds are typically processed within 3-5 business days to your original payment method.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 6. Partial Refunds
          </h2>
          <p>In some cases, partial refunds may be offered if only a portion of the order was affected. Our support team will evaluate each case individually.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">7. Contact for Refunds</h2>
          <p>For all refund queries, email us at <a href="mailto:fluxfindindia@gmail.com" className="text-primary font-medium hover:underline">fluxfindindia@gmail.com</a>. Our team is available 24x7 to assist you.</p>
        </section>
      </div>
    </motion.div>
  </div>
  </>
);


export default RefundPolicy;
