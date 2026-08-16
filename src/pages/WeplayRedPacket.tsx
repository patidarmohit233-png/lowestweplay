import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout, { PriceTable } from "@/components/ContentLayout";
import { RED_PACKETS } from "@/data/products";

const PATH = "/lowest weplay-red-packet";

const WeplayRedPacket = () => (
  <>
    <Seo
      title="Lowest WePlay Red Packet Top-Up — Lowest Price in India"
      description="Buy Lowest WePlay Red Packets from ₹479 with double-bonus coins. Instant delivery to your Lowest WePlay ID, secure Razorpay payment and 24x7 support."
      path={PATH}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lowest WePlay Red Packet top-up packs",
          itemListElement: RED_PACKETS.map((p, i) => ({
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
            { "@type": "ListItem", position: 2, name: "Lowest WePlay Red Packet", item: `${SITE_URL}${PATH}` },
          ],
        },
      ]}
    />
    <ContentLayout
      currentPath={PATH}
      title="Lowest WePlay Red Packet Top-Up"
      intro="Red Packets are the cheapest way to send coins in Lowest WePlay — and the 50K Red Packet doubles your coins with an equal bonus. Both packs are delivered to your Lowest WePlay ID within minutes."
    >
      <section>
        <h2>Red Packet prices</h2>
        <PriceTable items={RED_PACKETS} />
        <p>The 50K Red Packet is our best seller: 50,000 coins plus a 50,000-coin bonus for ₹1,299 — a 76% saving against the in-game rate.</p>
      </section>

      <section>
        <h2>What is a Lowest WePlay Red Packet?</h2>
        <p>A Red Packet is the in-app gifting bundle used to send coins to hosts, friends and rooms. Instead of buying it at full in-game price, you order it here at the partner rate and it lands on the same Lowest WePlay ID.</p>
      </section>

      <section>
        <h2>Red Packet vs recharge</h2>
        <ul>
          <li>Choose a <strong>Red Packet</strong> when you mainly gift coins in rooms and want the largest bonus multiplier.</li>
          <li>Choose a <strong>recharge pack</strong> when you want higher volumes, Broad Absolute items and the lowest per-coin rate. See the <a href="/lowest weplay-recharge">recharge packs</a>.</li>
        </ul>
      </section>

      <section>
        <h2>Ordering steps</h2>
        <ol>
          <li>Enter your Lowest WePlay ID and in-game name in the verification panel on the homepage.</li>
          <li>Select the 10K or 50K Red Packet and complete the Razorpay payment.</li>
          <li>Coins are credited within minutes — no password or OTP is ever required.</li>
        </ol>
      </section>
    </ContentLayout>
  </>
);

export default WeplayRedPacket;
