import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { ScanInput } from '@/types/scan';

export async function GET() {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const body: ScanInput = await request.json();
  
  const { location, partnumber, qty, condition, pallet_number } = body;
  
  if (!location || !partnumber || !qty || !condition || !pallet_number) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from('scans')
    .insert([{ location, partnumber, qty, condition, pallet_number }])
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data, { status: 201 });
}