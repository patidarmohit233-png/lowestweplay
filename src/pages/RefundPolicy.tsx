import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Seo from "@/components/Seo";

const RefundPolicy = () => (
  <>
  <Seo
    title="Refund Policy | Lowest Weplay"
    description="When a WePlay top-up qualifies for a refund, what is not covered, and how to request one. Refunds processed in 3-5 business days."
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

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. Refund Eligibility</h2>
          <p>We offer full refunds in the following cases:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Coins were not delivered within 24 hours of payment confirmation</li>
            <li>Incorrect amount of coins was delivered</li>
            <li>Coins were delivered to the wrong account due to our error</li>
            <li>Payment was charged but order was not processed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. Non-Refundable Cases</h2>
          <p>Refunds will not be provided if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You provided an incorrect WePlay ID</li>
            <li>Coins have already been used in-game</li>
            <li>The request is made after 7 days of purchase</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. Refund Process</h2>
          <p>To request a refund, contact us at <a href="mailto:fluxfindindia@gmail.com" className="text-primary font-medium hover:underline">fluxfindindia@gmail.com</a> with your order details and reason for refund. Refunds are typically processed within 3-5 business days to your original payment method.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. Partial Refunds</h2>
          <p>In some cases, partial refunds may be offered if only a portion of the order was affected. Our support team will evaluate each case individually.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. Contact for Refunds</h2>
          <p>For all refund queries, email us at <a href="mailto:fluxfindindia@gmail.com" className="text-primary font-medium hover:underline">fluxfindindia@gmail.com</a>. Our team is available 24x7 to assist you.</p>
        </section>
      </div>
    </motion.div>
  </div>
  </>
);


export default RefundPolicy;
