import { createClient } from '@supabase/supabase-js';

const NEW_URL = "https://mcsimyupawmntiazhug.supabase.co";
const NEW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jc2lteXVpcGF3bW50aWF6aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDcyMzYsImV4cCI6MjExMjM4MzIzNn0.IP78sav7QgP5obwaLS0uVAZ6TXt_cWDR1-b98__Sqh8";

const newClient = createClient(NEW_URL, NEW_KEY);

async function test() {
  console.log("Testing insert...");
  const { data, error } = await newClient.from('users').insert({
    game: 'WePlay',
    user_id: 'TEST_AGENT',
    name: 'Agent Test'
  }).select();
  
  if (error) console.error("Insert error:", error);
  else console.log("Insert success:", data);
}

test();
