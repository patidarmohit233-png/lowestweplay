import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout, { PriceTable } from "@/components/ContentLayout";
import { RECHARGES } from "@/data/products";

const PATH = "/lowestweplay-recharge";

const WeplayRecharge = () => (
  <>
    <Seo
      title="LowestWePlay Recharge — Buy LowestWePlay Coins Online in India"
      description="Recharge your LowestWePlay account with 10K to 500K coin packs from ₹479. Instant delivery, official top-up partner, secure UPI and card payments."
      path={PATH}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "LowestWePlay recharge packs",
          itemListElement: RECHARGES.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: `LowestWePlay ${p.name}`,
              description: p.desc,
              image: p.img,
              offers: {
                "@type": "Offer",
                price: p.price,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}${PATH}`,
              },
            },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "LowestWePlay Recharge", item: `${SITE_URL}${PATH}` },
          ],
        },
      ]}
    />
    <ContentLayout
      currentPath={PATH}
      title="LowestWePlay Recharge Packs"
      intro="Recharge your LowestWePlay account with gold coin packs starting at ₹479. Every pack is delivered straight to your LowestWePlay ID — no password, no OTP, no waiting."
    >
      <section>
        <h2>Recharge prices</h2>
        <p>All prices are in Indian Rupees and include every charge. Bigger packs carry a larger bonus, so the effective price per coin drops as the pack size grows.</p>
        <PriceTable items={RECHARGES} />
      </section>

      <section>
        <h2>Which recharge pack should you pick?</h2>
        <ul>
          <li><strong>10K GOLD (₹479)</strong> — best for trying the service or a quick refill for one session.</li>
          <li><strong>50K GOLD (₹1,299)</strong> — the popular mid-tier pack, adds 5,000 bonus coins and 1 Broad Absolute.</li>
          <li><strong>100K GOLD (₹2,199)</strong> — 1 lakh coins with 10,000 bonus, good value for regular players.</li>
          <li><strong>250K &amp; 500K GOLD</strong> — the cheapest per-coin rates, built for heavy spenders and gifters.</li>
        </ul>
      </section>

      <section>
        <h2>How the recharge works</h2>
        <ol>
          <li>Verify your LowestWePlay ID and in-game name in the panel on the homepage.</li>
          <li>Pick a recharge pack and pay through Razorpay (UPI, card, net banking or wallet).</li>
          <li>Coins are credited to your account, usually within a few minutes.</li>
        </ol>
        <p>We never ask for your LowestWePlay password or login OTP, so your account stays fully in your control.</p>
      </section>

      <section>
        <h2>Why recharge with Lowest Weplay?</h2>
        <ul>
          <li>Official LowestWePlay top-up partner with 10,000+ completed orders.</li>
          <li>Lowest listed prices in India — up to 88% below in-game rates.</li>
          <li>Instant delivery with a full refund if coins do not arrive within 24 hours.</li>
          <li>24x7 live chat and email support at fluxfindindia@gmail.com.</li>
        </ul>
      </section>
    </ContentLayout>
  </>
);

export default WeplayRecharge;
