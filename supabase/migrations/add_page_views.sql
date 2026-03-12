-- Page view analytics (lightweight, no cookies, no PII)
CREATE TABLE IF NOT EXISTS public.page_views (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    path text NOT NULL,
    referrer text,
    country text,
    device text,       -- 'mobile' | 'tablet' | 'desktop'
    browser text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views (created_at DESC);

-- Aggregated daily stats for fast dashboard queries
CREATE TABLE IF NOT EXISTS public.daily_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    date date NOT NULL UNIQUE,
    total_views integer DEFAULT 0,
    unique_paths integer DEFAULT 0,
    top_path text,
    mobile_views integer DEFAULT 0,
    desktop_views integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats (date DESC);

-- Allow service role full access (page views are written server-side only)
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on page_views" ON public.page_views
    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on daily_stats" ON public.daily_stats
    FOR ALL USING (true) WITH CHECK (true);
