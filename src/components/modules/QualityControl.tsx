'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, X, CheckCircle, XCircle, AlertTriangle, Loader2, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

const inspectionTypes = [{ value: 'visual', label: 'Visual Inspection' }, { value: 'electrical', label: 'Electrical Inspection' }, { value: 'performance', label: 'Performance Test' }, { value: 'safety', label: 'Safety Inspection' }];
const vehicleModels = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'];

export default function QualityControl() {
  const { inspections, fetchInspections, qualityFilter, setQualityFilter, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', vehicleModel: 'EV-Compact', inspectionType: 'visual', result: 'pass', defectDescription: '', inspector: '' });

  useEffect(() => { fetchInspections(qualityFilter); }, [fetchInspections, qualityFilter]);

  const resetForm = () => { setFormData({ vehicleId: '', vehicleModel: 'EV-Compact', inspectionType: 'visual', result: 'pass', defectDescription: '', inspector: '' }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    if (!formData.vehicleId || !formData.inspector) { toast.error('Please fill required fields'); setIsSubmitting(false); return; }
    if (formData.result === 'fail' && !formData.defectDescription) { toast.error('Defect description required for failed inspections'); setIsSubmitting(false); return; }
    try {
      const res = await fetch('/api/inspections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) { toast.success(formData.result === 'pass' ? 'Inspection passed' : 'Inspection recorded'); fetchInspections(qualityFilter); setIsModalOpen(false); resetForm(); }
      else toast.error(data.message);
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const stats = { total: inspections.length, passed: inspections.filter(i => i.result === 'pass').length, failed: inspections.filter(i => i.result === 'fail').length, passRate: inspections.length > 0 ? ((inspections.filter(i => i.result === 'pass').length / inspections.length) * 100).toFixed(1) : '0' };

  if (loading.inspections) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quality Control</h1>
          <p className="text-muted-foreground mt-1">Record and track vehicle inspections</p>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-sm"><Plus size={18} />New Inspection</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold text-foreground">{stats.total}</p></div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center"><p className="text-sm text-muted-foreground">Passed</p><p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.passed}</p></div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center"><p className="text-sm text-muted-foreground">Failed</p><p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.failed}</p></div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center"><p className="text-sm text-muted-foreground">Pass Rate</p><p className="text-2xl font-bold text-primary">{stats.passRate}%</p></div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-1 focus:ring-ring"><option value="all">All Results</option><option value="pass">Passed</option><option value="fail">Failed</option></select>
      </div>

      {/* Inspections Feed */}
      <div className="space-y-3">
        {inspections.map((inspection) => (
          <div key={inspection.id} className="bg-card rounded-xl p-4 shadow-sm border border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inspection.result === 'pass' ? 'bg-green-100 dark:bg-green-950/30' : 'bg-red-100 dark:bg-red-950/30'}`}>
                {inspection.result === 'pass' ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-medium text-foreground">{inspection.vehicleId}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{inspection.vehicleModel}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{inspection.inspectionType}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Inspector: {inspection.inspector} · {new Date(inspection.inspectionDate).toLocaleDateString()}</p>
                {inspection.defectDescription && <p className="text-sm text-red-600 dark:text-red-400 mt-1">⚠️ {inspection.defectDescription}</p>}
                {inspection.approved && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={12} /> Approved</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className={`text-xs px-2 py-1 rounded-full ${inspection.result === 'pass' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}>{inspection.result.toUpperCase()}</span>
            </div>
          </div>
        ))}
        {inspections.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-dashed">
            <ClipboardCheck size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No inspections found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">New Inspection</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted"><X size={20} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Vehicle ID *</label><input type="text" value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-1 focus:ring-ring" required /></div>
                <div><label className="block text-sm font-medium mb-1.5">Model</label><select value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">{vehicleModels.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1.5">Type</label><select value={formData.inspectionType} onChange={e => setFormData({...formData, inspectionType: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">{inspectionTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Inspector *</label><input type="text" value={formData.inspector} onChange={e => setFormData({...formData, inspector: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" required /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Result</label><div className="flex gap-4"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="result" value="pass" checked={formData.result === 'pass'} onChange={() => setFormData({...formData, result: 'pass', defectDescription: ''})} className="w-4 h-4 text-green-600 focus:ring-green-500" /><span className="text-sm font-medium text-green-600">Pass</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="result" value="fail" checked={formData.result === 'fail'} onChange={() => setFormData({...formData, result: 'fail'})} className="w-4 h-4 text-red-600 focus:ring-red-500" /><span className="text-sm font-medium text-red-600">Fail</span></label></div></div>
                {formData.result === 'fail' && (<div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Defect Description *</label><textarea value={formData.defectDescription} onChange={e => setFormData({...formData, defectDescription: e.target.value})} className="w-full h-24 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm resize-none focus:ring-1 focus:ring-ring" placeholder="Describe the defect..." /></div>)}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}