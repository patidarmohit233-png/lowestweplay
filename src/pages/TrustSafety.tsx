import React from 'react';
import Seo from "@/components/Seo";
import ContentLayout from "@/components/ContentLayout";
import { ShieldCheck, Lock, Zap, RefreshCcw, UserCheck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const TrustSafety = () => {
  const PATH = "/trust-safety";
  
  return (
    <>
      <Seo 
        title="Trust & Safety — Is Lowest Weplay Legit? (100% ID Safe)" 
        description="Learn how Lowest WePlay ensures 100% safety for your Lowest WePlay account. We never ask for passwords, offer instant delivery, and provide secure payments."
        path={PATH}
      />
      <ContentLayout 
        currentPath={PATH}
        title="Trust & Safety"
        intro="Your account security is our top priority. We've built Lowest WePlay from the ground up to be the most secure top-up service in the Lowest WePlay community."
      >
        <div className="space-y-12 py-8">
          {/* ID Safety Section */}
          <section className="relative overflow-hidden p-8 rounded-3xl bg-primary/5 border border-primary/10">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mt-0">100% ID Safety Guarantee</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike phishing websites, <strong>we never ask for your password or OTP</strong>. We only require your Lowest WePlay ID and in-game name. This means there is zero risk of your account being stolen or compromised.
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <UserCheck size={16} className="text-primary" /> No Password Required
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <UserCheck size={16} className="text-primary" /> No OTP Needed
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secure Delivery Section */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold">Automated Secure Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our delivery system is fully automated. Once your payment is verified by our team, the coins are credited to your ID via official in-game gifting channels. Most recharges land in your account within 2-5 minutes.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold">Secure Payment Gateways</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All payments are processed through Razorpay and verified UPI channels. We never store your banking details, credit card numbers, or UPI PINs. Your financial data stays between you and the payment provider.
              </p>
            </div>
          </section>

          {/* Verification Steps */}
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-8 text-center">How We Verify Legitimacy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Track Record", desc: "Over 10,000 successful deliveries to happy Lowest WePlay players across India.", icon: <UserCheck size={20} /> },
                { title: "Live Support", desc: "Our 24/7 live chat support is always available to resolve any delivery issues instantly.", icon: <Lock size={20} /> },
                { title: "Refund Policy", desc: "Transparent refund policy if delivery fails or incorrect amounts are sent.", icon: <RefreshCcw size={20} /> }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="mb-4 text-primary">{item.icon}</div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Warning Section */}
          <section className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10 text-center">
            <p className="text-sm font-bold text-destructive italic m-0">
              Important: Always ensure you are on https://lowest weplayrecharge.shop. Be wary of imitators asking for your login credentials.
            </p>
          </section>
        </div>
      </ContentLayout>
    </>
  );
};

export default TrustSafety;
