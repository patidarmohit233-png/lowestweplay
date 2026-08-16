import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";

const PrivacyPolicy = () => (
  <>
  <Seo
    title="Privacy Policy | Is Lowest Weplay Safe? Official ID Protection"
    description="How Lowest Weplay protects your data during Lowest WePlay top-ups. We never store passwords or OTPs. 100% ID safe delivery with secure UPI payments."
    path="/privacy-policy"
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
        <div className="p-2.5 rounded-xl bg-primary/8 text-primary"><ShieldCheck size={24} /></div>
        <h1 className="text-3xl md:text-4xl font-display text-foreground">Privacy Policy</h1>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-foreground font-medium">Last updated: March 2026</p>

        <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 1. Information We Collect
          </h2>
          <p>We collect information you provide directly to us, including your Lowest WePlay ID, in-game name, email address, and phone number when you make a purchase. <strong>We do not collect or store any passwords or sensitive login credentials</strong> for your gaming accounts.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 2. How We Use Your Information
          </h2>
          <p>Your information is used solely to process your coin top-up orders, deliver coins to your account, send payment confirmations, and provide customer support. We never sell or share your personal data with third parties for marketing purposes.</p>
        </section>

        <section className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" /> 3. Payment Security
          </h2>
          <p>All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. <strong>We do not store your card details, UPI information, or any financial data</strong> on our servers. All transactions are encrypted end-to-end.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 4. Data Retention
          </h2>
          <p>We retain your order information for the duration necessary to fulfill your purchase and provide after-sales support. You may request deletion of your data at any time by contacting us at fluxfindindia@gmail.com.</p>
        </section>

        <section className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
          <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" /> 5. Cookies
          </h2>
          <p>We use minimal cookies to improve your browsing experience and save your form preferences (if you opt in). No tracking cookies are used for advertising purposes.</p>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">6. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:fluxfindindia@gmail.com" className="text-primary font-medium hover:underline">fluxfindindia@gmail.com</a>. We are available 24x7 for your assistance.</p>
        </section>
      </div>
    </motion.div>
  </div>
  </>
);


export default PrivacyPolicy;
