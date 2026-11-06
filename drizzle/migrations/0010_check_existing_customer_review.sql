CREATE OR REPLACE FUNCTION public.has_customer_review(p_weplay_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.customer_reviews r
    WHERE lower(btrim(r.weplay_id)) = lower(btrim(coalesce(p_weplay_id, '')))
  );
$function$;

REVOKE ALL ON FUNCTION public.has_customer_review(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_customer_review(text) TO anon, authenticated;