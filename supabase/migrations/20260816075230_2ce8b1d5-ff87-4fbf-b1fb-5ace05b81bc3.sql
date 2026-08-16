-- Create a function with NO parameters to see if it shows up
CREATE OR REPLACE FUNCTION public.test_rpc()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN 'RPC is working';
END;
$$;

GRANT EXECUTE ON FUNCTION public.test_rpc() TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';