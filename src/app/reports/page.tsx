'use client';

import { useState, useEffect } from 'react';
import { Scan } from '@/types/scan';
import AuthWrapper from '@/components/AuthWrapper';

export default function ReportsPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filteredScans, setFilteredScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchScans();
  }, []);

  useEffect(() => {
    let result = [...scans];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.location.toLowerCase().includes(searchLower) ||
          s.partnumber.toLowerCase().includes(searchLower) ||
          s.pallet_number.toLowerCase().includes(searchLower)
      );
    }

    if (conditionFilter !== 'all') {
      result = result.filter((s) => s.condition === conditionFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0);
      } else if (dateFilter === 'week') {
        filterDate.setDate(filterDate.getDate() - 7);
      } else if (dateFilter === 'month') {
        filterDate.setMonth(filterDate.getMonth() - 1);
      }
      result = result.filter((s) => new Date(s.created_at) >= filterDate);
    }

    setFilteredScans(result);
  }, [scans, search, conditionFilter, dateFilter]);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scans');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setScans(Array.isArray(data) ? data : []);
      setFilteredScans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching scans:', error);
      setScans([]);
      setFilteredScans([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Location', 'Part Number', 'QTY', 'Condition', 'Pallet Number', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredScans.map((s) =>
        [
          s.id,
          `"${s.location}"`,
          `"${s.partnumber}"`,
          s.qty,
          s.condition,
          `"${s.pallet_number}"`,
          `"${s.created_at}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `scan_report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalQty = filteredScans.reduce((acc, s) => acc + s.qty, 0);
  const goodCount = filteredScans.filter((s) => s.condition === 'good').length;
  const damageCount = filteredScans.filter((s) => s.condition === 'damage').length;

  return (
    <AuthWrapper>
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">Total Scans</p>
          <p className="text-3xl font-bold">{filteredScans.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">Good Condition</p>
          <p className="text-3xl font-bold">{goodCount}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">Damage</p>
          <p className="text-3xl font-bold">{damageCount}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
          <p className="text-sm opacity-80">Total QTY</p>
          <p className="text-3xl font-bold">{totalQty}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-gray-800">Scan Reports</h2>
          
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Condition</option>
              <option value="good">Good</option>
              <option value="damage">Damage</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-400">
            No scans found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Part Number</th>
                  <th className="px-4 py-3">QTY</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Pallet Number</th>
                  <th className="px-4 py-3">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">#{scan.id}</td>
                    <td className="px-4 py-3 font-medium">{scan.location}</td>
                    <td className="px-4 py-3">{scan.partnumber}</td>
                    <td className="px-4 py-3 font-semibold">{scan.qty}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          scan.condition === 'good'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {scan.condition.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{scan.pallet_number}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(scan.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-400">
          Showing {filteredScans.length} of {scans.length} records
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
}