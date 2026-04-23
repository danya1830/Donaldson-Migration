'use client';

import { useState, useEffect } from 'react';
import { Scan } from '@/types/scan';
import AuthWrapper from '@/components/AuthWrapper';

export default function ScanPage() {
  const [location, setLocation] = useState('');
  const [partnumber, setPartnumber] = useState('');
  const [qty, setQty] = useState('');
  const [condition, setCondition] = useState<'good' | 'damage' | ''>('');
  const [palletNumber, setPalletNumber] = useState('');
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/scans');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setScans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching scans:', error);
      setScans([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!condition) {
      setMessage('Please select condition');
      return;
    }
    
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          partnumber,
          qty: parseInt(qty),
          condition,
          pallet_number: palletNumber,
          user_name: localStorage.getItem('username') || 'unknown',
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setMessage('Scan saved successfully!');
        setLocation('');
        setPartnumber('');
        setQty('');
        setPalletNumber('');
        setCondition('');
        fetchScans();
      } else {
        const errorData = await res.json();
        setMessage('Failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      setMessage('Error: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  const recentScans = scans.slice(0, 10);

  return (
    <AuthWrapper>
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-gray-800">New Scan</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location <span className="text-gray-400">(Scan)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Scan location..."
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Part Number <span className="text-gray-400">(Scan)</span>
                </label>
                <input
                  type="text"
                  value={partnumber}
                  onChange={(e) => setPartnumber(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Scan part number..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  QTY <span className="text-gray-400">(Manual)</span>
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter quantity..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Pallet Number <span className="text-gray-400">(Scan)</span>
                </label>
                <input
                  type="text"
                  value={palletNumber}
                  onChange={(e) => setPalletNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Scan pallet number..."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Condition <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCondition('good')}
                  className={`flex-1 rounded-xl py-3 font-medium transition-all ${
                    condition === 'good'
                      ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-300'
                      : condition === ''
                      ? 'bg-gray-50 text-gray-400 ring-2 ring-gray-200 border-2 border-dashed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ✓ Good
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('damage')}
                  className={`flex-1 rounded-xl py-3 font-medium transition-all ${
                    condition === 'damage'
                      ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-300'
                      : condition === ''
                      ? 'bg-gray-50 text-gray-400 ring-2 ring-gray-200 border-2 border-dashed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ✗ Damage
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-xl p-4 text-center font-medium ${
                  success
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:bg-gray-300"
            >
              {loading ? 'Saving...' : 'Save Scan'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Recent Scans</h2>
            <a
              href="/reports"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All →
            </a>
          </div>

          {recentScans.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              No scans yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 text-left text-sm font-bold uppercase text-gray-700">
                    <th className="pb-4">Location</th>
                    <th className="pb-4">Part No</th>
                    <th className="pb-4">Qty</th>
                    <th className="pb-4">Condition</th>
                    <th className="pb-4">Pallet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-blue-50 border-b border-gray-200">
                      <td className="py-4 font-semibold text-gray-900">{scan.location}</td>
                      <td className="py-4 font-medium text-gray-800">{scan.partnumber}</td>
                      <td className="py-4 font-bold text-gray-900">{scan.qty}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-bold ${
                            scan.condition === 'good'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {scan.condition}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-gray-700">{scan.pallet_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-blue-600 p-5 shadow-lg">
          <p className="text-sm font-medium text-blue-100">Total Scans</p>
          <p className="text-3xl font-bold text-white">{scans.length}</p>
        </div>
        <div className="rounded-xl bg-green-600 p-5 shadow-lg">
          <p className="text-sm font-medium text-green-100">Good Condition</p>
          <p className="text-3xl font-bold text-white">
            {scans.filter((s) => s.condition === 'good').length}
          </p>
        </div>
        <div className="rounded-xl bg-red-600 p-5 shadow-lg">
          <p className="text-sm font-medium text-red-100">Damage</p>
          <p className="text-3xl font-bold text-white">
            {scans.filter((s) => s.condition === 'damage').length}
          </p>
        </div>
        <div className="rounded-xl bg-indigo-600 p-5 shadow-lg">
          <p className="text-sm font-medium text-indigo-100">Total QTY</p>
          <p className="text-3xl font-bold text-white">
            {scans.reduce((acc, s) => acc + s.qty, 0)}
          </p>
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
}