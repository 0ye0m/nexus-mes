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
  Factory,
  ChevronLeft,
  X
} from 'lucide-react';
import { useEffect } from 'react';

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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout, hasRole } = useAuthStore();
  const { activeModule, setActiveModule } = useAppStore();

  const filteredNavItems = navItems.filter(item => hasRole(item.roles));

  // Close drawer when clicking outside on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const sidebarContent = (
    <aside className="h-full flex flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo + Close button */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Factory size={20} className="text-primary-foreground" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-semibold text-sm">EV Manufacturing</h1>
            <p className="text-sidebar-foreground/60 text-xs">Management System</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as any);
                onClose(); // close drawer on mobile after click
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeModule === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }
              `}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User & Sign out */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-medium">
            {user?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0 hidden md:block">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg text-sm transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </aside>
  );

  // Mobile drawer vs desktop persistent sidebar
  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:block fixed left-0 top-0 h-screen w-64 z-30">
        {sidebarContent}
      </div>

      {/* Mobile: drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed top-0 left-0 bottom-0 w-64 z-50 transform transition-transform duration-300 md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
}