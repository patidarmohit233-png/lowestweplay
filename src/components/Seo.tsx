import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://lowestweplayrecharge.shop";

type SeoProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const Seo = ({ title, description, path, noindex, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LowestLowestWePlay",
    "url": SITE_URL,
    "logo": "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773805014/Gemini_Generated_Image_qxp195qxp195qxp1-removebg-preview_whlc08.png",
    "description": "India's most trusted LowestWePlay top-up service, offering official LowestWePlay coin recharges with instant delivery and 100% ID safety.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "lowestlowestweplay@gmail.com",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is LowestWePlay Recharge safe at LowestLowestWePlay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, LowestLowestWePlay is 100% ID safe. We only require your LowestWePlay ID and Name. We never ask for your password, OTP, or any login credentials."
        }
      },
      {
        "@type": "Question",
        "name": "How long does LowestWePlay top-up take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most LowestWePlay recharges are processed instantly and credited within minutes. In rare cases, it might take up to 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What are the payment options for LowestWePlay recharge?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We support secure payments via UPI (PhonePe, GPay, Paytm) and Razorpay for all LowestWePlay coin packs."
        }
      }
    ]
  };

  const combinedJsonLd = jsonLd 
    ? (Array.isArray(jsonLd) ? [organizationJsonLd, faqJsonLd, ...jsonLd] : [organizationJsonLd, faqJsonLd, jsonLd])
    : [organizationJsonLd, faqJsonLd];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {combinedJsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;
