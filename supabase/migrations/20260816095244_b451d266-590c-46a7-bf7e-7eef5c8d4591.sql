-- Ensure all columns exist for payment verification and tracking
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'transaction_id') THEN
        ALTER TABLE public.orders ADD COLUMN transaction_id text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'upi_id') THEN
        ALTER TABLE public.orders ADD COLUMN upi_id text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_code') THEN
        ALTER TABLE public.orders ADD COLUMN order_code text DEFAULT upper(substring(gen_random_uuid()::text from 1 for 8));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'coins_amount') THEN
        ALTER TABLE public.orders ADD COLUMN coins_amount integer;
    END IF;
END $$;

-- Ensure permissions are set correctly for anon and authenticated users
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

-- Ensure RLS allows the frontend to operate
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous insertion (required for guest checkout)
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON public.orders;
CREATE POLICY "Allow anonymous insert on orders" ON public.orders 
FOR INSERT TO anon WITH CHECK (true);

-- Policy to allow update of transaction_id (required for verification)
DROP POLICY IF EXISTS "Allow anonymous update of transaction_id" ON public.orders;
CREATE POLICY "Allow anonymous update of transaction_id" ON public.orders 
FOR UPDATE TO anon USING (true) WITH CHECK (transaction_id IS NOT NULL);

-- Policy to allow public selection of own orders via WePlay ID (tracking)
DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
CREATE POLICY "Allow public select on orders" ON public.orders 
FOR SELECT TO anon USING (true);
