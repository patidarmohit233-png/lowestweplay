import { createClient } from '@supabase/supabase-js';

const OLD_URL = process.env.VITE_SUPABASE_URL!;
const OLD_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const NEW_URL = "https://mcsimyuipawmntiazhug.supabase.co";
const NEW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jc2lteXVpcGF3bW50aWF6aHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDcyMzYsImV4cCI6MjEwMjM4MzIzNn0.IP78sav7QgP5obwaLS0uVAZ6TXt_cWDR1-b98__Sqh8";

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
    console.log(`Found ${customers.length} customers. Processing in chunks...`);
    const chunks = [];
    for (let i = 0; i < customers.length; i += 20) {
      chunks.push(customers.slice(i, i + 20));
    }
    for (const chunk of chunks) {
      const inserts = chunk.map(c => ({
        game: 'WePlay',
        user_id: c.weplay_id,
        name: c.weplay_name || 'Unknown',
        created_at: c.created_at,
        last_active: c.last_active
      }));
      const { error: insErr } = await newClient.from('users').upsert(inserts, { onConflict: 'user_id, game' });
      if (insErr) console.error(`Error inserting customer chunk:`, insErr.message);
      else console.log(`Migrated chunk of ${inserts.length} customers.`);
    }
  }

  // 2. Orders -> Orders
  console.log("Migrating orders...");
  const { data: orders, error: oErr } = await oldClient.from('orders').select('*');
  if (oErr) {
    console.error("Error fetching orders:", oErr);
  } else if (orders) {
    console.log(`Found ${orders.length} orders. Processing in chunks...`);
    const chunks = [];
    for (let i = 0; i < orders.length; i += 20) {
      chunks.push(orders.slice(i, i + 20));
    }
    for (const chunk of chunks) {
      const inserts = chunk.map(o => ({
        order_id: o.order_code,
        game: 'WePlay',
        user_id: o.weplay_id,
        plan: o.product_name,
        amount: o.price,
        status: o.status || 'pending',
        transaction_id: o.transaction_id,
        created_at: o.created_at
      }));
      const { error: insErr } = await newClient.from('orders').upsert(inserts, { onConflict: 'order_id' });
      if (insErr) console.error(`Error inserting order chunk:`, insErr.message);
      else console.log(`Migrated chunk of ${inserts.length} orders.`);
    }
  }

  console.log("Migration complete.");
}

migrate();
