import { createClient } from '@supabase/supabase-js';

const NEW_URL = "https://mcsimyupawmntiazhug.supabase.co";
const NEW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jc2lteXVpcGF3bW50aWF6aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDcyMzYsImV4cCI6MjExMjM4MzIzNn0.IP78sav7QgP5obwaLS0uVAZ6TXt_cWDR1-b98__Sqh8";

const newClient = createClient(NEW_URL, NEW_KEY);

async function check() {
  const { count: uCount } = await newClient.from('users').select('*', { count: 'exact', head: true });
  const { count: oCount } = await newClient.from('orders').select('*', { count: 'exact', head: true });
  console.log(`New Users: ${uCount}`);
  console.log(`New Orders: ${oCount}`);
}

check();
