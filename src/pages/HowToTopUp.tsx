import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout from "@/components/ContentLayout";

const PATH = "/how-to-top-up-weplay";

const HowToTopUp = () => (
  <>
    <Seo
      title="How to Top Up WePlay Coins — Step-by-Step Guide"
      description="Learn how to top up WePlay coins safely: find your WePlay ID, verify your in-game name, pick a pack and pay. Coins delivered in minutes, no password needed."
      path={PATH}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to top up WePlay coins",
          totalTime: "PT5M",
          step: [
            { "@type": "HowToStep", name: "Find your WePlay ID", text: "Open WePlay, tap your profile and copy the numeric ID shown under your avatar." },
            { "@type": "HowToStep", name: "Verify your details", text: "Enter your WePlay ID and in-game name in the verification panel on the Lowest Weplay homepage." },
            { "@type": "HowToStep", name: "Choose a pack", text: "Pick a recharge pack or Red Packet that matches the number of coins you need." },
            { "@type": "HowToStep", name: "Pay securely", text: "Complete the payment via Razorpay using UPI, card, net banking or a wallet." },
            { "@type": "HowToStep", name: "Receive your coins", text: "Coins are credited to your WePlay account, usually within a few minutes." },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "How to Top Up WePlay", item: `${SITE_URL}${PATH}` },
          ],
        },
      ]}
    />
    <ContentLayout
      currentPath={PATH}
      title="How to Top Up WePlay Coins"
      intro="Topping up takes about two minutes and needs only two details: your WePlay ID and your in-game name. Here is the full process, plus the mistakes that cause delays."
    >
      <section>
        <h2>Step 1 — Find your WePlay ID</h2>
        <p>Open the WePlay app, tap your profile picture and look under your avatar. The numeric ID shown there (for example 12345678) is your WePlay ID. Copy it exactly — a single wrong digit sends coins to another account, and that is not refundable.</p>
      </section>

      <section>
        <h2>Step 2 — Verify your details</h2>
        <p>On the Lowest Weplay homepage, enter your WePlay ID and your in-game name in the verification panel. This is how we match the delivery to the right account. We never ask for your password, OTP or any login credential.</p>
      </section>

      <section>
        <h2>Step 3 — Choose your pack</h2>
        <p>Pick a <a href="/weplay-recharge">recharge pack</a> for high volumes and Broad Absolute items, or a <a href="/weplay-red-packet">Red Packet</a> for gifting with the biggest bonus multiplier. The full <a href="/weplay-top-up-price-list">price list</a> shows every option side by side.</p>
      </section>

      <section>
        <h2>Step 4 — Pay securely</h2>
        <p>Payment opens in Razorpay, a PCI-DSS compliant gateway. UPI, debit and credit cards, net banking and wallets all work. We never see or store your card or UPI details.</p>
      </section>

      <section>
        <h2>Step 5 — Receive your coins</h2>
        <p>Coins normally land within a few minutes of the payment clearing. In rare cases delivery can take up to 24 hours; beyond that you are eligible for a full refund.</p>
      </section>

      <section>
        <h2>Common mistakes to avoid</h2>
        <ul>
          <li><strong>Wrong WePlay ID</strong> — double-check every digit before paying; misdirected coins cannot be recovered.</li>
          <li><strong>Mismatched in-game name</strong> — the name must be the one currently shown on your profile.</li>
          <li><strong>Closing the payment window early</strong> — wait for the Razorpay success screen.</li>
          <li><strong>Sharing your password</strong> — no legitimate top-up service ever needs it. We don't.</li>
        </ul>
      </section>

      <section>
        <h2>Need help mid-order?</h2>
        <p>Our live chat sits in the bottom-right corner of every page and is staffed 24x7, or email fluxfindindia@gmail.com. See the <a href="/faq">FAQ</a> for quick answers.</p>
      </section>
    </ContentLayout>
  </>
);

export default HowToTopUp;
