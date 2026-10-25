import React from 'react';
import Seo from "@/components/Seo";
import ContentLayout from "@/components/ContentLayout";
import { ShieldCheck, Zap, Heart, MessageSquare, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

const WhyUs = () => {
  const PATH = "/why-us";
  
  const benefits = [
    {
      title: "Cheapest in India",
      desc: "We offer the lowest possible rates for Lowest WePlay coins and Red Packets, significantly cheaper than direct in-app purchases.",
      icon: <Award className="text-yellow-500" />,
      color: "bg-yellow-500/10"
    },
    {
      title: "No Password Required",
      desc: "Your account security is 100% guaranteed. We only need your Lowest WePlay ID to gift coins. Never share your OTP or password.",
      icon: <ShieldCheck className="text-green-500" />,
      color: "bg-green-500/10"
    },
    {
      title: "Instant Delivery",
      desc: "Our automated system processes orders 24/7. Most recharges are completed within 5-15 minutes of payment verification.",
      icon: <Zap className="text-blue-500" />,
      color: "bg-blue-500/10"
    },
    {
      title: "24/7 Human Support",
      desc: "Facing an issue? Our live chat support is manned by real people who care about your gaming experience.",
      icon: <MessageSquare className="text-purple-500" />,
      color: "bg-purple-500/10"
    }
  ];

  return (
    <>
      <Seo 
        title="Why Choose Lowest Weplay — Trusted Top-Up India"
        description="See why thousands of players trust Lowest WePlay: lowest prices, instant delivery and 100% ID-safe recharges."
        path={PATH}
      />
      <ContentLayout 
        currentPath={PATH}
        title="Why Choose Us?"
        intro="Lowest WePlay is built by gamers, for gamers. We understand the value of your hard-earned money and the security of your account."
      >
        <div className="py-10 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(benefit.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <section className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">10,000+ Happy Players</h2>
              <p className="text-muted-foreground italic">
                "I was hesitant at first, but Lowest WePlay is legit. The coins arrived in 5 minutes and the price was way better than the app. Definitely my go-to now!"
              </p>
              <div className="flex items-center justify-center gap-2 font-bold text-foreground">
                <Heart size={16} className="text-red-500 fill-red-500" /> Trusted by the Indian Lowest WePlay Community
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { label: "Orders Delivered", value: "12,400+", icon: <Zap size={20} /> },
              { label: "Safety Rating", value: "100%", icon: <ShieldCheck size={20} /> },
              { label: "Avg. Process Time", value: "8 Mins", icon: <Clock size={20} /> }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-center text-primary mb-2">{stat.icon}</div>
                <div className="text-4xl font-black text-foreground">{stat.value}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default WhyUs;