-- 1. Drop the recursive policy
DROP POLICY IF EXISTS "Public profiles are viewable by admins" ON public.profiles;

-- 2. Create a secure Server-Side function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN v_role IN ('ADMIN', 'SUPER_ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Re-apply a clean policy using the new secure function
CREATE POLICY "Public profiles are viewable by admins" ON public.profiles FOR SELECT USING ( public.is_admin() );
