import { useParams, Link } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/Seo";
import ContentLayout from "@/components/ContentLayout";
import { PRODUCTS, planPath, planSlug } from "@/data/products";
import NotFound from "./NotFound";

const PlanPage = () => {
  const { slug } = useParams();
  const p = PRODUCTS.find((x) => planSlug(x) === slug);
  if (!p) return <NotFound />;

  const path = planPath(p);
  const save = Math.round((1 - p.price / p.mrp) * 100);
  const isRed = p.name.includes("RED PACKET");
  const kind = isRed ? "Red Packet" : "Recharge";
  const others = PRODUCTS.filter((x) => x.id !== p.id);

  return (
    <>
      <Seo
        title={`Lowest WePlay ${p.name} — ₹${p.price} (${save}% Off) | Instant Top-Up`}
        description={`Buy Lowest WePlay ${p.name} for ₹${p.price} instead of ₹${p.mrp}. Get ${p.desc}. Delivered to your WePlay ID in minutes, no password needed.`}
        path={path}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `Lowest WePlay ${p.name}`,
            description: p.desc,
            image: p.img,
            brand: { "@type": "Brand", name: "Lowest WePlay" },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}${path}`,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: `Lowest WePlay ${kind}`, item: `${SITE_URL}${isRed ? "/lowestweplay-red-packet" : "/lowestweplay-recharge"}` },
              { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}${path}` },
            ],
          },
        ]}
      />
      <ContentLayout
        currentPath={path}
        title={`Lowest WePlay ${p.name} Top-Up`}
        intro={`Get ${p.desc} for just ₹${p.price} — ${save}% less than the in-game price of ₹${p.mrp}. Coins go straight to your WePlay ID.`}
      >
        <img src={p.img} alt={`Lowest WePlay ${p.name} pack`} width={320} height={320} loading="eager" className="mx-auto w-48 md:w-64 rounded-2xl" />

        <section>
          <h2>Plan details</h2>
          <ul>
            <li><strong>Pack:</strong> {p.name} ({kind})</li>
            <li><strong>You get:</strong> {p.coins}</li>
            <li><strong>Our price:</strong> ₹{p.price} (in-game ₹{p.mrp})</li>
            <li><strong>You save:</strong> {save}%</li>
            <li><strong>Delivery:</strong> usually within minutes, max 24 hours</li>
          </ul>
        </section>

        <section>
          <h2>How to buy {p.name}</h2>
          <ol>
            <li>Open the <Link to="/#products">homepage</Link> and verify your WePlay ID and name.</li>
            <li>Choose the {p.name} pack and complete the payment.</li>
            <li>Coins arrive on your WePlay ID — no password or OTP needed.</li>
          </ol>
        </section>

        <section>
          <h2>Other Lowest WePlay plans</h2>
          <ul>
            {others.map((o) => (
              <li key={o.id}><Link to={planPath(o)}>{o.name} — ₹{o.price}</Link></li>
            ))}
          </ul>
        </section>
      </ContentLayout>
    </>
  );
};

export default PlanPage;
