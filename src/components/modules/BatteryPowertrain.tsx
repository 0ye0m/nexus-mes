'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, X, Battery, Zap, CheckCircle, Loader2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const batteryTypes = ['Li-ion 40kWh', 'Li-ion 60kWh', 'Li-ion 80kWh'];
const motorSpecs = ['100kW', '150kW', '200kW'];
const controllerModels = ['BorgWarner MCU-100', 'BorgWarner MCU-150', 'BorgWarner MCU-200', 'BorgWarner MCU-200P'];
const techTeams = ['Tech Team A', 'Tech Team B', 'Tech Team C', 'Tech Team D'];
const vehicleModels = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'];

const statuses = [
  { id: 'in_assembly', label: 'In Assembly', color: 'bg-blue-500', icon: Zap },
  { id: 'testing', label: 'Testing', color: 'bg-yellow-500', icon: Battery },
  { id: 'completed', label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
];

export default function BatteryPowertrain() {
  const { assemblies, fetchAssemblies, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssembly, setEditingAssembly] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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
  const openEditModal = (assembly: any) => {
    setEditingAssembly(assembly);
    setFormData({
      vehicleId: assembly.vehicleId,
      vehicleModel: assembly.vehicleModel,
      batteryType: assembly.batteryType,
      motorSpec: assembly.motorSpec,
      controllerModel: assembly.controllerModel,
      status: assembly.status,
      assembledBy: assembly.assembledBy,
    });
    setIsModalOpen(true);
  };

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

  const getAssembliesByStatus = (status: string) => assemblies.filter(a => a.status === status);

  if (loading.assemblies) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Battery & Powertrain</h1>
          <p className="text-muted-foreground mt-1">Track battery and motor assembly process</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Assembly
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: assemblies.length, color: 'text-foreground' },
          { label: 'In Assembly', value: assemblies.filter(a => a.status === 'in_assembly').length, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Testing', value: assemblies.filter(a => a.status === 'testing').length, color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Completed', value: assemblies.filter(a => a.status === 'completed').length, color: 'text-green-600 dark:text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-card rounded-xl p-5 shadow-sm border border-border">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status) => {
          const Icon = status.icon;
          const items = getAssembliesByStatus(status.id);
          return (
            <div key={status.id} className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  <h3 className="font-semibold text-foreground">{status.label}</h3>
                  <span className="text-xs bg-background px-2 py-0.5 rounded-full text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <Icon size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {items.map((assembly) => (
                  <div
                    key={assembly.id}
                    className="bg-card rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => openEditModal(assembly)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm font-medium text-foreground">{assembly.vehicleId}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{assembly.vehicleModel}</p>
                      </div>
                      <button className="p-1 rounded-md hover:bg-muted">
                        <MoreVertical size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        <Battery size={12} /> {assembly.batteryType.split(' ').slice(0,2).join(' ')}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        <Zap size={12} /> {assembly.motorSpec}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Team: {assembly.assembledBy}</p>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="bg-card rounded-lg p-4 text-center text-muted-foreground text-sm border border-dashed">
                    No assemblies
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
              <h2 className="text-lg font-semibold text-foreground">
                {editingAssembly ? 'Edit Assembly' : 'New Assembly'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Vehicle ID *</label>
                  <input
                    type="text"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    required
                    disabled={!!editingAssembly}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Model</label>
                  <select
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {vehicleModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Battery</label>
                  <select
                    value={formData.batteryType}
                    onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {batteryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Motor</label>
                  <select
                    value={formData.motorSpec}
                    onChange={(e) => setFormData({ ...formData, motorSpec: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {motorSpecs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Controller</label>
                  <select
                    value={formData.controllerModel}
                    onChange={(e) => setFormData({ ...formData, controllerModel: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {controllerModels.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="in_assembly">In Assembly</option>
                    <option value="testing">Testing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Team</label>
                  <select
                    value={formData.assembledBy}
                    onChange={(e) => setFormData({ ...formData, assembledBy: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {techTeams.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : (editingAssembly ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}