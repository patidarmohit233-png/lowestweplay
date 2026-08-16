import { supabase } from "@/integrations/supabase/client";

export type EventType = 
  | 'click_buy_now' 
  | 'click_weplay_topup' 
  | 'payment_started' 
  | 'payment_verified'
  | 'verification_started';

export const trackEvent = async (
  eventName: EventType, 
  metadata: Record<string, any> = {}
) => {
  try {
    const weplay_id = localStorage.getItem('lw_verified_buyer') 
      ? JSON.parse(localStorage.getItem('lw_verified_buyer')!).user_id 
      : null;

    // Use a custom table for analytics if we want to store it in Supabase
    // For now, we can also log to console or use a generic "analytics" table if created
    // Only track if analytics_events table exists. We'll bypass the error for now
    // to prevent blocking the main UI flow if schema cache is stale.
    const { error } = await supabase.from('analytics_events').insert({
      event_name: eventName,
      weplay_id,
      metadata,
      url: window.location.pathname,
      user_agent: navigator.userAgent
    }).select().limit(0);

    if (error) {
      console.warn("Analytics error:", error.message);
    }
  } catch (err) {
    console.error("Failed to track event:", err);
  }
};
