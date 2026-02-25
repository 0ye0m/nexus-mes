'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Factory, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F6F8' }}>
      {/* Left Panel - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12"
        style={{ backgroundColor: '#1E293B' }}
      >
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
            <Factory size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            EV Manufacturing Management System
          </h1>
          <p className="text-slate-400 text-lg">
            Streamline your electric vehicle production with comprehensive tracking, 
            quality control, and performance analytics.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">1,247</div>
            <div className="text-slate-400 text-sm mt-1">Vehicles Produced</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">97.2%</div>
            <div className="text-slate-400 text-sm mt-1">Quality Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">4</div>
            <div className="text-slate-400 text-sm mt-1">Production Lines</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Factory size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#111827' }}>EV Manufacturing MIS</h1>
          </div>

          <div 
            className="rounded-lg p-8"
            style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Sign In</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>Enter your credentials to access the system</p>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#111827' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#2563EB' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm" style={{ color: '#6B7280' }}>Demo accounts:</p>
              <div className="mt-2 space-y-1 text-xs" style={{ color: '#6B7280' }}>
                <p><strong>Admin:</strong> john.mitchell@evmanufacturing.com</p>
                <p><strong>Production Manager:</strong> sarah.chen@evmanufacturing.com</p>
                <p><strong>Quality Inspector:</strong> michael.rodriguez@evmanufacturing.com</p>
                <p className="text-gray-400 mt-2">(Password: password123)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
