export interface Scan {
  id: number;
  location: string;
  partnumber: string;
  qty: number;
  condition: 'good' | 'damage';
  pallet_number: string;
  created_at: string;
}

export interface ScanInput {
  location: string;
  partnumber: string;
  qty: number;
  condition: 'good' | 'damage';
  pallet_number: string;
}