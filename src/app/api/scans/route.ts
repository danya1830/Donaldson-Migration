import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { ScanInput } from '@/types/scan';

export async function GET() {
  const scans = db.prepare('SELECT * FROM scans ORDER BY created_at DESC').all();
  return NextResponse.json(scans);
}

export async function POST(request: Request) {
  const body: ScanInput = await request.json();
  
  const { location, partnumber, qty, condition, pallet_number } = body;
  
  if (!location || !partnumber || !qty || !condition || !pallet_number) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const stmt = db.prepare(`
    INSERT INTO scans (location, partnumber, qty, condition, pallet_number)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(location, partnumber, qty, condition, pallet_number);
  
  return NextResponse.json({ id: result.lastInsertRowid, ...body }, { status: 201 });
}