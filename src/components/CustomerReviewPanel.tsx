import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MessageSquareText, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { customerReviewSchema } from "@/lib/customer-reviews";

type CustomerReview = {
  id: string;
  weplay_name: string;
  review_text: string;
  rating: number;
  created_at: string;
};

type VerifiedBuyer = { user_id: string; name: string };

const EARLIER_REVIEWS = [
  { name: "Rahul", text: "Very nice this website is very good for your weplay life dont wast your money come hare and enjoy" },
  { name: "Ankit G", text: "Maine 50K RED PACKET liya tha. Payment ke baad 10 minute tak kuch nahi aaya toh thoda tension hua. Phir support se baat ki aur 2 minute mein coins aa gaye. Good service" },
  { name: "Eren R", text: "Bhai kya mst website hai phle trust nhi hua tha but ab roj topup karta hu yahi se" },
  { name: "Deepak Kumar", text: "Pehle lag raha tha scam hoga kyunki ID maang rahe the. But unhone bola sirf ID chahiye password nahi. Safe hai bhai" },
  { name: "Neha Jhaal", text: "Raat 1 baje order kiya tha, socha tha kal subah tak wait karna padega coins aa gaye. Trusted website hai" },
  { name: "Amit Tiwari", text: "Sabse sasta recharge yahi mila. Ab yahi se lunga hamesha." },
  { name: "Rohit Yadav", text: "Bhai pehle dar lag raha tha par 2 min mein recharge aa gaya. Highly recommended!" },
  { name: "Sneha", text: "Best experience, trusted hai guys go for it" },
  { name: "Akash007", text: "Legit site hai, coins turant credit ho gaye account mein." },
  { name: "Priya S", text: "ID dalte time dar lag raha tha, support se baat ki unhone bola 100% safe hai. 5 minute mein coins aa gaye." },
];

export default function CustomerReviewPanel({ buyer }: { buyer: VerifiedBuyer | null }) {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.rpc("get_public_customer_reviews").then(({ data, error }) => {
      if (!active) return;
      if (error) {
        toast({ title: "Reviews are temporarily unavailable", description: error.message, variant: "destructive" });
      } else {
        setReviews((data ?? []) as CustomerReview[]);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!buyer) return;

    const parsed = customerReviewSchema.safeParse({ rating, reviewText });
    if (!parsed.success) {
      toast({ title: "Check your review", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.rpc("submit_customer_review", {
      p_weplay_id: buyer.user_id,
      p_rating: parsed.data.rating,
      p_review_text: parsed.data.reviewText,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Could not submit review", description: error.message, variant: "destructive" });
      return;
    }

    setSubmitted(true);
    setReviewText("");
    toast({ title: "Review sent for approval", description: "It will appear here after the team approves it." });
  };

  return (
    <div className="mt-8 md:mt-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-warning/30 bg-warning/10 p-4 md:p-5">
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground">Customer rating</p>
          <p className="mt-1 text-2xl font-display text-foreground">4.9 <span className="text-sm font-semibold text-muted-foreground">/ 5</span></p>
        </div>
        <div className="flex items-center gap-1 text-warning" aria-label="Rated 4.9 out of 5 stars">
          {Array.from({ length: 5 }, (_, index) => <Star key={index} size={20} fill="currentColor" strokeWidth={1.5} />)}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 md:p-5">
        <h3 className="font-display text-base md:text-lg">Share your experience</h3>
        {!buyer ? (
          <p className="mt-2 text-sm text-muted-foreground">Verify your WePlay ID to write a review after a completed top-up.</p>
        ) : submitted ? (
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-accent"><CheckCircle2 size={17} /> Thanks! Your review is waiting for approval.</p>
        ) : (
          <form onSubmit={submitReview} className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">Only customers with a completed top-up can submit a review. Your WePlay name will be shown if approved.</p>
            <div className="flex items-center gap-1" role="group" aria-label="Choose a rating">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <Button
                    key={value}
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    className={rating >= value ? "text-warning" : "text-muted-foreground"}
                  >
                    <Star fill={rating >= value ? "currentColor" : "none"} />
                  </Button>
                );
              })}
              <span className="ml-2 text-xs text-muted-foreground">{rating} / 5</span>
            </div>
            <label className="block">
              <span className="sr-only">Your review</span>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="What was your top-up experience like?"
                className="w-full resize-y rounded-xl border border-border bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
              <span className="mt-1 block text-right text-[11px] text-muted-foreground">{reviewText.length}/500</span>
            </label>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto active:scale-[0.97]">
              {submitting ? <Loader2 className="animate-spin" /> : <Send />}
              {submitting ? "Sending…" : "Submit for approval"}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-7">
        <h3 className="mb-4 font-display text-base md:text-lg">Customer reviews</h3>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground" aria-label="Loading reviews">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {EARLIER_REVIEWS.map((review) => (
              <article key={`earlier-${review.name}`} className="card-premium flex flex-col rounded-2xl p-5">
                <div className="mb-3 flex items-center gap-1 text-warning" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" strokeWidth={1.75} />)}
                </div>
                <blockquote className="flex-grow text-[13px] leading-relaxed text-foreground md:text-sm">“{review.text}”</blockquote>
                <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                  <span className="text-[12.5px] font-bold text-foreground">{review.name}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">Earlier review</span>
                </footer>
              </article>
            ))}
            {reviews.map((review) => (
              <article key={review.id} className="card-premium flex flex-col rounded-2xl p-5">
                <div className="mb-3 flex items-center gap-1 text-warning" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={14} fill={index < review.rating ? "currentColor" : "none"} strokeWidth={1.75} />
                  ))}
                </div>
                <blockquote className="flex-grow text-[13px] leading-relaxed text-foreground md:text-sm">“{review.review_text}”</blockquote>
                <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                  <span className="text-[12.5px] font-bold text-foreground">{review.weplay_name}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-accent"><CheckCircle2 size={12} /> Verified</span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}