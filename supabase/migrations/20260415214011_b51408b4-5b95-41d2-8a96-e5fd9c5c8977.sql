-- Remove the overly permissive public SELECT policy on products
-- The edge function uses service_role key, so anon access is not needed
DROP POLICY IF EXISTS "Anon can read active products" ON public.products;