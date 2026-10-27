-- Ensure the web app can call the existing secure read/update functions
GRANT EXECUTE ON FUNCTION public.get_customer_orders(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_profile(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_order_status(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attach_transaction(uuid, text) TO anon, authenticated;