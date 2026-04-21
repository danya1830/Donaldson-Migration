import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhxuozbwrvdufsiaygmi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHVvemJ3cnZkdWZzaWF5Z21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjcxNTAsImV4cCI6MjA2MjA0MzE1MH0.WG8F1P1W1V8YLI1W1V8YLI1W1V8YLI1W1V8YLI1W1V8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTable() {
  const { error } = await supabase.rpc('create_scans_table', {});
  
  if (error) {
    console.log('Table may already exist or RPC not available, trying direct SQL...');
  }
  
  const { data, error: sqlError } = await supabase.from('scans').select('id').limit(1);
  
  console.log('Checking if scans table exists...', { data, error: sqlError });
  
  if (sqlError?.code === '42P01') {
    console.log('Table does not exist. Please create it manually in Supabase dashboard.');
    console.log('SQL: CREATE TABLE scans (id SERIAL PRIMARY KEY, location TEXT NOT NULL, partnumber TEXT NOT NULL, qty INTEGER NOT NULL, condition TEXT NOT NULL CHECK(condition IN (\'good\', \'damage\')), pallet_number TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());');
  }
}

setupTable();