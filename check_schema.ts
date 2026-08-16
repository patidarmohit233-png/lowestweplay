import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://mcsimyuipawmntiazhug.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jc2lteXVpcGF3bW50aWF6aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDcyMzYsImV4cCI6MjEwMjM4MzIzNn0.IP78sav7QgP5obwaLS0uVAZ6TXt_cWDR1-b98__Sqh8";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log("Users access:", { data, error });

  const { data: o, error: oe } = await supabase.from('orders').select('*').limit(1);
  console.log("Orders access:", { o, oe });

  const { data: c, error: ce } = await supabase.from('customers').select('*').limit(1);
  console.log("Customers access:", { c, ce });
}

check();
