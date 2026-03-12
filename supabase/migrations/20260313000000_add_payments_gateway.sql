-- Add gateway and Paystack columns to payments if missing
-- Safe to run multiple times (IF NOT EXISTS).
-- Run in Supabase SQL Editor if your DB was created before add_paystack_support.

ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS gateway text NOT NULL DEFAULT 'moolre';

ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS paystack_response jsonb;

-- Backfill existing rows: leave gateway as 'moolre' (default handles it)
COMMENT ON COLUMN public.payments.gateway IS 'Payment gateway: moolre | paystack';
