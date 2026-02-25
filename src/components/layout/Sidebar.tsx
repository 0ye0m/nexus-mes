'use client';

import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  Battery,
  CheckSquare,
  DollarSign,
  FileText,
  LogOut,
  Factory
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'production_manager', 'quality_inspector'] },
  { id: 'users', label: 'User Management', icon: <Users size={20} />, roles: ['admin'] },
  { id: 'inventory', label: 'Inventory', icon: <Package size={20} />, roles: ['admin', 'production_manager'] },
  { id: 'production', label: 'Production Planning', icon: <Calendar size={20} />, roles: ['admin', 'production_manager'] },
  { id: 'battery', label: 'Battery & Powertrain', icon: <Battery size={20} />, roles: ['admin', 'production_manager'] },
  { id: 'quality', label: 'Quality Control', icon: <CheckSquare size={20} />, roles: ['admin', 'quality_inspector'] },
  { id: 'costs', label: 'Cost & Performance', icon: <DollarSign size={20} />, roles: ['admin', 'production_manager'] },
  { id: 'reports', label: 'Reports', icon: <FileText size={20} />, roles: ['admin', 'production_manager', 'quality_inspector'] },
];

export default function Sidebar() {
  const { user, logout, hasRole } = useAuthStore();
  const { activeModule, setActiveModule } = useAppStore();

  const filteredNavItems = navItems.filter(item => hasRole(item.roles));

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-64 flex flex-col"
      style={{ backgroundColor: '#1E293B' }}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Factory size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-semibold text-sm">EV Manufacturing</h1>
          <p className="text-slate-400 text-xs">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeModule === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-medium">
            {user?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
