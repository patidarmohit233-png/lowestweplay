import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Clock, MessageSquare, ShieldCheck, Headphones } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background text-foreground">
    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </nav>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-20"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/8 text-primary mb-4"
        >
          <Headphones size={32} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-display text-foreground mb-3">Contact Us</h1>
        <p className="text-muted-foreground max-w-md mx-auto">We're here to help you with anything. Reach out and we'll respond as soon as possible.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {[
          {
            icon: <Mail size={24} />,
            title: "Email Us",
            desc: "Drop us a line anytime",
            value: "fluxfindindia@gmail.com",
            href: "mailto:fluxfindindia@gmail.com",
          },
          {
            icon: <Clock size={24} />,
            title: "Available 24x7",
            desc: "Round the clock support",
            value: "We never sleep! 🚀",
            href: null,
          },
          {
            icon: <MessageSquare size={24} />,
            title: "Live Chat",
            desc: "Chat with us on the website",
            value: "Bottom-right chat widget",
            href: null,
          },
          {
            icon: <ShieldCheck size={24} />,
            title: "ID Safety",
            desc: "Concerns about your account?",
            value: "We guarantee 100% safety",
            href: null,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            whileHover={{ y: -3, transition: { type: "spring", stiffness: 400 } }}
            className="bg-card rounded-2xl border border-border p-6 hover:border-primary/20 transition-all duration-300"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-primary mb-3">{item.icon}</div>
            <h3 className="text-base font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-sm mb-2">{item.desc}</p>
            {item.href ? (
              <a href={item.href} className="text-primary font-semibold text-sm hover:underline">{item.value}</a>
            ) : (
              <span className="text-foreground font-semibold text-sm">{item.value}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Highlight banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-primary/5 border border-primary/15 rounded-2xl p-8 text-center animate-gentle-glow"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
          <Clock size={22} />
        </div>
        <h2 className="text-xl md:text-2xl font-display text-foreground mb-2">
          We're Available <span className="text-primary">24x7</span> For Your Help
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          Whether it's a question about your order, delivery status, or anything else — our support team is always ready to assist you, day or night.
        </p>
        <a
          href="mailto:fluxfindindia@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:shadow-[var(--shadow-primary)] transition-shadow duration-300"
        >
          <Mail size={16} /> Email Us Now
        </a>
      </motion.div>
    </motion.div>
  </div>
);

export default Contact;
