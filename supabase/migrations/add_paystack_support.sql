-- Add Paystack support: gateway column and optional Paystack-specific fields
-- Run in Supabase SQL Editor

ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS gateway text NOT NULL DEFAULT 'moolre';

ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS paystack_response jsonb;
