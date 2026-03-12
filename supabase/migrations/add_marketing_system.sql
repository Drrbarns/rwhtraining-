-- Marketing System Schema
-- Message templates, campaigns, sent messages, triggers

-- Message Templates
CREATE TABLE IF NOT EXISTS public.message_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  channel text NOT NULL DEFAULT 'email', -- 'email' | 'sms'
  subject text, -- email subject line
  body text NOT NULL, -- HTML for email, plain text for SMS
  category text NOT NULL DEFAULT 'general', -- welcome, payment, reminder, retarget, announcement, completion
  variables text[] DEFAULT '{}', -- available merge variables like {{first_name}}
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  channel text NOT NULL DEFAULT 'email', -- 'email' | 'sms'
  template_id uuid REFERENCES public.message_templates(id) ON DELETE SET NULL,
  subject text, -- override template subject
  body text, -- override template body
  audience_type text NOT NULL DEFAULT 'all_paid', 
  -- audience types: all_paid, all_applicants, abandoned_drafts, partial_payers, full_payers, by_tier, by_city, custom
  audience_filter jsonb DEFAULT '{}', -- filter criteria like {"tier": "20", "city": "Accra"}
  status text NOT NULL DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
  scheduled_at timestamp with time zone,
  sent_at timestamp with time zone,
  total_recipients int DEFAULT 0,
  total_sent int DEFAULT 0,
  total_failed int DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Individual sent messages (message log)
CREATE TABLE IF NOT EXISTS public.campaign_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'email',
  recipient_email text,
  recipient_phone text,
  recipient_name text,
  subject text,
  body text,
  status text NOT NULL DEFAULT 'pending', -- pending, sent, delivered, failed, bounced
  error_message text,
  sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Automated triggers
CREATE TABLE IF NOT EXISTS public.message_triggers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  event text NOT NULL, -- application_submitted, payment_completed, payment_failed, draft_abandoned, balance_reminder, cohort_reminder
  channel text NOT NULL DEFAULT 'email',
  template_id uuid REFERENCES public.message_templates(id) ON DELETE SET NULL,
  delay_minutes int DEFAULT 0, -- delay after event before sending
  is_active boolean DEFAULT true,
  conditions jsonb DEFAULT '{}', -- additional conditions
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_campaign ON public.campaign_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_messages_status ON public.campaign_messages(status);
CREATE INDEX IF NOT EXISTS idx_message_triggers_event ON public.message_triggers(event);

-- RLS
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on message_templates" ON public.message_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on campaign_messages" ON public.campaign_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access on message_triggers" ON public.message_triggers FOR ALL USING (true) WITH CHECK (true);
