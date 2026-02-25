'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/components/auth/Login';
import Dashboard from '@/components/dashboard/Dashboard';
import UserManagement from '@/components/modules/UserManagement';
import InventoryManagement from '@/components/modules/InventoryManagement';
import ProductionPlanning from '@/components/modules/ProductionPlanning';
import BatteryPowertrain from '@/components/modules/BatteryPowertrain';
import QualityControl from '@/components/modules/QualityControl';
import CostPerformance from '@/components/modules/CostPerformance';
import Reports from '@/components/modules/Reports';
import { Toaster } from 'sonner';

export default function Home() {
  const { isAuthenticated, hasRole } = useAuthStore();
  const { activeModule, fetchDashboard } = useAppStore();

  // Fetch dashboard data on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboard();
    }
  }, [isAuthenticated, fetchDashboard]);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <Toaster position="top-right" />
      </>
    );
  }

  // Render active module
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        if (hasRole(['admin'])) {
          return <UserManagement />;
        }
        return <AccessDenied />;
      case 'inventory':
        if (hasRole(['admin', 'production_manager'])) {
          return <InventoryManagement />;
        }
        return <AccessDenied />;
      case 'production':
        if (hasRole(['admin', 'production_manager'])) {
          return <ProductionPlanning />;
        }
        return <AccessDenied />;
      case 'battery':
        if (hasRole(['admin', 'production_manager'])) {
          return <BatteryPowertrain />;
        }
        return <AccessDenied />;
      case 'quality':
        if (hasRole(['admin', 'quality_inspector'])) {
          return <QualityControl />;
        }
        return <AccessDenied />;
      case 'costs':
        if (hasRole(['admin', 'production_manager'])) {
          return <CostPerformance />;
        }
        return <AccessDenied />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <MainLayout>
        {renderModule()}
      </MainLayout>
      <Toaster position="top-right" />
    </>
  );
}

// Access Denied Component
function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>Access Denied</h2>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>You do not have permission to access this module.</p>
      </div>
    </div>
  );
}
