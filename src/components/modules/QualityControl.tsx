'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, X, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
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
      if (data.success) { toast.success(formData.result === 'pass' ? 'Inspection passed - Auto approved' : 'Inspection recorded'); fetchInspections(qualityFilter); setIsModalOpen(false); resetForm(); }
      else toast.error(data.message);
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const stats = { total: inspections.length, passed: inspections.filter(i => i.result === 'pass').length, failed: inspections.filter(i => i.result === 'fail').length, passRate: inspections.length > 0 ? ((inspections.filter(i => i.result === 'pass').length / inspections.length) * 100).toFixed(1) : '0' };

  const getResultBadge = (result: string) => result === 'pass' ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} />Pass</span> : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle size={12} />Fail</span>;
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = { visual: 'bg-blue-100 text-blue-700', electrical: 'bg-yellow-100 text-yellow-700', performance: 'bg-purple-100 text-purple-700', safety: 'bg-red-100 text-red-700' };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[type] || 'bg-gray-100 text-gray-700'}`}>{type}</span>;
  };

  if (loading.inspections) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Quality Control</h1><p className="text-sm mt-1" style={{ color: '#6B7280' }}>Record and track vehicle inspections</p></div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}><Plus size={18} />New Inspection</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: '#111827' },
          { label: 'Passed', value: stats.passed, color: '#16A34A' },
          { label: 'Failed', value: stats.failed, color: '#DC2626' },
          { label: 'Pass Rate', value: `${stats.passRate}%`, color: '#2563EB' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p className="text-sm" style={{ color: '#6B7280' }}>{s.label}</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <select value={qualityFilter} onChange={(e) => setQualityFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option value="all">All Results</option><option value="pass">Passed</option><option value="fail">Failed</option>
        </select>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Vehicle ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Result</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Inspector</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Defect</th>
            </tr></thead>
            <tbody>
              {inspections.map((inspection) => (
                <tr key={inspection.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#E5E7EB' }}>
                  <td className="px-4 py-3"><span className="text-sm font-mono font-medium" style={{ color: '#111827' }}>{inspection.vehicleId}</span></td>
                  <td className="px-4 py-3">{getTypeBadge(inspection.inspectionType)}</td>
                  <td className="px-4 py-3">{getResultBadge(inspection.result)}</td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: '#6B7280' }}>{inspection.inspector}</span></td>
                  <td className="px-4 py-3">{inspection.approved ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} />Approved</span> : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"><AlertTriangle size={12} />Pending</span>}</td>
                  <td className="px-4 py-3">{inspection.defectDescription ? <span className="text-sm text-red-600 line-clamp-1">{inspection.defectDescription}</span> : <span className="text-sm" style={{ color: '#9CA3AF' }}>-</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {inspections.length === 0 && <div className="py-12 text-center"><p className="text-sm" style={{ color: '#6B7280' }}>No inspections found</p></div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>New Inspection</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} style={{ color: '#6B7280' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Vehicle ID *</label><input type="text" value={formData.vehicleId} onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Model</label><select value={formData.vehicleModel} onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{vehicleModels.map((m) => (<option key={m} value={m}>{m}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Type</label><select value={formData.inspectionType} onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{inspectionTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}</select></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Inspector *</label><input type="text" value={formData.inspector} onChange={(e) => setFormData({ ...formData, inspector: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Result</label><div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="result" value="pass" checked={formData.result === 'pass'} onChange={() => setFormData({ ...formData, result: 'pass', defectDescription: '' })} className="w-4 h-4 text-green-600 focus:ring-green-500" /><span className="text-sm font-medium text-green-600">Pass</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="result" value="fail" checked={formData.result === 'fail'} onChange={() => setFormData({ ...formData, result: 'fail' })} className="w-4 h-4 text-red-600 focus:ring-red-500" /><span className="text-sm font-medium text-red-600">Fail</span></label>
                </div></div>
                {formData.result === 'fail' && (<div className="col-span-2"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Defect Description * <span className="text-red-500">(Required)</span></label><textarea value={formData.defectDescription} onChange={(e) => setFormData({ ...formData, defectDescription: e.target.value })} className="w-full h-24 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" style={{ borderColor: '#D1D5DB' }} placeholder="Describe the defect..." /></div>)}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: '#2563EB' }}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
