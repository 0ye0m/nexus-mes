'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, X, DollarSign, TrendingUp, Activity, Target, Loader2, BarChart3, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

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

  const stats = costs.length > 0 ? {
    avgCost: costs.reduce((s, c) => s + c.totalCost, 0) / costs.length,
    totalMaterial: costs.reduce((s, c) => s + c.materialCost, 0),
    totalLabor: costs.reduce((s, c) => s + c.laborCost, 0),
    totalOverhead: costs.reduce((s, c) => s + c.overheadCost, 0),
  } : { avgCost: 0, totalMaterial: 0, totalLabor: 0, totalOverhead: 0 };

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v);

  const performanceTrend = metrics.slice(-7).map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    efficiency: m.efficiency, productivity: m.productivity, qualityRate: m.qualityRate,
  }));

  const latestMetric = metrics[metrics.length - 1];

  // Cost breakdown pie data
  const costBreakdownData = [
    { name: 'Material', value: stats.totalMaterial, color: '#2563EB' },
    { name: 'Labor', value: stats.totalLabor, color: '#16A34A' },
    { name: 'Overhead', value: stats.totalOverhead, color: '#D97706' },
  ].filter(d => d.value > 0);

  if (loading.costs) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cost & Performance</h1>
          <p className="text-muted-foreground mt-1">Track production costs and performance metrics</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-sm"><Plus size={18} />Record Cost</button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Avg Cost/Vehicle</p><DollarSign size={18} className="text-primary" /></div><p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(stats.avgCost)}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Material</p><Target size={18} className="text-green-500" /></div><p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(stats.totalMaterial)}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Labor</p><Activity size={18} className="text-purple-500" /></div><p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{formatCurrency(stats.totalLabor)}</p></div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Total Overhead</p><TrendingUp size={18} className="text-orange-500" /></div><p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{formatCurrency(stats.totalOverhead)}</p></div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><BarChart3 size={18} /> Performance Trend</h3>
          <div className="h-64">{performanceTrend.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><LineChart data={performanceTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} /><Line type="monotone" dataKey="efficiency" stroke="#2563EB" strokeWidth={2} name="Efficiency %" dot={{ r: 3 }} /><Line type="monotone" dataKey="productivity" stroke="#16A34A" strokeWidth={2} name="Productivity %" dot={{ r: 3 }} /><Line type="monotone" dataKey="qualityRate" stroke="#D97706" strokeWidth={2} name="Quality %" dot={{ r: 3 }} /></LineChart></ResponsiveContainer>) : (<div className="h-full flex items-center justify-center text-muted-foreground">No data</div>)}</div>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><PieChart size={18} /> Cost Breakdown</h3>
          <div className="h-64">{costBreakdownData.length > 0 ? (<ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{costBreakdownData.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}</Pie><Tooltip formatter={(value) => formatCurrency(value as number)} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} /></RePieChart></ResponsiveContainer>) : (<div className="h-full flex items-center justify-center text-muted-foreground">No cost data</div>)}</div>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
        <h3 className="font-semibold text-foreground mb-4">Current Performance Metrics</h3>
        {latestMetric ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Efficiency</span><span className="font-medium text-foreground">{latestMetric.efficiency}%</span></div><div className="w-full h-2 bg-muted rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${latestMetric.efficiency}%` }} /></div></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Productivity</span><span className="font-medium text-foreground">{latestMetric.productivity}%</span></div><div className="w-full h-2 bg-muted rounded-full"><div className="h-full bg-green-500 rounded-full" style={{ width: `${latestMetric.productivity}%` }} /></div></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Quality Rate</span><span className="font-medium text-foreground">{latestMetric.qualityRate}%</span></div><div className="w-full h-2 bg-muted rounded-full"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${latestMetric.qualityRate}%` }} /></div></div>
          </div>
        ) : (<div className="text-center text-muted-foreground py-8">No metrics available</div>)}
      </div>

      {/* Cost Records Table (responsive) */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border"><h3 className="font-semibold text-foreground">Recent Cost Records</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr><th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Vehicle ID</th><th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Model</th><th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Material</th><th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Labor</th><th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Overhead</th><th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Total</th></tr></thead>
            <tbody>{costs.slice(0, 10).map(cost => (<tr key={cost.id} className="border-b border-border hover:bg-muted/30"><td className="px-5 py-3 font-mono text-foreground">{cost.vehicleId}</td><td className="px-5 py-3 text-muted-foreground">{cost.vehicleModel}</td><td className="px-5 py-3 text-right text-muted-foreground">{formatCurrency(cost.materialCost)}</td><td className="px-5 py-3 text-right text-muted-foreground">{formatCurrency(cost.laborCost)}</td><td className="px-5 py-3 text-right text-muted-foreground">{formatCurrency(cost.overheadCost)}</td><td className="px-5 py-3 text-right font-semibold text-foreground">{formatCurrency(cost.totalCost)}</td></tr>))}</tbody>
          </table>
        </div>
        {costs.length === 0 && <div className="py-12 text-center text-muted-foreground">No cost records</div>}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border"><h2 className="text-lg font-semibold text-foreground">Record Production Cost</h2><button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted"><X size={20} className="text-muted-foreground" /></button></div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Vehicle ID *</label><input type="text" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-1 focus:ring-ring" required /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Model</label><select value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">{vehicleModels.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1.5">Material Cost ($)</label><input type="number" value={formData.materialCost || ''} onChange={e => setFormData({...formData, materialCost: parseFloat(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Labor Cost ($)</label><input type="number" value={formData.laborCost || ''} onChange={e => setFormData({...formData, laborCost: parseFloat(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Overhead Cost ($)</label><input type="number" value={formData.overheadCost || ''} onChange={e => setFormData({...formData, overheadCost: parseFloat(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Total</label><div className="h-10 px-3 rounded-lg bg-muted flex items-center text-sm font-semibold text-foreground">{formatCurrency(totalCost)}</div></div>
              </div>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Record'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}