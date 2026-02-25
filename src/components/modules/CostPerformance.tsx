'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, X, DollarSign, TrendingUp, Activity, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const vehicleModels = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'];

export default function CostPerformance() {
  const { costs, metrics, fetchCosts, fetchMetrics, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', vehicleModel: 'EV-Compact', materialCost: 0, laborCost: 0, overheadCost: 0 });

  useEffect(() => { fetchCosts(); fetchMetrics(); }, [fetchCosts, fetchMetrics]);

  const totalCost = formData.materialCost + formData.laborCost + formData.overheadCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    if (!formData.vehicleId || totalCost === 0) { toast.error('Please fill required fields'); setIsSubmitting(false); return; }
    try {
      const res = await fetch('/api/costs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { toast.success('Cost recorded'); fetchCosts(); setIsModalOpen(false); setFormData({ vehicleId: '', vehicleModel: 'EV-Compact', materialCost: 0, laborCost: 0, overheadCost: 0 }); }
      else toast.error(data.message);
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const stats = costs.length > 0 ? { avgCost: costs.reduce((s, c) => s + c.totalCost, 0) / costs.length, totalMaterial: costs.reduce((s, c) => s + c.materialCost, 0), totalLabor: costs.reduce((s, c) => s + c.laborCost, 0), totalOverhead: costs.reduce((s, c) => s + c.overheadCost, 0) } : { avgCost: 0, totalMaterial: 0, totalLabor: 0, totalOverhead: 0 };

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v);

  const performanceTrend = metrics.slice(-7).map(m => ({ date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), efficiency: m.efficiency, productivity: m.productivity, qualityRate: m.qualityRate }));

  const latestMetric = metrics[metrics.length - 1];

  if (loading.costs) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Cost & Performance</h1><p className="text-sm mt-1" style={{ color: '#6B7280' }}>Track production costs and performance metrics</p></div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}><Plus size={18} />Record Cost</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Avg Cost/Vehicle', value: formatCurrency(stats.avgCost), icon: <DollarSign size={20} className="text-blue-600" />, bg: 'bg-blue-100' },
          { label: 'Total Material', value: formatCurrency(stats.totalMaterial), icon: <Target size={20} className="text-green-600" />, bg: 'bg-green-100' },
          { label: 'Total Labor', value: formatCurrency(stats.totalLabor), icon: <Activity size={20} className="text-purple-600" />, bg: 'bg-purple-100' },
          { label: 'Total Overhead', value: formatCurrency(stats.totalOverhead), icon: <TrendingUp size={20} className="text-orange-600" />, bg: 'bg-orange-100' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4 flex items-center gap-3" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>{s.icon}</div>
            <div><p className="text-sm" style={{ color: '#6B7280' }}>{s.label}</p><p className="text-xl font-semibold" style={{ color: '#111827' }}>{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-5" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Performance Trend</h3>
          <div className="h-64">{performanceTrend.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><LineChart data={performanceTrend}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="date" stroke="#6B7280" fontSize={12} /><YAxis stroke="#6B7280" fontSize={12} domain={[80, 100]} /><Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }} /><Line type="monotone" dataKey="efficiency" stroke="#2563EB" strokeWidth={2} name="Efficiency %" dot={{ r: 3 }} /><Line type="monotone" dataKey="productivity" stroke="#16A34A" strokeWidth={2} name="Productivity %" dot={{ r: 3 }} /><Line type="monotone" dataKey="qualityRate" stroke="#D97706" strokeWidth={2} name="Quality %" dot={{ r: 3 }} /></LineChart></ResponsiveContainer>) : (<div className="h-full flex items-center justify-center text-gray-400">No data</div>)}</div>
        </div>

        <div className="rounded-lg p-5" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#111827' }}>Current Performance Metrics</h3>
          {latestMetric ? (
            <div className="space-y-4">
              {[
                { label: 'Efficiency', value: latestMetric.efficiency, color: 'bg-blue-500' },
                { label: 'Productivity', value: latestMetric.productivity, color: 'bg-green-500' },
                { label: 'Quality Rate', value: latestMetric.qualityRate, color: 'bg-orange-500' },
              ].map((m, i) => (
                <div key={i}><div className="flex justify-between text-sm mb-1"><span style={{ color: '#6B7280' }}>{m.label}</span><span className="font-medium" style={{ color: '#111827' }}>{m.value}%</span></div><div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.value}%` }} /></div></div>
              ))}
              <div className="pt-2 border-t" style={{ borderColor: '#E5E7EB' }}><div className="grid grid-cols-2 gap-4 text-sm"><div><span style={{ color: '#6B7280' }}>Vehicles Produced</span><p className="font-semibold" style={{ color: '#111827' }}>{latestMetric.vehiclesProduced}</p></div><div><span style={{ color: '#6B7280' }}>Defects</span><p className="font-semibold" style={{ color: '#111827' }}>{latestMetric.defectCount}</p></div></div></div>
            </div>
          ) : (<div className="h-48 flex items-center justify-center text-gray-400">No metrics available</div>)}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}><h3 className="text-sm font-semibold" style={{ color: '#111827' }}>Recent Cost Records</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Vehicle ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Model</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Material</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Labor</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Overhead</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Total</th>
            </tr></thead>
            <tbody>
              {costs.slice(0, 10).map((cost) => (
                <tr key={cost.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#E5E7EB' }}>
                  <td className="px-4 py-3"><span className="text-sm font-mono" style={{ color: '#111827' }}>{cost.vehicleId}</span></td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: '#111827' }}>{cost.vehicleModel}</span></td>
                  <td className="px-4 py-3 text-right"><span className="text-sm" style={{ color: '#6B7280' }}>{formatCurrency(cost.materialCost)}</span></td>
                  <td className="px-4 py-3 text-right"><span className="text-sm" style={{ color: '#6B7280' }}>{formatCurrency(cost.laborCost)}</span></td>
                  <td className="px-4 py-3 text-right"><span className="text-sm" style={{ color: '#6B7280' }}>{formatCurrency(cost.overheadCost)}</span></td>
                  <td className="px-4 py-3 text-right"><span className="text-sm font-semibold" style={{ color: '#111827' }}>{formatCurrency(cost.totalCost)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {costs.length === 0 && <div className="py-12 text-center"><p className="text-sm" style={{ color: '#6B7280' }}>No cost records</p></div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>Record Production Cost</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} style={{ color: '#6B7280' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Model</label><select value={formData.vehicleModel} onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{vehicleModels.map((m) => (<option key={m} value={m}>{m}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Vehicle ID *</label><input type="text" value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Material Cost ($)</label><input type="number" value={formData.materialCost || ''} onChange={(e) => setFormData({ ...formData, materialCost: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Labor Cost ($)</label><input type="number" value={formData.laborCost || ''} onChange={(e) => setFormData({ ...formData, laborCost: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Overhead Cost ($)</label><input type="number" value={formData.overheadCost || ''} onChange={(e) => setFormData({ ...formData, overheadCost: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Total</label><div className="h-10 px-3 rounded-lg bg-gray-50 flex items-center text-sm font-semibold" style={{ color: '#111827' }}>{formatCurrency(totalCost)}</div></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: '#2563EB' }}>{isSubmitting ? 'Saving...' : 'Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
