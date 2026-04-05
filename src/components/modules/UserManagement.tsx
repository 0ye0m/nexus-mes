'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, Trash2, X, Loader2, Users, Shield, UserCheck, Mail, Calendar, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const roleOptions = [
  { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', icon: Shield },
  { value: 'production_manager', label: 'Production Manager', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Users },
  { value: 'quality_inspector', label: 'Quality Inspector', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: UserCheck },
];

export default function UserManagement() {
  const { users, fetchUsers, loading } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'production_manager', status: 'active', password: '' });

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const managerCount = users.filter(u => u.role === 'production_manager').length;

  const resetForm = () => { setFormData({ name: '', email: '', role: 'production_manager', status: 'active', password: '' }); setEditingUser(null); };
  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  const openEditModal = (user: any) => { setEditingUser(user); setFormData({ name: user.name, email: user.email, role: user.role, status: user.status, password: '' }); setIsModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true);
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser ? formData : { ...formData, password: formData.password || 'password123' };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { toast.success(editingUser ? 'User updated' : 'User added'); fetchUsers(); setIsModalOpen(false); resetForm(); }
      else toast.error(data.message);
    } catch { toast.error('Error occurred'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { toast.success('User deleted'); fetchUsers(); } else toast.error(data.message);
    } catch { toast.error('Failed to delete'); }
    setDeleteConfirm(null);
  };

  const getRoleBadge = (role: string) => {
    const found = roleOptions.find(r => r.value === role);
    const Icon = found?.icon || Shield;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${found?.color || 'bg-gray-100 text-gray-700'}`}>
        <Icon size={12} />
        {found?.label || role}
      </span>
    );
  };

  if (loading.users) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their roles</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <Users size={18} className="text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{totalUsers}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Active</p>
            <UserCheck size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{activeUsers}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Admins</p>
            <Shield size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{adminCount}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Managers</p>
            <Users size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{managerCount}</p>
        </div>
      </div>

      {/* Users Grid - Perfect Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
        {users.map((user) => (
          <div
            key={user.id}
            className="group bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
          >
            <div className="p-5 flex-1 flex flex-col">
              {/* Header: Avatar + Name + Email + Edit button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-base shadow-inner flex-shrink-0">
                    {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground truncate" title={user.name}>
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail size={12} className="text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground truncate" title={user.email}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openEditModal(user)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                  title="Edit"
                >
                  <Pencil size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Badges Row */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {getRoleBadge(user.role)}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Footer: Joined date + Delete button */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => setDeleteConfirm(user.id)}
                  className="text-red-500 hover:text-red-700 p-1 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="col-span-full text-center py-16 bg-card rounded-xl border border-dashed">
            <Users size={48} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No users found. Click "Add User" to create one.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-muted transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Leave empty for default: password123"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
                  {isSubmitting ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Delete User</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-input text-foreground text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}