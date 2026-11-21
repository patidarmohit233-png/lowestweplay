
import { useState, useEffect } from "react";
import Admin from "./Admin";
import Seo from "@/components/Seo";
import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

export default function AdminGate() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "shubham124" && password === "omji2323") {
      setIsLoggedIn(true);
      setError("");
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setError("Invalid credentials");
      toast({
        title: "Login Failed",
        description: "Incorrect admin username or password.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Seo title="Admin" description="Admin login" path="/admin" noindex />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-elevated relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
            <Lock className="text-primary/20" size={48} />
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-display mb-2">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Access Restricted. Authorized Personnel Only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter admin username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl text-primary-foreground font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
}
