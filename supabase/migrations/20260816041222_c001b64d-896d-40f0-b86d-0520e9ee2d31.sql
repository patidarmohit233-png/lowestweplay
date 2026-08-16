
-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    weplay_id TEXT,
    metadata JSONB DEFAULT '{}',
    url TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grant permissions
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public events)
CREATE POLICY "Enable insert for all" ON public.analytics_events FOR INSERT TO public WITH CHECK (true);

-- Allow authenticated users (admin) to read
CREATE POLICY "Enable read for authenticated" ON public.analytics_events FOR SELECT TO authenticated USING (true);
