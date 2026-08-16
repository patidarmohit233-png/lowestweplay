import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to generate a dynamic sitemap including blog posts.
 * Since this is a client-side app, we use this to regenerate the public/sitemap.xml
 * structure which the user can then copy or we can theoretically automate if we had a backend.
 */
export const generateSitemapXml = async () => {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .order("published_at", { ascending: false });

  const SITE_URL = "https://weplayrecharge.shop";
  const today = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { path: "/", priority: "1.0", freq: "daily" },
    { path: "/blog", priority: "0.9", freq: "daily" },
    { path: "/weplay-recharge", priority: "0.9", freq: "weekly" },
    { path: "/weplay-red-packet", priority: "0.9", freq: "weekly" },
    { path: "/weplay-top-up-price-list", priority: "0.9", freq: "weekly" },
    { path: "/how-to-top-up-weplay", priority: "0.8", freq: "monthly" },
    { path: "/faq", priority: "0.7", freq: "monthly" },
    { path: "/trust-safety", priority: "0.8", freq: "monthly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.freq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  posts?.forEach(post => {
    const postDate = new Date(post.published_at).toISOString().split('T')[0];
    xml += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
};
