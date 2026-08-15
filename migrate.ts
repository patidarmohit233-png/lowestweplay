import { createClient } from '@supabase/supabase-js';

const OLD_URL = process.env.VITE_SUPABASE_URL!;
const OLD_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const NEW_URL = "https://mcsimyupawmntiazhug.supabase.co";
const NEW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jc2lteXVpcGF3bW50aWF6aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDcyMzYsImV4cCI6MjExMjM4MzIzNn0.IP78sav7QgP5obwaLS0uVAZ6TXt_cWDR1-b98__Sqh8";

const oldClient = createClient(OLD_URL, OLD_KEY);
const newClient = createClient(NEW_URL, NEW_KEY);

async function migrate() {
  console.log("Starting migration...");

  // 1. Customers -> Users
  console.log("Migrating customers...");
  const { data: customers, error: cErr } = await oldClient.from('customers').select('*');
  if (cErr) {
    console.error("Error fetching customers:", cErr);
  } else if (customers) {
    console.log(`Found ${customers.length} customers. Processing sequentially...`);
    for (const c of customers) {
      let retryCount = 0;
      let success = false;
      while (retryCount < 3 && !success) {
        try {
          const { error: insErr } = await newClient.from('users').upsert({
            game: 'WePlay',
            user_id: c.weplay_id,
            name: c.weplay_name,
            created_at: c.created_at,
            last_active: c.last_active
          }, { onConflict: 'user_id, game' });
          if (!insErr) {
            success = true;
          } else {
            console.error(`Retry ${retryCount} for user ${c.weplay_id}: ${insErr.message}`);
            retryCount++;
            await new Promise(r => setTimeout(r, 1000));
          }
        } catch (e) {
          console.error(`Catch retry ${retryCount} for user ${c.weplay_id}`);
          retryCount++;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      if (!success) console.error(`Failed to migrate user ${c.weplay_id} after retries.`);
    }
    console.log("Customer migration done.");
  }

  // 2. Orders -> Orders
  console.log("Migrating orders...");
  const { data: orders, error: oErr } = await oldClient.from('orders').select('*');
  if (oErr) {
    console.error("Error fetching orders:", oErr);
  } else if (orders) {
    console.log(`Found ${orders.length} orders. Processing sequentially...`);
    for (const o of orders) {
      let retryCount = 0;
      let success = false;
      while (retryCount < 3 && !success) {
        try {
          const { error: insErr } = await newClient.from('orders').upsert({
            order_id: o.order_code,
            game: 'WePlay',
            user_id: o.weplay_id,
            plan: o.product_name,
            amount: o.price,
            status: o.status,
            transaction_id: o.transaction_id,
            created_at: o.created_at
          }, { onConflict: 'order_id' });
          if (!insErr) {
            success = true;
          } else {
            console.error(`Retry ${retryCount} for order ${o.order_code}: ${insErr.message}`);
            retryCount++;
            await new Promise(r => setTimeout(r, 1000));
          }
        } catch (e) {
          console.error(`Catch retry ${retryCount} for order ${o.order_code}`);
          retryCount++;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      if (!success) console.error(`Failed to migrate order ${o.order_code} after retries.`);
    }
    console.log("Order migration done.");
  }

  console.log("Migration complete.");
}

migrate();
