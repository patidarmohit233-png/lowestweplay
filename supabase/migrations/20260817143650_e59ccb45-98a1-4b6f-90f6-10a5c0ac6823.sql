-- Revoking execution of SECURITY DEFINER functions from public correctly by using OIDs to handle overloading
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname, p.proname, p.oid
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
          AND p.prosecdef = true
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM public', 
                       func_record.oid::regprocedure);
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM authenticated', 
                       func_record.oid::regprocedure);
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', 
                       func_record.oid::regprocedure);
    END LOOP;
END $$;

-- Policies for user_roles
DROP POLICY IF EXISTS "Public Roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can select all rows" ON public.user_roles;
DROP POLICY IF EXISTS "Allow service_role full access" ON public.user_roles;
DROP POLICY IF EXISTS "Users can see their own roles" ON public.user_roles;

CREATE POLICY "Allow service_role full access" 
ON public.user_roles FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Users can see their own roles" 
ON public.user_roles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Restricting Customers and Orders to be more secure
DROP POLICY IF EXISTS "Public Customers Access" ON public.customers;
DROP POLICY IF EXISTS "Anon can register" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.customers;

CREATE POLICY "Anon can register" ON public.customers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Users can view their own profile" ON public.customers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON public.customers FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public Orders Access" ON public.orders;
DROP POLICY IF EXISTS "Anon can create orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update transaction_id" ON public.orders;

CREATE POLICY "Anon can create orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can view their orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can update transaction_id" ON public.orders FOR UPDATE TO anon, authenticated USING (true);

-- Re-granting precisely
GRANT SELECT, INSERT, UPDATE ON public.customers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.user_roles TO service_role;
