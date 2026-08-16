import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://htbhlnmyizvfkwdsicah.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0Ymhsbm15aXp2Zmt3ZHNpY2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxODE3NjYsImV4cCI6MjA4OTc1Nzc2Nn0.qGAlrAY3NqlUy-IyHMMawkPAA1pkSuX6d2kRafuqTz8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
