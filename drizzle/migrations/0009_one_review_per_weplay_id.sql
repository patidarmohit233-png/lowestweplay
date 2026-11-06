CREATE UNIQUE INDEX customer_reviews_one_per_player_idx
  ON public.customer_reviews (lower(btrim(weplay_id)));

DROP INDEX public.customer_reviews_one_active_per_player_idx;

CREATE OR REPLACE FUNCTION public.submit_customer_review(p_weplay_id text, p_rating integer, p_review_text text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
    WHERE lower(btrim(r.weplay_id)) = lower(v_weplay_id)
  ) THEN
    RAISE EXCEPTION 'One review has already been submitted for this WePlay ID.';
  END IF;

  INSERT INTO public.customer_reviews (weplay_id, weplay_name, review_text, rating)
  VALUES (v_weplay_id, v_weplay_name, v_review, p_rating)
  RETURNING id INTO v_review_id;
  RETURN v_review_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'One review has already been submitted for this WePlay ID.';
END;
$function$;