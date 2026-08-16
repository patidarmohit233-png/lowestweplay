import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout, { PriceTable } from "@/components/ContentLayout";
import { PRODUCTS } from "@/data/products";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const PATH = "/weplay-recharge-topup";

const WeplayTopupLanding = () => {
  return (
    <>
      <Seo
        title="WePlay Recharge & Top Up India — Cheapest WePlay Coins"
        description="Get the cheapest WePlay Recharge and Top Up in India. Buy WePlay coins instantly starting at ₹479. 100% ID safe, official partner, secure UPI payments."
        path={PATH}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "WePlay Recharge & Top Up Landing Page",
            "description": "Dedicated landing page for WePlay coin recharge and top up services in India.",
            "url": `${SITE_URL}${PATH}`
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
              { "@type": "ListItem", "position": 2, "name": "WePlay Recharge & Top Up", "item": `${SITE_URL}${PATH}` }
            ]
          }
        ]}
      />
      <ContentLayout
        currentPath={PATH}
        title="WePlay Recharge & Top Up India"
        intro="Welcome to India's most trusted destination for WePlay Recharge and WePlay Top Up. We provide the fastest and cheapest way to get WePlay coins directly to your ID."
      >
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold m-0">Instant Recharge</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get your WePlay coins credited within minutes. Our automated system ensures your top-up is processed as soon as the payment is verified.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold m-0">100% ID Safe</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We never ask for your password or OTP. Only your WePlay ID and Name are required for the top-up, keeping your account fully secure.
              </p>
            </div>
          </div>

          <h2>Cheapest WePlay Top Up Plans</h2>
          <p>Compare our prices with in-game rates and save up to 70% on your next WePlay recharge.</p>
          <PriceTable items={PRODUCTS} />

          <div className="mt-12 text-center">
            <Link 
              to="/#products" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
            >
              Start Your Recharge Now <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-12">
          <h2>Why Choose weplayrecharge.shop?</h2>
          <div className="space-y-4">
            {[
              "Official WePlay Top-Up Partner in India.",
              "Lowest prices guaranteed for all coin packs.",
              "Secure payments via UPI and Razorpay.",
              "Thousands of satisfied gamers trust our service.",
              "Dedicated support for all recharge issues."
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-accent mt-1 shrink-0" />
                <p className="m-0 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2>Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold">Is this an official WePlay top-up?</h4>
              <p className="text-muted-foreground">Yes, we are an authorized third-party recharge partner. We use official channels to credit coins to your WePlay ID.</p>
            </div>
            <div>
              <h4 className="font-bold">How do I find my WePlay ID?</h4>
              <p className="text-muted-foreground">Open the WePlay app, go to your profile, and you will see your ID number below your nickname.</p>
            </div>
          </div>
        </section>
      </ContentLayout>
    </>
  );
};

export default WeplayTopupLanding;
