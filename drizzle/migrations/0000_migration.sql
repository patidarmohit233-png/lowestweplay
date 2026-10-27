-- ============= ORDERS =============
-- Remove unrestricted read/update policies; access goes through SECURITY DEFINER functions
DROP POLICY IF EXISTS "Orders view self" ON public.orders;
DROP POLICY IF EXISTS "Orders update self" ON public.orders;

-- ============= CUSTOMERS =============
-- Remove unrestricted read; profile access goes through SECURITY DEFINER functions
DROP POLICY IF EXISTS "Customers view self" ON public.customers;

-- ============= ANALYTICS EVENTS =============
-- Replace unrestricted ALL policy with an insert-only whitelist
DROP POLICY IF EXISTS "Public Analytics Access" ON public.analytics_events;
CREATE POLICY "Analytics insert whitelist"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_name IN (
      'page_view',
      'verification_started',
      'click_buy_now',
      'click_lowestweplay_topup',
      'payment_started',
      'payment_verified'
    )
  );

-- ============= BLOG POSTS =============
-- Public read only for posts that are actually visible on the site
DROP POLICY IF EXISTS "Public Blog Access" ON public.blog_posts;
CREATE POLICY "Blog published reads"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR (status = 'scheduled' AND scheduled_at <= now()));

-- ============= ADMIN / APP FUNCTIONS (SECURITY DEFINER) =============
CREATE OR REPLACE FUNCTION public.get_all_orders()
RETURNS SETOF public.orders
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.orders ORDER BY created_at DESC $$;

CREATE OR REPLACE FUNCTION public.get_all_customers()
RETURNS SETOF public.customers
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.customers ORDER BY created_at DESC $$;

CREATE OR REPLACE FUNCTION public.get_recent_analytics(p_limit integer DEFAULT 500)
RETURNS TABLE(id uuid, weplay_id text, url text, created_at timestamptz, metadata jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, weplay_id, url, created_at, metadata
  FROM public.analytics_events
  WHERE event_name = 'page_view'
    AND created_at > now() - interval '7 days'
  ORDER BY created_at DESC
  LIMIT GREATEST(coalesce(p_limit, 500), 1)
$$;

CREATE OR REPLACE FUNCTION public.get_all_blog_posts()
RETURNS SETOF public.blog_posts
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.blog_posts ORDER BY published_at DESC $$;

CREATE OR REPLACE FUNCTION public.admin_save_blog_post(p_post jsonb)
RETURNS public.blog_posts
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_row public.blog_posts;
BEGIN
  IF p_post ? 'id' THEN
    UPDATE public.blog_posts SET
      title = coalesce(p_post->>'title', title),
      slug = coalesce(p_post->>'slug', slug),
      content = coalesce(p_post->>'content', content),
      excerpt = coalesce(p_post->>'excerpt', excerpt),
      author = coalesce(p_post->>'author', author),
      category = coalesce(p_post->>'category', category),
      image_url = coalesce(p_post->>'image_url', image_url),
      tags = coalesce((SELECT array_agg(v::text) FROM jsonb_array_elements_text(p_post->'tags') AS v), tags),
      status = coalesce(p_post->>'status', status),
      scheduled_at = coalesce((p_post->>'scheduled_at')::timestamptz, scheduled_at)
    WHERE id = (p_post->>'id')::uuid
    RETURNING * INTO v_row;
    RETURN v_row;
  ELSE
    INSERT INTO public.blog_posts (
      title, slug, content, excerpt, author, category, image_url, tags, status, scheduled_at
    ) VALUES (
      p_post->>'title',
      p_post->>'slug',
      p_post->>'content',
      p_post->>'excerpt',
      coalesce(p_post->>'author', 'Lowest Weplay Team'),
      p_post->>'category',
      p_post->>'image_url',
      coalesce((SELECT array_agg(v::text) FROM jsonb_array_elements_text(p_post->'tags') AS v), ARRAY[]::text[]),
      coalesce(p_post->>'status', 'draft'),
      (p_post->>'scheduled_at')::timestamptz
    )
    RETURNING * INTO v_row;
    RETURN v_row;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_blog_post(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM public.blog_posts WHERE id = p_id;
  RETURN found;
END;
$$;

CREATE OR REPLACE FUNCTION public.count_customer_orders(p_weplay_id text)
RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT count(*)::int FROM public.orders WHERE weplay_id = p_weplay_id $$;

-- ============= EXECUTE GRANTS =============
GRANT EXECUTE ON FUNCTION public.get_all_orders() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_customers() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_analytics(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_blog_posts() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_save_blog_post(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_blog_post(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.count_customer_orders(text) TO anon, authenticated;