import { supabase } from "@/integrations/supabase/client";

async function check() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log("Users access:", { data, error });

  const { data: o, error: oe } = await supabase.from('orders').select('*').limit(1);
  console.log("Orders access:", { o, oe });
}

check();
