export type Product = {
  id: number;
  name: string;
  img: string;
  price: number;
  mrp: number;
  desc: string;
  coins: string;
  coinsAmount: number;
  link: string;
  isStockedOut?: boolean;
};

export const PRODUCTS: Product[] = [
  { id: 1, name: "10K RED PACKET", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804999/Gemini_Generated_Image_yy0rgmyy0rgmyy0r_dfnma9.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", coinsAmount: 10000, coins: "10,000 + 1,000 bonus", link: "https://razorpay.me/@burgcrav?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D" },
  { id: 2, name: "50K RED PACKET", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804998/Gemini_Generated_Image_vtkas1vtkas1vtka_oumu7o.png", price: 1299, mrp: 5399, desc: "50,000 coins + 50,000 bonus", coinsAmount: 50000, coins: "50,000 + 50,000 bonus", link: "https://razorpay.me/@burgcrav?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D" },
  { id: 3, name: "10K GOLD", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_md8zx9md8zx9md8z_yegmmu.png", price: 479, mrp: 1199, desc: "10,000 coins + 1000 bonus", coinsAmount: 10000, coins: "10,000 + 1,000 bonus", link: "https://razorpay.me/@burgcrav?amount=wwXoG29foDWgJuGJgtb%2BRw%3D%3D" },
  { id: 4, name: "50K GOLD", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804978/Gemini_Generated_Image_79nvx179nvx179nv_xg3bis.png", price: 1299, mrp: 5399, desc: "50,000 coins + 5000 bonus + 1 Broad Absolute", coinsAmount: 50000, coins: "50,000 + 5,000 bonus", link: "https://razorpay.me/@burgcrav?amount=N6UC2nLxOlAFTrRn0HmYgw%3D%3D" },
  { id: 5, name: "100K GOLD", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_si6wdtsi6wdtsi6w_1_ob3o8v.png", price: 2199, mrp: 12000, desc: "1 Lakh coins + 10,000 bonus + 2 Broad Absolute", coinsAmount: 100000, coins: "1,00,000 + 10,000 bonus", link: "https://razorpay.me/@burgcrav?amount=PJ6ahFrCviFu2k0RR%2FxHaQ%3D%3D" },
  { id: 6, name: "250K GOLD", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804982/Gemini_Generated_Image_si6wdtsi6wdtsi6w_w9aomo.png", price: 3299, mrp: 27000, desc: "2.5 Lakh coins + 25,000 bonus + 5 Broad Absolute", coinsAmount: 250000, coins: "2,50,000 + 25,000 bonus", link: "https://razorpay.me/@burgcrav?amount=RjwTDWOTx6cEe8Ttx9EUCw%3D%3D" },
  { id: 7, name: "500K GOLD", img: "https://res.cloudinary.com/dptwx8vd3/image/upload/v1773804980/Gemini_Generated_Image_n9tkkdn9tkkdn9tk_ljcct9.png", price: 5999, mrp: 50000, desc: "5 Lakh coins + 50,000 bonus + 10 Broad Absolute", coinsAmount: 500000, coins: "5,00,000 + 50,000 bonus", link: "https://razorpay.me/@burgcrav?amount=Uj2fVBg%2FvclD1RF0o2z%2BbA%3D%3D" }];


export const RED_PACKETS = PRODUCTS.filter((p) => p.name.includes("RED PACKET"));
export const RECHARGES = PRODUCTS.filter((p) => !p.name.includes("RED PACKET"));

export const FAQS = [
  {
    q: "How long does a Lowest WePlay top-up take?",
    a: "Most orders are credited within a few minutes of payment confirmation. In rare cases it can take up to 24 hours — if it is not delivered inside 24 hours you are eligible for a full refund.",
  },
  {
    q: "Is Lowest Weplay safe for my Lowest WePlay ID?",
    a: "Yes. We only need your Lowest WePlay ID and in-game name. We never ask for your password, OTP or login credentials, so your account stays fully under your control.",
  },
  {
    q: "What do I need to place an order?",
    a: "Just your Lowest WePlay ID and your Lowest WePlay in-game name. Verify them in the panel on the homepage, then pick a package and pay.",
  },
  {
    q: "Which payment methods are supported?",
    a: "Pay securely by UPI using PhonePe, Google Pay, or Paytm on the payment page. We never ask for your UPI PIN or OTP.",
  },
  {
    q: "Why are your prices lower than in-game prices?",
    a: "We are an official top-up partner and buy coin bundles in volume, so we pass the difference on to you. Prices are in INR and include all charges.",
  },
  {
    q: "Can I get a refund?",
    a: "Refund requests may be reviewed for eligible orders. The ₹479 plans are not recommended and are not eligible for refund requests. See the refund policy for full details.",
  },
  {
    q: "Is Lowest Weplay legit?",
    a: "We are an official Lowest WePlay top-up partner with 10,000+ completed orders, 24x7 live chat support and a published refund policy.",
  },
];

export const planSlug = (p: Product) => `lowestweplay-${p.name.toLowerCase().replace(/\s+/g, "-")}`;
export const planPath = (p: Product) => `/plans/${planSlug(p)}`;
