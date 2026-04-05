'use client';

import { useAppStore } from '@/store/appStore';
import { LayoutDashboard, Package, Calendar, CheckSquare, FileText } from 'lucide-react';

export default function BottomNav() {
  const { activeModule, setActiveModule } = useAppStore();

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stock', icon: Package },
    { id: 'production', label: 'Prod', icon: Calendar },
    { id: 'quality', label: 'Quality', icon: CheckSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-border md:hidden z-40">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as any)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}