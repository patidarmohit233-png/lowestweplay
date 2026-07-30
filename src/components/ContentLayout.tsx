import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";

export const CONTENT_LINKS = [
  { to: "/weplay-recharge", label: "WePlay Recharge Packs" },
  { to: "/weplay-red-packet", label: "WePlay Red Packet Top-Up" },
  { to: "/weplay-top-up-price-list", label: "WePlay Top-Up Price List" },
  { to: "/how-to-top-up-weplay", label: "How to Top Up WePlay" },
  { to: "/faq", label: "WePlay Top-Up FAQ" },
];

export function PriceTable({ items = PRODUCTS }: { items?: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">WePlay top-up packages with prices in Indian Rupees</caption>
        <thead className="bg-muted/60 text-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold">Package</th>
            <th scope="col" className="px-4 py-3 font-bold">What you get</th>
            <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap">Our price</th>
            <th scope="col" className="px-4 py-3 font-bold whitespace-nowrap">You save</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          {items.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <th scope="row" className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{p.name}</th>
              <td className="px-4 py-3">{p.desc}</td>
              <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">₹{p.price}</td>
              <td className="px-4 py-3 whitespace-nowrap">{Math.round((1 - p.price / p.mrp) * 100)}% off ₹{p.mrp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ContentLayout = ({
  title,
  intro,
  currentPath,
  children,
}: {
  title: string;
  intro: string;
  currentPath: string;
  children: React.ReactNode;
}) => (
  <div className="min-h-screen bg-background text-foreground">
    <nav className="sticky top-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </nav>

    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20"
    >
      <h1 className="text-3xl md:text-5xl font-display text-foreground mb-4">{title}</h1>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10">{intro}</p>

      <div className="space-y-8 leading-relaxed text-muted-foreground [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5">
        {children}
      </div>

      <div className="mt-12 rounded-2xl border border-primary/15 bg-primary/5 p-6 md:p-8 text-center">
        <h2 className="text-xl md:text-2xl font-display text-foreground mb-2">Ready to top up your WePlay account?</h2>
        <p className="mb-5">Verify your WePlay ID on the homepage and get your coins in minutes.</p>
        <Link
          to="/#products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm active:scale-[0.97] transition-transform"
        >
          Buy WePlay coins now <ArrowRight size={16} />
        </Link>
      </div>

      <nav aria-label="Related pages" className="mt-12 border-t border-border pt-8">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-muted-foreground mb-4">Explore more</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CONTENT_LINKS.filter((l) => l.to !== currentPath).map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-primary font-semibold text-sm hover:underline">{l.label}</Link>
            </li>
          ))}
          <li><Link to="/contact" className="text-primary font-semibold text-sm hover:underline">Contact Support</Link></li>
        </ul>
      </nav>
    </motion.main>
  </div>
);

export default ContentLayout;
