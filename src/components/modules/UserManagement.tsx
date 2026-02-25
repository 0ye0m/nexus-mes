'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'production_manager', label: 'Production Manager' },
  { value: 'quality_inspector', label: 'Quality Inspector' },
];

export default function UserManagement() {
  const { users, fetchUsers, loading } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'production_manager',
    status: 'active',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'production_manager',
      status: 'active',
      password: '',
    });
    setEditingUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('User updated successfully');
          fetchUsers();
        } else {
          toast.error(data.message || 'Failed to update user');
        }
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, password: formData.password || 'password123' }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success('User added successfully');
          fetchUsers();
        } else {
          toast.error(data.message || 'Failed to add user');
        }
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch {
      toast.error('Failed to delete user');
    }
    setDeleteConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        Inactive
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700',
      production_manager: 'bg-blue-100 text-blue-700',
      quality_inspector: 'bg-orange-100 text-orange-700',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-700'}`}>
        {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  if (loading.users) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Manage system users and their roles</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700"
          style={{ backgroundColor: '#2563EB' }}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Created</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#E5E7EB' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#111827' }}>{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: '#6B7280' }}>{user.email}</td>
                <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#6B7280' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} style={{ color: '#6B7280' }} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
                      className="p-1.5 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} style={{ color: '#DC2626' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: '#6B7280' }}>No users found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#E5E7EB' }}>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, users.length)} of {users.length} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    currentPage === i + 1 ? 'text-white' : 'hover:bg-gray-100'
                  }`}
                  style={{ backgroundColor: currentPage === i + 1 ? '#2563EB' : 'transparent', color: currentPage === i + 1 ? 'white' : '#6B7280' }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} style={{ color: '#6B7280' }} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: '#D1D5DB' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: '#D1D5DB' }}
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    style={{ borderColor: '#D1D5DB' }}
                    placeholder="Leave empty for default: password123"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: '#D1D5DB' }}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ borderColor: '#D1D5DB' }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#D1D5DB', color: '#374151' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-blue-700 disabled:opacity-50"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  {isSubmitting ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#111827' }}>Delete User</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#D1D5DB', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:bg-red-600"
                style={{ backgroundColor: '#DC2626' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
