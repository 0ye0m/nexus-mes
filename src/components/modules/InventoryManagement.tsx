'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, AlertTriangle, X, Search, Loader2, Package, TrendingDown, TrendingUp, Minus, Plus as PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

const categoryOptions = [
  { value: 'battery', label: 'Battery', icon: '🔋' },
  { value: 'motor', label: 'Motor', icon: '⚙️' },
  { value: 'controller', label: 'Controller', icon: '🎛️' },
  { value: 'chassis', label: 'Chassis', icon: '🚗' },
  { value: 'tires', label: 'Tires', icon: '🛞' },
  { value: 'interior', label: 'Interior', icon: '🪑' },
  { value: 'electronics', label: 'Electronics', icon: '💻' },
];

export default function InventoryManagement() {
  const { materials, fetchMaterials, inventoryFilter, setInventoryFilter, searchQuery, setSearchQuery, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [stockUpdateMaterial, setStockUpdateMaterial] = useState<any>(null);
  const [stockDelta, setStockDelta] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', sku: '', category: 'battery', quantity: 0, unit: 'units', minStock: 0,
    unitCost: 0, supplier: '', supplierContact: '',
  });

  useEffect(() => {
    fetchMaterials(inventoryFilter, searchQuery);
  }, [fetchMaterials, inventoryFilter, searchQuery]);

  const lowStockCount = materials.filter(m => m.quantity < m.minStock).length;
  const totalValue = materials.reduce((sum, m) => sum + m.quantity * m.unitCost, 0);

  const resetForm = () => {
    setFormData({ name: '', sku: '', category: 'battery', quantity: 0, unit: 'units', minStock: 0, unitCost: 0, supplier: '', supplierContact: '' });
    setEditingMaterial(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  const openEditModal = (material: any) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name, sku: material.sku, category: material.category, quantity: material.quantity,
      unit: material.unit, minStock: material.minStock, unitCost: material.unitCost,
      supplier: material.supplier, supplierContact: material.supplierContact || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const url = editingMaterial ? `/api/materials/${editingMaterial.id}` : '/api/materials';
      const method = editingMaterial ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (data.success) {
        toast.success(editingMaterial ? 'Material updated' : 'Material added');
        fetchMaterials(inventoryFilter, searchQuery);
        setIsModalOpen(false); resetForm();
      } else toast.error(data.message);
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const handleStockUpdate = async () => {
    if (!stockUpdateMaterial) return;
    const newQuantity = Math.max(0, stockUpdateMaterial.quantity + stockDelta);
    try {
      const res = await fetch(`/api/materials/${stockUpdateMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Stock updated to ${newQuantity}`);
        fetchMaterials(inventoryFilter, searchQuery);
        setStockUpdateMaterial(null);
        setStockDelta(0);
      } else toast.error(data.message);
    } catch { toast.error('Failed to update stock'); }
  };

  const getStockStatus = (material: any) => {
    if (material.quantity === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 dark:bg-red-950/30' };
    if (material.quantity < material.minStock) return { label: 'Low Stock', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/30' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50 dark:bg-green-950/30' };
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);

  if (loading.materials) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track raw materials and components</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus size={18} /> Add Material
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <Package size={18} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{materials.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
            <AlertTriangle size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Inventory Value</p>
            <TrendingUp size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Categories</p>
            <Package size={18} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{categoryOptions.length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search materials..." className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <select value={inventoryFilter} onChange={(e) => setInventoryFilter(e.target.value)} className="h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All Categories</option>
          {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Materials Grid (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((material) => {
          const stockStatus = getStockStatus(material);
          return (
            <div key={material.id} className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {categoryOptions.find(c => c.value === material.category)?.icon || '📦'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{material.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{material.sku}</p>
                  </div>
                </div>
                <button onClick={() => openEditModal(material)} className="p-1.5 rounded-md hover:bg-muted transition-colors">
                  <Pencil size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Quantity</p>
                  <p className="font-medium text-foreground">{material.quantity.toLocaleString()} {material.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Min Stock</p>
                  <p className="font-medium text-foreground">{material.minStock.toLocaleString()} {material.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Unit Cost</p>
                  <p className="font-medium text-foreground">{formatCurrency(material.unitCost)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Supplier</p>
                  <p className="font-medium text-foreground truncate">{material.supplier}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.color}`}>{stockStatus.label}</span>
                <button onClick={() => { setStockUpdateMaterial(material); setStockDelta(0); }} className="text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full transition-colors">Update Stock</button>
              </div>
            </div>
          );
        })}
        {materials.length === 0 && (
          <div className="col-span-full text-center py-12 bg-card rounded-xl border border-dashed">
            <Package size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No materials found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{editingMaterial ? 'Edit Material' : 'Add New Material'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted"><X size={20} className="text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">Material Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-1 focus:ring-ring" required /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1.5">SKU *</label><input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-1 focus:ring-ring" required disabled={!!editingMaterial} /></div>
                <div><label className="block text-sm font-medium mb-1.5">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm">{categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1.5">Unit</label><input type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Quantity</label><input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Min Stock</label><input type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Unit Cost ($)</label><input type="number" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" min="0" step="0.01" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Supplier *</label><input type="text" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" required /></div>
                <div><label className="block text-sm font-medium mb-1.5">Supplier Contact</label><input type="text" value={formData.supplierContact} onChange={e => setFormData({...formData, supplierContact: e.target.value})} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm" /></div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingMaterial ? 'Update' : 'Add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {stockUpdateMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Update Stock</h3>
            <p className="text-sm text-muted-foreground mb-4">{stockUpdateMaterial.name} · Current: {stockUpdateMaterial.quantity} {stockUpdateMaterial.unit}</p>
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setStockDelta(prev => prev - 1)} className="w-10 h-10 rounded-full border border-input flex items-center justify-center hover:bg-muted"><Minus size={18} /></button>
              <span className="text-xl font-semibold text-foreground w-16 text-center">{stockDelta}</span>
              <button onClick={() => setStockDelta(prev => prev + 1)} className="w-10 h-10 rounded-full border border-input flex items-center justify-center hover:bg-muted"><PlusIcon size={18} /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">New quantity: {Math.max(0, stockUpdateMaterial.quantity + stockDelta)}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setStockUpdateMaterial(null)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleStockUpdate} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}