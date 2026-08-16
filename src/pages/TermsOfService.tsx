import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Seo from "@/components/Seo";

const TermsOfService = () => (
  <>
  <Seo
    title="Terms of Service | Official Lowest WePlay Top-Up Rules & Delivery"
    description="Terms and conditions for buying Lowest WePlay coins at Lowest Weplay. Secure payments, automated delivery timelines, and user responsibilities in India."
    path="/terms-of-service"
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
        <div className="p-2.5 rounded-xl bg-primary/8 text-primary"><FileText size={24} /></div>
        <h1 className="text-3xl md:text-4xl font-display text-foreground">Terms of Service</h1>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground font-medium">Last updated: March 2026</p>

        <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 1. Acceptance of Terms
          </h2>
          <p>By using Lowest Weplay's services, you agree to these Terms of Service. If you do not agree, please do not use our website or services.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 2. Services
          </h2>
          <p>Lowest Weplay provides Lowest WePlay coin top-up services. We are an <strong>official top-up partner</strong> and facilitate the purchase and delivery of in-game coins to your Lowest WePlay account.</p>
        </section>

        <section className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" /> 3. User Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide accurate Lowest WePlay ID and personal information</li>
            <li>Ensure your account is in good standing</li>
            <li>Do not use our services for any fraudulent purposes</li>
            <li>You must be at least 18 years old or have parental consent</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 4. Payment Terms
          </h2>
          <p>All prices are listed in Indian Rupees (INR). Payments are processed securely through Razorpay. Prices may change without prior notice. The price at the time of purchase will be honored.</p>
        </section>

        <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 5. Delivery
          </h2>
          <p>Coins are typically delivered within minutes of payment confirmation. In rare cases, delivery may take up to 24 hours. <strong>If delivery is not completed within 24 hours, you are eligible for a full refund.</strong></p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 6. Limitation of Liability
          </h2>
          <p>Lowest Weplay is not responsible for any issues arising from incorrect information provided by the user, in-game account bans, or any actions taken by Lowest WePlay on your account.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">7. Contact</h2>
          <p>For any questions regarding these terms, contact us at <a href="mailto:fluxfindindia@gmail.com" className="text-primary font-medium hover:underline">fluxfindindia@gmail.com</a>. We are available 24x7.</p>
        </section>
      </div>
    </motion.div>
  </div>
  </>
);


export default TermsOfService;
