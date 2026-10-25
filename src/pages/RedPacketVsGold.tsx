import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout, { PriceTable } from "@/components/ContentLayout";
import { PRODUCTS, RED_PACKETS, RECHARGES, planPath } from "@/data/products";

const PATH = "/red-packet-vs-gold-recharge";

const cheapest = Math.min(...PRODUCTS.map((p) => p.price));

const RedPacketVsGold = () => (
  <>
    <Seo
      title="Red Packet vs Gold Recharge — Which Top-Up Wins?"
      description="Compare WePlay Red Packets and Gold recharge: bonuses, Broad Absolute items and price per coin — pick the right pack before you top up."
      path={PATH}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Red Packet vs Gold Recharge — which WePlay top-up is better?",
          description: "Side-by-side comparison of WePlay Red Packets and Gold recharge packs on Lowest Weplay.",
          author: { "@type": "Organization", name: "Lowest Weplay" },
          publisher: { "@type": "Organization", name: "Lowest Weplay", url: SITE_URL },
          mainEntityOfPage: `${SITE_URL}${PATH}`,
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Red Packet vs Gold Recharge", item: `${SITE_URL}${PATH}` },
          ],
        },
      ]}
    />
    <ContentLayout
      currentPath={PATH}
      title="Red Packet vs Gold Recharge"
      intro={`Both packs start at ₹${cheapest} on Lowest Weplay — so which one should you buy? Here is an honest, side-by-side comparison of WePlay Red Packets and Gold recharge packs so you get the most coins for your money.`}
    >
      <section>
        <h2>Quick comparison</h2>
        <ul>
          <li><strong>Red Packets</strong> — biggest coin bonuses. Ideal if your only goal is more coins in your WePlay wallet.</li>
          <li><strong>Gold recharge</strong> — coins plus Broad Absolute items in bigger packs. Ideal if you also want in-game items along with your top-up.</li>
          <li><strong>Same price, same delivery</strong> — both types are delivered to your WePlay ID within minutes, with no password or OTP required.</li>
        </ul>
      </section>

      <section>
        <h2>What Red Packets give you</h2>
        <p>Red Packets focus purely on coins. The 50K Red Packet, for example, delivers 50,000 coins plus a 50,000 coin bonus — the largest bonus-to-coin ratio in our catalogue. If you spend coins regularly on gifting or gameplay and never need items, Red Packets give you the best value per rupee.</p>
      </section>

      <section>
        <h2>What Gold recharge gives you</h2>
        <p>Gold packs combine coins with Broad Absolute items. The 50K Gold pack includes 50,000 coins, a 5,000 coin bonus and 1 Broad Absolute; the 500K Gold pack goes up to 5 lakh coins with a 50,000 bonus and 10 Broad Absolutes. If items matter to you, Gold packs save you a separate purchase.</p>
      </section>

      <section>
        <h2>Every pack, side by side</h2>
        <p>All prices are in Indian Rupees and include every charge. The effective price per coin drops as the pack size grows — bigger packs always win on value.</p>
        <PriceTable items={PRODUCTS} />
      </section>

      <section>
        <h2>Our recommendation</h2>
        <ul>
          <li><strong>Just want coins?</strong> Pick a <a href={planPath(RED_PACKETS[1])}>50K Red Packet</a> — the biggest bonus in the shop.</li>
          <li><strong>Trying us out?</strong> The <a href={planPath(RED_PACKETS[0])}>10K Red Packet</a> or <a href={planPath(RECHARGES[0])}>10K Gold</a> pack at ₹{cheapest} is the cheapest way to start.</li>
          <li><strong>Want items too?</strong> Go for <a href={planPath(RECHARGES[4])}>100K Gold</a> or bigger — the Broad Absolute count grows with the pack.</li>
        </ul>
        <p>Not sure yet? See the full <a href="/lowestweplay-top-up-price-list">Lowest WePlay price list</a> or read <a href="/lowestweplay-red-packet">about Red Packet top-ups</a> in detail.</p>
      </section>

      <section>
        <h2>People also ask</h2>
        <h3>Are Red Packet coins delivered faster than Gold recharge?</h3>
        <p>No — both are credited to your WePlay ID within minutes of payment confirmation.</p>
        <h3>Which pack has the biggest bonus?</h3>
        <p>The 50K Red Packet: 50,000 coins plus a 50,000 coin bonus — a 100% bonus on top of your purchase.</p>
        <h3>Do I need my WePlay password?</h3>
        <p>Never. We only need your WePlay ID and name to deliver the top-up. 100% ID safe.</p>
      </section>
    </ContentLayout>
  </>
);

export default RedPacketVsGold;
