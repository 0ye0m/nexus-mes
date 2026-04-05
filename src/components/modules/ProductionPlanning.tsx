'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, X, Calendar, Users, Cog, Loader2, Clock, CheckCircle, PlayCircle } from 'lucide-react';
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
    vehicleModel: 'EV-Compact', scheduleType: 'daily', targetQuantity: 0, completedQuantity: 0,
    startDate: '', endDate: '', assignedMachines: [] as string[], assignedLabor: 0, status: 'pending',
  });

  useEffect(() => { fetchSchedules(productionFilter); }, [fetchSchedules, productionFilter]);

  const resetForm = () => {
    setFormData({ vehicleModel: 'EV-Compact', scheduleType: 'daily', targetQuantity: 0, completedQuantity: 0, startDate: '', endDate: '', assignedMachines: [], assignedLabor: 0, status: 'pending' });
    setEditingSchedule(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  const openEditModal = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      vehicleModel: schedule.vehicleModel, scheduleType: schedule.scheduleType, targetQuantity: schedule.targetQuantity,
      completedQuantity: schedule.completedQuantity, startDate: schedule.startDate.split('T')[0],
      endDate: schedule.endDate ? schedule.endDate.split('T')[0] : '', assignedMachines: schedule.assignedMachines || [],
      assignedLabor: schedule.assignedLabor, status: schedule.status,
    });
    setIsModalOpen(true);
  };

  const handleMachineToggle = (machine: string) => {
    setFormData(prev => ({ ...prev, assignedMachines: prev.assignedMachines.includes(machine) ? prev.assignedMachines.filter(m => m !== machine) : [...prev.assignedMachines, machine] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const url = editingSchedule ? `/api/schedules/${editingSchedule.id}` : '/api/schedules';
      const method = editingSchedule ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) {
        toast.success(editingSchedule ? 'Schedule updated' : 'Schedule created');
        fetchSchedules(productionFilter);
        setIsModalOpen(false); resetForm();
      } else toast.error(data.message);
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'pending') return <Clock size={16} className="text-yellow-500" />;
    if (status === 'in_progress') return <PlayCircle size={16} className="text-blue-500" />;
    return <CheckCircle size={16} className="text-green-500" />;
  };

  const getProgress = (schedule: any) => Math.round((schedule.completedQuantity / schedule.targetQuantity) * 100) || 0;

  if (loading.schedules) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Production Planning</h1>
          <p className="text-muted-foreground mt-1">Create and manage production schedules</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-sm"><Plus size={18} />New Schedule</button>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select value={productionFilter} onChange={(e) => setProductionFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-1 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Schedule Cards */}
      <div className="space-y-4">
        {schedules.map((schedule) => {
          const progress = getProgress(schedule);
          return (
            <div key={schedule.id} className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getStatusIcon(schedule.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{schedule.vehicleModel}</h3>
                    <p className="text-xs text-muted-foreground font-mono">ID: {schedule.id.slice(0, 8)}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(schedule.startDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {schedule.assignedLabor} workers</span>
                      <span className="flex items-center gap-1"><Cog size={12} /> {schedule.assignedMachines?.length || 0} machines</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => openEditModal(schedule)} className="p-1.5 rounded-md hover:bg-muted self-start"><Pencil size={16} className="text-muted-foreground" /></button>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{schedule.completedQuantity} / {schedule.targetQuantity} units ({progress}%)</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400' :
                  schedule.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                  'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                }`}>
                  {schedule.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
        {schedules.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed">
            <Calendar size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No production schedules found</p>
          </div>
        )}
      </div>

      {/* Modal (similar structure, but keep compact) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{editingSchedule ? 'Edit Schedule' : 'New Schedule'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted"><X size={20} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Vehicle Model</label><select value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">{vehicleModels.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1.5">Schedule Type</label><select value={formData.scheduleType} onChange={e => setFormData({...formData, scheduleType: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">{scheduleTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1.5">Target Quantity *</label><input type="number" value={formData.targetQuantity} onChange={e => setFormData({...formData, targetQuantity: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="1" required /></div>
                <div><label className="block text-sm font-medium mb-1.5">Completed</label><input type="number" value={formData.completedQuantity} onChange={e => setFormData({...formData, completedQuantity: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Start Date *</label><input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" required /></div>
                <div><label className="block text-sm font-medium mb-1.5">End Date</label><input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Assigned Labor</label><input type="number" value={formData.assignedLabor} onChange={e => setFormData({...formData, assignedLabor: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm"><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-2">Assigned Machines</label><div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">{machineList.map(machine => (<label key={machine} className="flex items-center gap-2 p-2 rounded border border-border cursor-pointer hover:bg-muted"><input type="checkbox" checked={formData.assignedMachines.includes(machine)} onChange={() => handleMachineToggle(machine)} className="w-4 h-4 rounded border-input text-primary focus:ring-ring" /><span className="text-sm text-foreground">{machine}</span></label>))}</div></div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingSchedule ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}