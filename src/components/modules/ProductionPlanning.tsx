'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, X, Calendar, Users, Cog, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const vehicleModels = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'];
const scheduleTypes = [{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }];
const machineList = ['Assembly Line A', 'Assembly Line B', 'Assembly Line C', 'Assembly Line D', 'Assembly Line E', 'Assembly Line F', 'Paint Booth 1', 'Paint Booth 2', 'Testing Station 1', 'Testing Station 2'];

export default function ProductionPlanning() {
  const { schedules, fetchSchedules, productionFilter, setProductionFilter, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vehicleModel: 'EV-Compact',
    scheduleType: 'daily',
    targetQuantity: 0,
    completedQuantity: 0,
    startDate: '',
    endDate: '',
    assignedMachines: [] as string[],
    assignedLabor: 0,
    status: 'pending',
  });

  useEffect(() => {
    fetchSchedules(productionFilter);
  }, [fetchSchedules, productionFilter]);

  const resetForm = () => {
    setFormData({ vehicleModel: 'EV-Compact', scheduleType: 'daily', targetQuantity: 0, completedQuantity: 0, startDate: '', endDate: '', assignedMachines: [], assignedLabor: 0, status: 'pending' });
    setEditingSchedule(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  const openEditModal = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      vehicleModel: schedule.vehicleModel,
      scheduleType: schedule.scheduleType,
      targetQuantity: schedule.targetQuantity,
      completedQuantity: schedule.completedQuantity,
      startDate: schedule.startDate.split('T')[0],
      endDate: schedule.endDate ? schedule.endDate.split('T')[0] : '',
      assignedMachines: schedule.assignedMachines || [],
      assignedLabor: schedule.assignedLabor,
      status: schedule.status,
    });
    setIsModalOpen(true);
  };

  const handleMachineToggle = (machine: string) => {
    const machines = formData.assignedMachines.includes(machine) ? formData.assignedMachines.filter(m => m !== machine) : [...formData.assignedMachines, machine];
    setFormData({ ...formData, assignedMachines: machines });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSchedule) {
        const res = await fetch(`/api/schedules/${editingSchedule.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const data = await res.json();
        if (data.success) { toast.success('Schedule updated successfully'); fetchSchedules(productionFilter); }
        else toast.error(data.message);
      } else {
        const res = await fetch('/api/schedules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        const data = await res.json();
        if (data.success) { toast.success('Schedule created successfully'); fetchSchedules(productionFilter); }
        else toast.error(data.message);
      }
      setIsModalOpen(false); resetForm();
    } catch { toast.error('An error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
    const labels: Record<string, string> = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getProgressPercentage = (schedule: any) => Math.round((schedule.completedQuantity / schedule.targetQuantity) * 100) || 0;
  const getProgressColor = (percentage: number) => percentage >= 100 ? 'bg-green-500' : percentage >= 50 ? 'bg-blue-500' : 'bg-yellow-500';

  if (loading.schedules) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Production Planning</h1><p className="text-sm mt-1" style={{ color: '#6B7280' }}>Create and manage production schedules</p></div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}><Plus size={18} />New Schedule</button>
      </div>

      <div className="flex items-center gap-4">
        <select value={productionFilter} onChange={(e) => setProductionFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="rounded-lg p-5" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div className="flex items-start justify-between mb-4">
              <div><h3 className="font-semibold" style={{ color: '#111827' }}>{schedule.vehicleModel}</h3><p className="text-sm mt-1" style={{ color: '#6B7280' }}>ID: {schedule.id.slice(0, 8)}...</p></div>
              <div className="flex items-center gap-2">{getStatusBadge(schedule.status)}<button onClick={() => openEditModal(schedule)} className="p-1.5 rounded hover:bg-gray-100 transition-colors"><Pencil size={16} style={{ color: '#6B7280' }} /></button></div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1"><span style={{ color: '#6B7280' }}>Progress</span><span className="font-medium" style={{ color: '#111827' }}>{schedule.completedQuantity} / {schedule.targetQuantity} units</span></div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${getProgressColor(getProgressPercentage(schedule))} transition-all`} style={{ width: `${getProgressPercentage(schedule)}%` }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}><Calendar size={14} /><span>{new Date(schedule.startDate).toLocaleDateString()}</span></div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}><Users size={14} /><span>{schedule.assignedLabor} workers</span></div>
                <div className="flex items-center gap-2 text-sm col-span-2" style={{ color: '#6B7280' }}><Cog size={14} /><span className="truncate">{(schedule.assignedMachines || []).join(', ') || 'No machines'}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {schedules.length === 0 && <div className="py-12 text-center rounded-lg" style={{ backgroundColor: 'white' }}><p className="text-sm" style={{ color: '#6B7280' }}>No production schedules found</p></div>}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>{editingSchedule ? 'Edit Schedule' : 'New Schedule'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} style={{ color: '#6B7280' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Vehicle Model</label><select value={formData.vehicleModel} onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{vehicleModels.map((model) => (<option key={model} value={model}>{model}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Schedule Type</label><select value={formData.scheduleType} onChange={(e) => setFormData({ ...formData, scheduleType: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{scheduleTypes.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Target Quantity *</label><input type="number" value={formData.targetQuantity} onChange={(e) => setFormData({ ...formData, targetQuantity: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="1" required /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Completed</label><input type="number" value={formData.completedQuantity} onChange={(e) => setFormData({ ...formData, completedQuantity: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Start Date *</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>End Date</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Assigned Labor</label><input type="number" value={formData.assignedLabor} onChange={(e) => setFormData({ ...formData, assignedLabor: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-2" style={{ color: '#111827' }}>Assigned Machines</label><div className="grid grid-cols-2 gap-2">{machineList.map((machine) => (<label key={machine} className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-gray-50" style={{ borderColor: '#E5E7EB' }}><input type="checkbox" checked={formData.assignedMachines.includes(machine)} onChange={() => handleMachineToggle(machine)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm" style={{ color: '#374151' }}>{machine}</span></label>))}</div></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: '#2563EB' }}>{isSubmitting ? 'Saving...' : (editingSchedule ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
