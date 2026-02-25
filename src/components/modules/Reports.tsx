'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Download, FileText, Package, CheckCircle, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { schedules, materials, inspections, costs, fetchSchedules, fetchMaterials, fetchInspections, fetchCosts, loading } = useAppStore();
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => { fetchSchedules(); fetchMaterials(); fetchInspections(); fetchCosts(); }, [fetchSchedules, fetchMaterials, fetchInspections, fetchCosts]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v);

  const downloadCSV = (type: string) => {
    let headers: string[] = [], rows: any[][] = [], filename = '';

    switch (type) {
      case 'production':
        headers = ['ID', 'Model', 'Type', 'Target', 'Completed', 'Progress %', 'Status', 'Start Date', 'End Date'];
        rows = schedules.map(s => [s.id.slice(0, 8), s.vehicleModel, s.scheduleType, s.targetQuantity, s.completedQuantity, Math.round((s.completedQuantity / s.targetQuantity) * 100) || 0, s.status, new Date(s.startDate).toLocaleDateString(), s.endDate ? new Date(s.endDate).toLocaleDateString() : '']);
        filename = 'production_report';
        break;
      case 'inventory':
        headers = ['SKU', 'Name', 'Category', 'Quantity', 'Unit', 'Min Stock', 'Status', 'Unit Cost', 'Supplier'];
        rows = materials.map(m => [m.sku, m.name, m.category, m.quantity, m.unit, m.minStock, m.quantity < m.minStock ? 'Low Stock' : 'In Stock', m.unitCost, m.supplier]);
        filename = 'inventory_report';
        break;
      case 'quality':
        headers = ['ID', 'Vehicle ID', 'Model', 'Type', 'Result', 'Inspector', 'Date', 'Approved', 'Defect'];
        rows = inspections.map(i => [i.id.slice(0, 8), i.vehicleId, i.vehicleModel, i.inspectionType, i.result, i.inspector, new Date(i.inspectionDate).toLocaleDateString(), i.approved ? 'Yes' : 'No', i.defectDescription || '']);
        filename = 'quality_report';
        break;
      case 'cost':
        headers = ['ID', 'Vehicle ID', 'Model', 'Material', 'Labor', 'Overhead', 'Total', 'Date'];
        rows = costs.map(c => [c.id.slice(0, 8), c.vehicleId, c.vehicleModel, c.materialCost, c.laborCost, c.overheadCost, c.totalCost, new Date(c.calculatedAt).toLocaleDateString()]);
        filename = 'cost_report';
        break;
    }

    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded`);
  };

  const getReportStats = (type: string) => {
    switch (type) {
      case 'production': return { total: schedules.length, completed: schedules.filter(s => s.status === 'completed').length, inProgress: schedules.filter(s => s.status === 'in_progress').length };
      case 'inventory': return { total: materials.length, lowStock: materials.filter(m => m.quantity < m.minStock).length, totalValue: materials.reduce((s, m) => s + m.quantity * m.unitCost, 0) };
      case 'quality': return { total: inspections.length, passed: inspections.filter(i => i.result === 'pass').length, failed: inspections.filter(i => i.result === 'fail').length };
      case 'cost': return { total: costs.length, totalCost: costs.reduce((s, c) => s + c.totalCost, 0), avgCost: costs.length > 0 ? costs.reduce((s, c) => s + c.totalCost, 0) / costs.length : 0 };
      default: return { total: 0 };
    }
  };

  const isLoading = loading.schedules || loading.materials || loading.inspections || loading.costs;

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  const reports = [
    { id: 'production', title: 'Production Report', desc: 'Vehicle production data including schedules and completion rates', icon: <FileText size={24} />, stats: getReportStats('production') },
    { id: 'inventory', title: 'Inventory Report', desc: 'Current stock levels, low stock alerts, and supplier info', icon: <Package size={24} />, stats: getReportStats('inventory') },
    { id: 'quality', title: 'Quality Report', desc: 'Inspection results, pass/fail rates, and defect analysis', icon: <CheckCircle size={24} />, stats: getReportStats('quality') },
    { id: 'cost', title: 'Cost Report', desc: 'Production costs breakdown by vehicle model', icon: <DollarSign size={24} />, stats: getReportStats('cost') },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Reports</h1><p className="text-sm mt-1" style={{ color: '#6B7280' }}>Generate and export manufacturing reports</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-lg p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center" style={{ color: '#2563EB' }}>{report.icon}</div>
              <div><h3 className="font-semibold" style={{ color: '#111827' }}>{report.title}</h3><p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>{report.desc}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-y" style={{ borderColor: '#E5E7EB' }}>
              {report.id === 'production' && (<>
                <div className="text-center"><p className="text-lg font-semibold" style={{ color: '#111827' }}>{(report.stats as any).total}</p><p className="text-xs" style={{ color: '#6B7280' }}>Total</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-green-600">{(report.stats as any).completed}</p><p className="text-xs" style={{ color: '#6B7280' }}>Completed</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-blue-600">{(report.stats as any).inProgress}</p><p className="text-xs" style={{ color: '#6B7280' }}>In Progress</p></div>
              </>)}
              {report.id === 'inventory' && (<>
                <div className="text-center"><p className="text-lg font-semibold" style={{ color: '#111827' }}>{(report.stats as any).total}</p><p className="text-xs" style={{ color: '#6B7280' }}>Items</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-orange-600">{(report.stats as any).lowStock}</p><p className="text-xs" style={{ color: '#6B7280' }}>Low Stock</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-blue-600">{formatCurrency((report.stats as any).totalValue)}</p><p className="text-xs" style={{ color: '#6B7280' }}>Value</p></div>
              </>)}
              {report.id === 'quality' && (<>
                <div className="text-center"><p className="text-lg font-semibold" style={{ color: '#111827' }}>{(report.stats as any).total}</p><p className="text-xs" style={{ color: '#6B7280' }}>Total</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-green-600">{(report.stats as any).passed}</p><p className="text-xs" style={{ color: '#6B7280' }}>Passed</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-red-600">{(report.stats as any).failed}</p><p className="text-xs" style={{ color: '#6B7280' }}>Failed</p></div>
              </>)}
              {report.id === 'cost' && (<>
                <div className="text-center"><p className="text-lg font-semibold" style={{ color: '#111827' }}>{(report.stats as any).total}</p><p className="text-xs" style={{ color: '#6B7280' }}>Records</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-blue-600">{formatCurrency((report.stats as any).totalCost)}</p><p className="text-xs" style={{ color: '#6B7280' }}>Total</p></div>
                <div className="text-center"><p className="text-lg font-semibold text-purple-600">{formatCurrency((report.stats as any).avgCost)}</p><p className="text-xs" style={{ color: '#6B7280' }}>Avg</p></div>
              </>)}
            </div>
            <button onClick={() => downloadCSV(report.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}><Download size={18} />Export as CSV</button>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-6" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h2 className="font-semibold mb-4" style={{ color: '#111827' }}>Quick Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Total Vehicles in Production</p><p className="text-2xl font-semibold mt-1" style={{ color: '#111827' }}>{schedules.reduce((s, s2) => s + s2.targetQuantity, 0).toLocaleString()}</p></div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Completed Vehicles</p><p className="text-2xl font-semibold mt-1 text-green-600">{schedules.reduce((s, s2) => s + s2.completedQuantity, 0).toLocaleString()}</p></div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Overall Quality Rate</p><p className="text-2xl font-semibold mt-1 text-blue-600">{inspections.length > 0 ? ((inspections.filter(i => i.result === 'pass').length / inspections.length) * 100).toFixed(1) : 0}%</p></div>
          <div><p className="text-sm" style={{ color: '#6B7280' }}>Inventory Value</p><p className="text-2xl font-semibold mt-1 text-purple-600">{formatCurrency(materials.reduce((s, m) => s + m.quantity * m.unitCost, 0))}</p></div>
        </div>
      </div>
    </div>
  );
}
