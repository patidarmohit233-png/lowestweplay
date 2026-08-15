import { createClient } from '@supabase/supabase-js';

const NEW_URL = "https://mcsimyupawmntiazhug.supabase.co";
const NEW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jc2lteXVpcGF3bW50aWF6aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDcyMzYsImV4cCI6MjExMjM4MzIzNn0.IP78sav7QgP5obwaLS0uVAZ6TXt_cWDR1-b98__Sqh8";

const newClient = createClient(NEW_URL, NEW_KEY);

async function check() {
  const { data: u } = await newClient.from('users').select('*').limit(1);
  const { data: o } = await newClient.from('orders').select('*').limit(1);
  console.log(`Users sample:`, u);
  console.log(`Orders sample:`, o);
}

check();
