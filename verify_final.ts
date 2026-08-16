import { supabase } from "@/integrations/supabase/client";

async function verify() {
  const { data: users, error: ue } = await supabase.from('users' as any).select('*').limit(5);
  console.log("Users sample:", users);

  const { data: orders, error: oe } = await supabase.from('orders' as any).select('*').limit(5);
  console.log("Orders sample:", orders);
}

verify();
