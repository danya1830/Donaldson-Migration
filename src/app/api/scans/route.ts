import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { ScanInput } from '@/types/scan';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
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
      console.error('Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}