import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout from "@/components/ContentLayout";
import { FAQS } from "@/data/products";

const PATH = "/faq";

const Faq = () => (
  <>
    <Seo
      title="Lowest WePlay Top-Up FAQ — Delivery, Safety & Refunds"
      description="Answers to the most common Lowest WePlay top-up questions: delivery time, ID safety, payment methods, pricing and refunds. Support available 24x7."
      path={PATH}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}${PATH}` },
          ],
        },
      ]}
    />
    <ContentLayout
      currentPath={PATH}
      title="Lowest WePlay Top-Up FAQ"
      intro="Everything buyers ask us most often — delivery times, account safety, payments and refunds. If your question is not here, our live chat is open 24x7."
    >
      {FAQS.map((f) => (
        <section key={f.q}>
          <h2>{f.q}</h2>
          <p>{f.a}</p>
        </section>
      ))}

      <section>
        <h2>Still have a question?</h2>
        <p>Email fluxfindindia@gmail.com or use the live chat widget. You can also read the <a href="/refund-policy">refund policy</a>, <a href="/terms-of-service">terms of service</a> and <a href="/privacy-policy">privacy policy</a>.</p>
      </section>
    </ContentLayout>
  </>
);

export default Faq;
