import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bhxuozbwrvdufsiaygmi.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeHVvemJ3cnZkdWZzaWF5Z21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjcxNTAsImV4cCI6MjA2MjA0MzE1MH0.WG8F1P1W1V8YLI1W1V8YLI1W1V8YLI1W1V8YLI1W1V8';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Scan {
  id: number;
  location: string;
  partnumber: string;
  qty: number;
  condition: 'good' | 'damage';
  pallet_number: string;
  user_name: string;
  created_at: string;
}