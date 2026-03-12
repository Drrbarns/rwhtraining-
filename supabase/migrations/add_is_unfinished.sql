-- Add is_unfinished column to applications if it doesn't exist
-- Run in Supabase SQL Editor if your applications table is missing this column

ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS is_unfinished boolean DEFAULT true;
