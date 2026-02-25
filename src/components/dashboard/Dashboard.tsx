'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Car, Clock, AlertTriangle, Percent, DollarSign, Activity } from 'lucide-react';
import StatCard from './StatCard';
import { ProductionTrendChart, VehicleModelChart, ProductionStatusChart, CostBreakdownChart } from './Charts';

export default function Dashboard() {
  const { dashboard, loading, fetchDashboard } = useAppStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading.dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summary = dashboard?.summary || {
    totalVehiclesProduced: 0,
    pendingOrders: 0,
    lowStockAlerts: 0,
    defectRate: 0,
    totalProductionCost: 0,
    avgCostPerVehicle: 0,
    activeProductionLines: 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Overview of your manufacturing operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles Produced"
          value={summary.totalVehiclesProduced.toLocaleString()}
          icon={<Car size={22} />}
          subtitle="This month"
        />
        <StatCard
          title="Pending Orders"
          value={summary.pendingOrders}
          icon={<Clock size={22} />}
          subtitle="In queue"
        />
        <StatCard
          title="Low Stock Alerts"
          value={summary.lowStockAlerts}
          icon={<AlertTriangle size={22} />}
          subtitle="Items below minimum"
        />
        <StatCard
          title="Defect Rate"
          value={`${summary.defectRate}%`}
          icon={<Percent size={22} />}
          subtitle="Quality metric"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Production Cost"
          value={formatCurrency(summary.totalProductionCost)}
          icon={<DollarSign size={22} />}
          subtitle="Monthly total"
        />
        <StatCard
          title="Average Cost per Vehicle"
          value={formatCurrency(summary.avgCostPerVehicle)}
          icon={<Activity size={22} />}
        />
        <StatCard
          title="Active Production Lines"
          value={`${summary.activeProductionLines} of 6`}
          icon={<Car size={22} />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionTrendChart data={dashboard?.productionTrend || []} />
        <VehicleModelChart data={dashboard?.modelDistribution || []} />
      </div>

      {/* Charts Row 2 & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductionStatusChart data={dashboard?.statusDistribution || []} />
        <CostBreakdownChart data={dashboard?.costBreakdown || { material: 0, labor: 0, overhead: 0 }} />
        
        {/* Recent Activities */}
        <div 
          className="rounded-lg p-5"
          style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Recent Activities</h3>
          <div className="space-y-3">
            {(dashboard?.activities || []).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#111827' }}>{activity.action}</p>
                  <p className="text-xs truncate" style={{ color: '#6B7280' }}>{activity.details}</p>
                  <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {(!dashboard?.activities || dashboard.activities.length === 0) && (
              <p className="text-sm text-center" style={{ color: '#6B7280' }}>No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
