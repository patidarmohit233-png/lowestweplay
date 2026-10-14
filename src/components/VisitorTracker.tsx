import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const readBuyer = () => {
  try {
    const b = JSON.parse(localStorage.getItem("lw_verified_buyer") || "null");
    return { weplay_id: b?.user_id ? String(b.user_id) : null, name: b?.name ? String(b.name) : null };
  } catch {
    return { weplay_id: null, name: null };
  }
};

const sessionId = (() => {
  try {
    let s = sessionStorage.getItem("lw_sid");
    if (!s) { s = crypto.randomUUID(); sessionStorage.setItem("lw_sid", s); }
    return s;
  } catch { return Math.random().toString(36).slice(2); }
})();

/** Live presence + page-view log for the admin panel. Skips admin pages. */
export default function VisitorTracker() {
  const { pathname } = useLocation();
  const chRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const readyRef = useRef(false);
  const since = useRef(new Date().toISOString());
  const isAdmin = pathname.startsWith("/admin");

  const payload = () => ({ ...readBuyer(), path: pathname, host: window.location.host, since: since.current, at: new Date().toISOString() });

  useEffect(() => {
    if (isAdmin) return;
    const ch = supabase.channel("live-visitors", { config: { presence: { key: sessionId } } });
    chRef.current = ch;
    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") { readyRef.current = true; ch.track(payload()); }
    });
    const iv = setInterval(() => readyRef.current && ch.track(payload()), 30000);
    return () => { clearInterval(iv); readyRef.current = false; supabase.removeChannel(ch); chRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    if (readyRef.current && chRef.current) chRef.current.track(payload());
    const { weplay_id, name } = readBuyer();
    supabase.from("analytics_events").insert({
      event_name: "page_view",
      weplay_id,
      url: pathname,
      user_agent: navigator.userAgent,
      metadata: { name, host: window.location.host, session: sessionId },
    }).then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
