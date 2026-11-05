CREATE TABLE public.customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weplay_id text NOT NULL,
  weplay_name text NOT NULL,
  review_text text NOT NULL,
  rating integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  CONSTRAINT customer_reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT customer_reviews_status_valid CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT customer_reviews_text_length CHECK (char_length(trim(review_text)) BETWEEN 10 AND 500)
);

GRANT SELECT ON public.customer_reviews TO anon, authenticated;
GRANT ALL ON public.customer_reviews TO service_role;

ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved customer reviews"
  ON public.customer_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Service role manages customer reviews"
  ON public.customer_reviews
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX customer_reviews_status_created_idx
  ON public.customer_reviews (status, created_at DESC);

CREATE UNIQUE INDEX customer_reviews_one_active_per_player_idx
  ON public.customer_reviews (lower(weplay_id))
  WHERE status IN ('pending', 'approved');

CREATE OR REPLACE FUNCTION public.get_public_customer_reviews()
RETURNS TABLE(id uuid, weplay_name text, review_text text, rating integer, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT r.id, r.weplay_name, r.review_text, r.rating, r.created_at
  FROM public.customer_reviews r
  WHERE r.status = 'approved'
  ORDER BY r.created_at DESC
  LIMIT 60
$$;

CREATE OR REPLACE FUNCTION public.get_all_customer_reviews()
RETURNS TABLE(id uuid, weplay_id text, weplay_name text, review_text text, rating integer, status text, created_at timestamptz, reviewed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT r.id, r.weplay_id, r.weplay_name, r.review_text, r.rating, r.status, r.created_at, r.reviewed_at
  FROM public.customer_reviews r
  ORDER BY CASE r.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, r.created_at DESC
  LIMIT 500
$$;

CREATE OR REPLACE FUNCTION public.submit_customer_review(p_weplay_id text, p_rating integer, p_review_text text)
RETURNS uuid
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_weplay_id text := trim(coalesce(p_weplay_id, ''));
  v_review text := trim(coalesce(p_review_text, ''));
  v_weplay_name text;
  v_review_id uuid;
BEGIN
  IF char_length(v_weplay_id) < 1 OR char_length(v_weplay_id) > 64 THEN
    RAISE EXCEPTION 'Enter a valid WePlay ID.';
  END IF;
  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'Choose a rating from 1 to 5 stars.';
  END IF;
  IF char_length(v_review) < 10 OR char_length(v_review) > 500 THEN
    RAISE EXCEPTION 'Review must be between 10 and 500 characters.';
  END IF;

  SELECT c.weplay_name INTO v_weplay_name
  FROM public.customers c
  WHERE lower(c.weplay_id) = lower(v_weplay_id)
  LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Verify your WePlay ID before submitting a review.';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE lower(o.weplay_id) = lower(v_weplay_id)
      AND lower(o.status) = 'completed'
  ) THEN
    RAISE EXCEPTION 'A completed top-up is required before leaving a review.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.customer_reviews r
    WHERE lower(r.weplay_id) = lower(v_weplay_id)
      AND r.status IN ('pending', 'approved')
  ) THEN
    RAISE EXCEPTION 'You already have a review awaiting approval or published.';
  END IF;

  INSERT INTO public.customer_reviews (weplay_id, weplay_name, review_text, rating)
  VALUES (v_weplay_id, v_weplay_name, v_review, p_rating)
  RETURNING id INTO v_review_id;
  RETURN v_review_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_customer_review_status(p_review_id uuid, p_status text)
RETURNS boolean
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF p_status NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Review decision must be approved or rejected.';
  END IF;

  UPDATE public.customer_reviews
  SET status = p_status, reviewed_at = now()
  WHERE id = p_review_id;
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_customer_reviews() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_customer_reviews() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_customer_review(text, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_customer_review_status(uuid, text) TO anon, authenticated;