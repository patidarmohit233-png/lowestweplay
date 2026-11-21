import Seo from "@/components/Seo";
import ContentLayout from "@/components/ContentLayout";
import { UserCheck, CreditCard, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const PATH = "/how-it-works";
  
  const steps = [
    {
      title: "Verify Your ID",
      desc: "Enter your Lowest WePlay ID and Name in the verification panel. This ensures we send the coins to the correct player.",
      icon: <UserCheck size={24} />,
      color: "bg-blue-500"
    },
    {
      title: "Select Your Plan",
      desc: "Choose the amount of coins or Red Packets you need. We have plans for every budget.",
      icon: <CheckCircle2 size={24} />,
      color: "bg-indigo-500"
    },
    {
      title: "Make Payment",
      desc: "Complete the payment securely on Razorpay using UPI, cards, net banking or wallets.",
      icon: <CreditCard size={24} />,
      color: "bg-purple-500"
    },
    {
      title: "Verify Transaction",
      desc: "Enter your UTR/Transaction ID to confirm your payment. Our team will verify it instantly.",
      icon: <ShieldCheck size={24} />,
      color: "bg-green-500"
    },
    {
      title: "Receive Coins",
      desc: "Once verified, we process the recharge manually or via automated gift. Check your game within 10-30 minutes!",
      icon: <Clock size={24} />,
      color: "bg-orange-500"
    }
  ];

  return (
    <>
      <Seo 
        title="How It Works — Lowest WePlay Recharge Guide"
        description="Recharge your Lowest WePlay account safely with our 5-step guide — coins delivered instantly."
        path={PATH}
      />
      <ContentLayout 
        currentPath={PATH}
        title="How It Works"
        intro="Recharging your Lowest WePlay account has never been easier. Here is exactly what happens after you click 'Buy Now'."
      >
        <div className="py-12 relative">
          {/* Vertical Line for Mobile */}
          <div className="absolute left-8 top-20 bottom-20 w-px bg-border md:hidden" />
          
          <div className="space-y-16">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                <div className={`relative z-10 w-16 h-16 rounded-2xl ${step.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                  {step.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-foreground border-2 border-border text-[10px] font-black flex items-center justify-center shadow-sm">
                    {i + 1}
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <section className="mt-20 p-8 rounded-3xl bg-card border border-border shadow-elevated text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to start?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Join thousands of players who save money on every top-up. Experience the fastest Lowest WePlay recharge service in India.
            </p>
            <div className="pt-4">
              <a 
                href="/#verify" 
                className="inline-flex py-4 px-10 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
              >
                Start Verification Now
              </a>
            </div>
          </section>
        </div>
      </ContentLayout>
    </>
  );
};

export default HowItWorks;