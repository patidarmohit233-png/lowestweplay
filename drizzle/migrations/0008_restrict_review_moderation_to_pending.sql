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
  WHERE id = p_review_id AND status = 'pending';
  RETURN FOUND;
END;
$$;