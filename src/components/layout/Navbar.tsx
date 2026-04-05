'use client';

import { useAuthStore } from '@/store/authStore';
import { Menu, Bell, Settings, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-20">
      <div className="flex items-center h-full px-4">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Search bar (desktop) */}
        <div className="hidden md:flex items-center ml-45 lg:ml-55 xl:ml-65">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-80 lg:w-96 h-9 pl-9 pr-4 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          <button className="p-2 rounded-lg hover:bg-muted hidden sm:block">
            <Settings size={18} />
          </button>

          <div className="flex items-center gap-2 ml-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile search */}
      {searchOpen && (
        <div className="md:hidden p-3 border-t border-border bg-card">
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 px-4 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            autoFocus
          />
        </div>
      )}
    </header>
  );
}