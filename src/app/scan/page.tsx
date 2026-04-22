'use client';

import { useState, useEffect } from 'react';
import { Scan } from '@/types/scan';
import AuthWrapper from '@/components/AuthWrapper';

export default function ScanPage() {
  const [location, setLocation] = useState('');
  const [partnumber, setPartnumber] = useState('');
  const [qty, setQty] = useState('');
  const [condition, setCondition] = useState<'good' | 'damage'>('good');
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
        setCondition('good');
        fetchScans();
      } else {
        setMessage('Failed to save scan');
      }
    } catch {
      setMessage('Error saving scan');
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Scan pallet number..."
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Condition</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCondition('good')}
                  className={`flex-1 rounded-xl py-3 font-medium transition-all ${
                    condition === 'good'
                      ? 'bg-green-500 text-white shadow-lg'
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
                      ? 'bg-red-500 text-white shadow-lg'
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
                  <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-400">
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Part No</th>
                    <th className="pb-3">Qty</th>
                    <th className="pb-3">Condition</th>
                    <th className="pb-3">Pallet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium">{scan.location}</td>
                      <td className="py-3">{scan.partnumber}</td>
                      <td className="py-3">{scan.qty}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            scan.condition === 'good'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {scan.condition}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{scan.pallet_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total Scans</p>
          <p className="text-2xl font-bold text-gray-800">{scans.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Good Condition</p>
          <p className="text-2xl font-bold text-green-600">
            {scans.filter((s) => s.condition === 'good').length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Damage</p>
          <p className="text-2xl font-bold text-red-600">
            {scans.filter((s) => s.condition === 'damage').length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total QTY</p>
          <p className="text-2xl font-bold text-blue-600">
            {scans.reduce((acc, s) => acc + s.qty, 0)}
          </p>
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
}