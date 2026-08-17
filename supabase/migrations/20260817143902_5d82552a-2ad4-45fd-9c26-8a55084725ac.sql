DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname, p.proname, p.oid
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
    LOOP
        EXECUTE format('ALTER FUNCTION %s SET search_path = public', 
                       func_record.oid::regprocedure);
    END LOOP;
END $$;
