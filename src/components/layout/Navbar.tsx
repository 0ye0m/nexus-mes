'use client';

import { useAuthStore } from '@/store/authStore';
import { Bell, Search, Settings } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header 
      className="fixed top-0 left-64 right-0 h-16 flex items-center justify-between px-6 z-10"
      style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB' }}
    >
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-9 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-2"></div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: '#111827' }}>{user?.name}</p>
            <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{user?.role.replace('_', ' ')}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
            {user?.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
}
