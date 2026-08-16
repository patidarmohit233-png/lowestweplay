import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// Backend endpoint is pinned here so ANY host (Lovable, Vercel, custom domain)
// always builds against the correct project, even without env vars configured.
const SUPABASE_URL = "https://htbhlnmyizvfkwdsicah.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0Ymhsbm15aXp2Zmt3ZHNpY2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODE3NjYsImV4cCI6MjA4OTc1Nzc2Nn0.qGAlrAY3NqlUy-IyHMMawkPAA1pkSuX6d2kRafuqTz8";

export default defineConfig(({ mode }) => ({
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(SUPABASE_URL),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(SUPABASE_ANON_KEY),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(SUPABASE_ANON_KEY),
    "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify("htbhlnmyizvfkwdsicah"),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
