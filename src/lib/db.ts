import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Scan {
  id: number;
  location: string;
  partnumber: string;
  qty: number;
  condition: 'good' | 'damage';
  pallet_number: string;
  created_at: string;
}