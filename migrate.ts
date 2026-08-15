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
      try {
        const { error: insErr } = await newClient.from('users').upsert({
          game: 'WePlay',
          user_id: c.weplay_id,
          name: c.weplay_name,
          created_at: c.created_at,
          last_active: c.last_active
        }, { onConflict: 'user_id, game' });
        if (insErr) {
          console.error(`Error inserting user ${c.weplay_id}:`, insErr.message);
        } else {
          // Success
        }
      } catch (e) {
        console.error(`Critical error for user ${c.weplay_id}:`, e);
      }
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
        if (insErr) {
          console.error(`Error inserting order ${o.order_code}:`, insErr.message);
        } else {
          // Success
        }
      } catch (e) {
        console.error(`Critical error for order ${o.order_code}:`, e);
      }
    }
    console.log("Order migration done.");
  }

  console.log("Migration complete.");
}

migrate();
