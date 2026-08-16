DROP FUNCTION IF EXISTS public.upsert_customer(text, text);

CREATE OR REPLACE FUNCTION public.upsert_customer(p_weplay_id text, p_weplay_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customers (weplay_id, weplay_name, last_active)
  VALUES (p_weplay_id, p_weplay_name, now())
  ON CONFLICT (weplay_id) DO UPDATE
  SET 
    weplay_name = EXCLUDED.weplay_name,
    last_active = EXCLUDED.last_active;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_customer(text, text) TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';