'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loggedIn = localStorage.getItem('username');
    if (!loggedIn && pathname !== '/login') {
      router.push('/login');
    } else if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/login');
  };

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!isLoggedIn) {
    return null;
  }

  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-600">Scanner App</h1>
              <div className="flex space-x-4">
                <a
                  href="/scan"
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    pathname === '/scan' || pathname === '/'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Scan
                </a>
                <a
                  href="/reports"
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    pathname === '/reports'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Reports
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {username} <span className="text-xs font-bold text-gray-400">({role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}