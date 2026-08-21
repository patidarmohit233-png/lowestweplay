ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS failure_reason TEXT,
  ADD COLUMN IF NOT EXISTS receipt_note TEXT;