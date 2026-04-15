
-- 1. Drop existing permissive public policies
DROP POLICY IF EXISTS "Service role full access" ON public.bookings;
DROP POLICY IF EXISTS "Service role full access" ON public.conversations;
DROP POLICY IF EXISTS "Service role full access" ON public.messages;
DROP POLICY IF EXISTS "Service role full access" ON public.notification_log;
DROP POLICY IF EXISTS "Service role full access" ON public.products;

-- 2. Create service_role-only policies
CREATE POLICY "Service role full access" ON public.bookings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON public.conversations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON public.messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON public.notification_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access" ON public.products
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 3. Fix function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
