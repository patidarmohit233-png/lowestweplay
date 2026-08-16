import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (!error && data) {
        setPost(data);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-display mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary font-bold flex items-center gap-2">
          <ArrowLeft size={16} /> Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo 
        title={`${post.title} | Lowest Weplay Official Blog`} 
        description={post.excerpt}
      />
      
      <header className="relative pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold mb-8">
            <ArrowLeft size={16} /> All Articles
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {post.category && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest mb-4 inline-block">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-display text-foreground leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="font-bold">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-24">
        {post.image_url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden mb-12 shadow-2xl"
          >
            <img src={post.image_url} alt={post.title} className="w-full h-auto" />
          </motion.div>
        )}
        
        <div className="prose prose-lg prose-indigo max-w-none text-foreground/90 leading-relaxed">
          {post.content.split('\n').map((para: string, i: number) => (
            para.trim() && <p key={i} className="mb-6">{para}</p>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-secondary/30 border border-border flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-lg font-display mb-1">Stay Safe with Lowest Weplay</h3>
            <p className="text-muted-foreground text-sm">
              We never ask for your WePlay password or OTP. Only your Player ID and Name are needed for secure, automated top-ups.
            </p>
          </div>
          <Link 
            to="/#products" 
            className="md:ml-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm whitespace-nowrap active:scale-[0.98] transition-transform"
          >
            Top Up Now
          </Link>
        </div>
      </main>
    </div>
  );
}
