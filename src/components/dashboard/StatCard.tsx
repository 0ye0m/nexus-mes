'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export default function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <div 
      className="rounded-lg p-5"
      style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{title}</p>
          <p className="text-2xl font-semibold mt-1" style={{ color: '#111827' }}>{value}</p>
          {subtitle && (
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        <div 
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#EFF6FF' }}
        >
          <div style={{ color: '#2563EB' }}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
