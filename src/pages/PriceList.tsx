import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout, { PriceTable } from "@/components/ContentLayout";
import { PRODUCTS, RED_PACKETS, RECHARGES } from "@/data/products";

const PATH = "/lowestweplay-top-up-price-list";
const cheapest = Math.min(...PRODUCTS.map((p) => p.price));

const PriceList = () => (
  <>
    <Seo
      title="Lowest WePlay Top-Up Price List 2026 (INR) | Lowest Weplay"
      description={`Full Lowest WePlay top-up price list in INR — coins, recharge packs and Red Packets from ₹${cheapest}. Compare every pack, bonus and discount in one table.`}
      path={PATH}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lowest WePlay top-up price list",
          itemListElement: PRODUCTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: `Lowest WePlay ${p.name}`,
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
            { "@type": "ListItem", position: 2, name: "Lowest WePlay Top-Up Price List", item: `${SITE_URL}${PATH}` },
          ],
        },
      ]}
    />
    <ContentLayout
      currentPath={PATH}
      title="Lowest WePlay Top-Up Price List"
      intro={`Every Lowest WePlay pack we sell, with its exact price in Indian Rupees, the bonus included and the discount against the in-game rate. Prices start at ₹${cheapest}.`}
    >
      <section>
        <h2>Red Packet prices</h2>
        <PriceTable items={RED_PACKETS} />
      </section>

      <section>
        <h2>Recharge (gold) prices</h2>
        <PriceTable items={RECHARGES} />
      </section>

      <section>
        <h2>Cost per coin</h2>
        <p>Larger packs are always cheaper per coin once the bonus is counted. The 500K pack delivers 5.5 lakh coins for ₹5,999 — roughly a tenth of the in-game cost of the same amount.</p>
        <ul>
          <li>Cheapest entry point: <strong>₹479</strong> for 11,000 coins.</li>
          <li>Best all-round value: <strong>₹2,199</strong> for 1.1 lakh coins plus 2 Broad Absolute.</li>
          <li>Best bulk rate: <strong>₹5,999</strong> for 5.5 lakh coins plus 10 Broad Absolute.</li>
        </ul>
      </section>

      <section>
        <h2>What affects the price?</h2>
        <p>Prices are fixed in INR and include all payment charges — there are no hidden fees at checkout. Rates can change when Lowest WePlay adjusts partner pricing; the price shown at the moment of payment is the price you pay.</p>
        <p>Payments run through Razorpay, so UPI, cards, net banking and wallets are all supported. Read the <a href="/refund-policy">refund policy</a> before ordering.</p>
      </section>
    </ContentLayout>
  </>
);

export default PriceList;
