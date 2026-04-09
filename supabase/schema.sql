-- Remote Work Hub 2026 Masterclass Schema
-- Target: PostgreSQL / Supabase

-- Enabled ENUM types
CREATE TYPE application_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'WAITLISTED', 'APPROVED', 'REJECTED');
CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'SUPER_ADMIN');

-- Core Users Extended Profile
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'STUDENT'::user_role NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  city text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cohorts
CREATE TABLE public.cohorts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  start_date timestamp with time zone NOT NULL,
  capacity int DEFAULT 10 NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Applications
-- Adapted to support guest applications (no user_id required initially)
CREATE TABLE public.applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE, -- Link later when they sign up
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE,
  
  -- Applicant Details
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  
  -- Form Data
  occupation text,
  experience text,
  reason text,
  
  -- Payment Tracking
  tier text NOT NULL DEFAULT '50',
  amount_ghs numeric NOT NULL DEFAULT 1100,
  payment_reference text UNIQUE,
  payment_status text NOT NULL DEFAULT 'PENDING',
  
  status text NOT NULL DEFAULT 'PENDING_REVIEW',
  is_unfinished boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments (Moolre Integration)
CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reference text UNIQUE NOT NULL,
  
  -- Payer Details
  email text NOT NULL,
  phone text NOT NULL,
  first_name text,
  last_name text,
  
  -- Transaction Details
  network text NOT NULL DEFAULT 'MTN',
  amount_ghs numeric NOT NULL,
  tier text NOT NULL DEFAULT '50',
  
  -- Moolre Status
  status text NOT NULL DEFAULT 'PENDING',
  moolre_transaction_id text,
  moolre_response jsonb,
  
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enrollments (Generated upon Approved + Paid Application)
CREATE TABLE public.enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id uuid REFERENCES public.cohorts(id) ON DELETE CASCADE,
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE,
  
  is_active boolean DEFAULT false NOT NULL,
  balance_due numeric(10, 2) DEFAULT 2200.00 NOT NULL,
  total_paid numeric(10, 2) DEFAULT 0.00 NOT NULL,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_payment_reference ON public.applications(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Row Level Security (RLS) configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by admins" ON public.profiles FOR SELECT USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('ADMIN', 'SUPER_ADMIN')) );
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ( auth.uid() = id );
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ( auth.uid() = id );

-- Applications Policies
CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('ADMIN', 'SUPER_ADMIN')) );
CREATE POLICY "Admins can update all applications" ON public.applications FOR UPDATE USING ( auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('ADMIN', 'SUPER_ADMIN')) );

-- Service Role Bypass (For Webhooks/Server Actions)
CREATE POLICY "Service role full access on applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

-- Add initial Cohort
INSERT INTO public.cohorts (name, start_date, capacity, is_active)
VALUES ('2026 Elite Web Development & SaaS Masterclass', '2026-04-20 09:00:00+00', 10, true) ON CONFLICT DO NOTHING;
