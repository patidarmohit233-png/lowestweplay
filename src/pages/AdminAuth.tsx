import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin · Lowest Weplay";
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      toast({ title: "Account created", description: "Ask an existing admin to grant you access." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-background text-foreground px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 space-y-5" style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.15)" }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3"><Lock size={22} /></div>
          <h1 className="text-2xl font-display">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-1">Restricted area</p>
        </div>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5 block">Password</span>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </label>
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Working…</> : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-xs text-muted-foreground hover:text-primary transition-colors">
          {mode === "signin" ? "First time? Create an account" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
