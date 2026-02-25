'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, X, Battery, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const batteryTypes = ['Li-ion 40kWh', 'Li-ion 60kWh', 'Li-ion 80kWh'];
const motorSpecs = ['100kW', '150kW', '200kW'];
const controllerModels = ['BorgWarner MCU-100', 'BorgWarner MCU-150', 'BorgWarner MCU-200', 'BorgWarner MCU-200P'];
const techTeams = ['Tech Team A', 'Tech Team B', 'Tech Team C', 'Tech Team D'];
const vehicleModels = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'];

export default function BatteryPowertrain() {
  const { assemblies, fetchAssemblies, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssembly, setEditingAssembly] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicleId: '', vehicleModel: 'EV-Compact', batteryType: 'Li-ion 40kWh',
    motorSpec: '100kW', controllerModel: 'BorgWarner MCU-100', status: 'in_assembly', assembledBy: 'Tech Team A',
  });

  useEffect(() => { fetchAssemblies(); }, [fetchAssemblies]);

  const resetForm = () => {
    setFormData({ vehicleId: '', vehicleModel: 'EV-Compact', batteryType: 'Li-ion 40kWh', motorSpec: '100kW', controllerModel: 'BorgWarner MCU-100', status: 'in_assembly', assembledBy: 'Tech Team A' });
    setEditingAssembly(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  const openEditModal = (assembly: any) => { setEditingAssembly(assembly); setFormData({ vehicleId: assembly.vehicleId, vehicleModel: assembly.vehicleModel, batteryType: assembly.batteryType, motorSpec: assembly.motorSpec, controllerModel: assembly.controllerModel, status: assembly.status, assembledBy: assembly.assembledBy }); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      if (editingAssembly) {
        const res = await fetch(`/api/assemblies/${editingAssembly.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const data = await res.json();
        if (data.success) { toast.success('Assembly updated'); fetchAssemblies(); } else toast.error(data.message);
      } else {
        const res = await fetch('/api/assemblies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const data = await res.json();
        if (data.success) { toast.success('Assembly created'); fetchAssemblies(); } else toast.error(data.message);
      }
      setIsModalOpen(false); resetForm();
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      in_assembly: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Zap size={12} /> },
      testing: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Battery size={12} /> },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={12} /> },
    };
    const style = styles[status] || styles.in_assembly;
    const labels: Record<string, string> = { in_assembly: 'In Assembly', testing: 'Testing', completed: 'Completed' };
    return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{style.icon}{labels[status]}</span>;
  };

  const stats = { total: assemblies.length, inAssembly: assemblies.filter(a => a.status === 'in_assembly').length, testing: assemblies.filter(a => a.status === 'testing').length, completed: assemblies.filter(a => a.status === 'completed').length };

  if (loading.assemblies) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Battery & Powertrain</h1><p className="text-sm mt-1" style={{ color: '#6B7280' }}>Track battery and motor assembly process</p></div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}><Plus size={18} />New Assembly</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: '#111827' },
          { label: 'In Assembly', value: stats.inAssembly, color: '#2563EB' },
          { label: 'Testing', value: stats.testing, color: '#D97706' },
          { label: 'Completed', value: stats.completed, color: '#16A34A' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p className="text-sm" style={{ color: '#6B7280' }}>{s.label}</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Vehicle ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Model</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Battery</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Motor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Team</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Actions</th>
            </tr></thead>
            <tbody>
              {assemblies.map((assembly) => (
                <tr key={assembly.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#E5E7EB' }}>
                  <td className="px-4 py-3"><span className="text-sm font-mono font-medium" style={{ color: '#111827' }}>{assembly.vehicleId}</span></td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: '#111827' }}>{assembly.vehicleModel}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}><Battery size={14} />{assembly.batteryType}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}><Zap size={14} />{assembly.motorSpec}</span></td>
                  <td className="px-4 py-3">{getStatusBadge(assembly.status)}</td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: '#6B7280' }}>{assembly.assembledBy}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => openEditModal(assembly)} className="p-1.5 rounded hover:bg-gray-100 transition-colors"><Pencil size={16} style={{ color: '#6B7280' }} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {assemblies.length === 0 && <div className="py-12 text-center"><p className="text-sm" style={{ color: '#6B7280' }}>No assemblies found</p></div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>{editingAssembly ? 'Edit Assembly' : 'New Assembly'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} style={{ color: '#6B7280' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Vehicle ID *</label><input type="text" value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required disabled={!!editingAssembly} /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Model</label><select value={formData.vehicleModel} onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{vehicleModels.map((m) => (<option key={m} value={m}>{m}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Battery</label><select value={formData.batteryType} onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{batteryTypes.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Motor</label><select value={formData.motorSpec} onChange={(e) => setFormData({ ...formData, motorSpec: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{motorSpecs.map((s) => (<option key={s} value={s}>{s}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Controller</label><select value={formData.controllerModel} onChange={(e) => setFormData({ ...formData, controllerModel: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{controllerModels.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}><option value="in_assembly">In Assembly</option><option value="testing">Testing</option><option value="completed">Completed</option></select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Team</label><select value={formData.assembledBy} onChange={(e) => setFormData({ ...formData, assembledBy: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{techTeams.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: '#2563EB' }}>{isSubmitting ? 'Saving...' : (editingAssembly ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
