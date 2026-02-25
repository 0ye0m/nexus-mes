'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, AlertTriangle, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const categoryOptions = [
  { value: 'battery', label: 'Battery' },
  { value: 'motor', label: 'Motor' },
  { value: 'controller', label: 'Controller' },
  { value: 'chassis', label: 'Chassis' },
  { value: 'tires', label: 'Tires' },
  { value: 'interior', label: 'Interior' },
  { value: 'electronics', label: 'Electronics' },
];

export default function InventoryManagement() {
  const { materials, fetchMaterials, inventoryFilter, setInventoryFilter, searchQuery, setSearchQuery, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [stockUpdateModal, setStockUpdateModal] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'battery',
    quantity: 0,
    unit: 'units',
    minStock: 0,
    unitCost: 0,
    supplier: '',
    supplierContact: '',
  });

  const [stockUpdate, setStockUpdate] = useState(0);

  useEffect(() => {
    fetchMaterials(inventoryFilter, searchQuery);
  }, [fetchMaterials, inventoryFilter, searchQuery]);

  const lowStockCount = materials.filter(m => m.quantity < m.minStock).length;

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      category: 'battery',
      quantity: 0,
      unit: 'units',
      minStock: 0,
      unitCost: 0,
      supplier: '',
      supplierContact: '',
    });
    setEditingMaterial(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (material: any) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      sku: material.sku,
      category: material.category,
      quantity: material.quantity,
      unit: material.unit,
      minStock: material.minStock,
      unitCost: material.unitCost,
      supplier: material.supplier,
      supplierContact: material.supplierContact || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingMaterial) {
        const res = await fetch(`/api/materials/${editingMaterial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Material updated successfully');
          fetchMaterials(inventoryFilter, searchQuery);
        } else {
          toast.error(data.message);
        }
      } else {
        const res = await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Material added successfully');
          fetchMaterials(inventoryFilter, searchQuery);
        } else {
          toast.error(data.message);
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStockUpdate = async () => {
    if (stockUpdateModal) {
      try {
        const res = await fetch(`/api/materials/${stockUpdateModal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: stockUpdate }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('Stock updated successfully');
          fetchMaterials(inventoryFilter, searchQuery);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error('Failed to update stock');
      }
      setStockUpdateModal(null);
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      battery: 'bg-green-100 text-green-700',
      motor: 'bg-blue-100 text-blue-700',
      controller: 'bg-purple-100 text-purple-700',
      chassis: 'bg-orange-100 text-orange-700',
      tires: 'bg-gray-100 text-gray-700',
      interior: 'bg-pink-100 text-pink-700',
      electronics: 'bg-cyan-100 text-cyan-700',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colors[category] || 'bg-gray-100 text-gray-700'}`}>
        {category}
      </span>
    );
  };

  const getStockStatus = (material: any) => {
    if (material.quantity === 0) return <span className="text-xs font-medium text-red-600">Out of Stock</span>;
    if (material.quantity < material.minStock) {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-orange-600">
          <AlertTriangle size={12} /> Low Stock
        </span>
      );
    }
    return <span className="text-xs font-medium text-green-600">In Stock</span>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading.materials) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Inventory Management</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
            Track raw materials and components
            {lowStockCount > 0 && <span className="ml-2 text-orange-600 font-medium">({lowStockCount} items low stock)</span>}
          </p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}>
          <Plus size={18} /> Add Material
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search materials..." className="w-full h-9 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
        <select value={inventoryFilter} onChange={(e) => setInventoryFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
          <option value="all">All Categories</option>
          {categoryOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
        </select>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Material</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Quantity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Min Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Unit Cost</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Supplier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#E5E7EB' }}>
                  <td className="px-4 py-3"><span className="text-sm font-medium" style={{ color: '#111827' }}>{material.name}</span></td>
                  <td className="px-4 py-3"><span className="text-xs font-mono" style={{ color: '#6B7280' }}>{material.sku}</span></td>
                  <td className="px-4 py-3">{getCategoryBadge(material.category)}</td>
                  <td className="px-4 py-3"><span className="text-sm font-medium" style={{ color: '#111827' }}>{material.quantity.toLocaleString()} {material.unit}</span></td>
                  <td className="px-4 py-3"><span className="text-sm" style={{ color: '#6B7280' }}>{material.minStock.toLocaleString()} {material.unit}</span></td>
                  <td className="px-4 py-3"><span className="text-sm font-medium" style={{ color: '#111827' }}>{formatCurrency(material.unitCost)}</span></td>
                  <td className="px-4 py-3"><div><p className="text-sm font-medium" style={{ color: '#111827' }}>{material.supplier}</p><p className="text-xs" style={{ color: '#9CA3AF' }}>{material.supplierContact}</p></div></td>
                  <td className="px-4 py-3">{getStockStatus(material)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setStockUpdateModal(material); setStockUpdate(material.quantity); }} className="px-2 py-1 text-xs font-medium rounded border hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Update Stock</button>
                      <button onClick={() => openEditModal(material)} className="p-1.5 rounded hover:bg-gray-100 transition-colors"><Pencil size={16} style={{ color: '#6B7280' }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {materials.length === 0 && (<div className="py-12 text-center"><p className="text-sm" style={{ color: '#6B7280' }}>No materials found</p></div>)}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>{editingMaterial ? 'Edit Material' : 'Add New Material'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} style={{ color: '#6B7280' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Material Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>SKU *</label><input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required disabled={!!editingMaterial} /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Category</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }}>{categoryOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Quantity</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Unit</label><input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Minimum Stock</label><input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Unit Cost ($)</label><input type="number" value={formData.unitCost} onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Supplier *</label><input type="text" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} required /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Supplier Contact</label><input type="text" value={formData.supplierContact} onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50" style={{ backgroundColor: '#2563EB' }}>{isSubmitting ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Add Material')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {stockUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>Update Stock</h3>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{stockUpdateModal.name} (Current: {stockUpdateModal.quantity} {stockUpdateModal.unit})</p>
            <div className="mb-4"><label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>New Quantity</label><input type="number" value={stockUpdate} onChange={(e) => setStockUpdate(parseInt(e.target.value) || 0)} className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" style={{ borderColor: '#D1D5DB' }} min="0" /></div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setStockUpdateModal(null)} className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors" style={{ borderColor: '#D1D5DB', color: '#374151' }}>Cancel</button>
              <button onClick={handleStockUpdate} className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700" style={{ backgroundColor: '#2563EB' }}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
