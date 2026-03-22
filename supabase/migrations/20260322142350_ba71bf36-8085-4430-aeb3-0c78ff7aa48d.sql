-- Create orders table to store checkout submissions
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  weplay_id TEXT NOT NULL,
  weplay_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth required for placing orders)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read orders (admin access via dashboard)
CREATE POLICY "Service role can read orders"
  ON public.orders
  FOR SELECT
  TO service_role
  USING (true);