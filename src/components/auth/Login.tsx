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
    if (!result.success) setError(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-xl">
        {/* Left Panel - Branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-sidebar text-sidebar-foreground">
          <div className="max-w-md text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Factory size={40} className="text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4">EV Manufacturing Management System</h1>
            <p className="text-sidebar-foreground/70 text-lg">
              Streamline your electric vehicle production with comprehensive tracking,
              quality control, and performance analytics.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">1,247</div>
              <div className="text-sidebar-foreground/60 text-sm">Vehicles Produced</div>
            </div>
            <div>
              <div className="text-3xl font-bold">97.2%</div>
              <div className="text-sidebar-foreground/60 text-sm">Quality Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4</div>
              <div className="text-sidebar-foreground/60 text-sm">Production Lines</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 bg-card">
          <div className="lg:hidden text-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Factory size={32} className="text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">EV Manufacturing MIS</h1>
          </div>

          <div className="max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Sign In</h2>
            <p className="text-muted-foreground mb-6">Enter your credentials to access the system</p>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle size={16} className="text-destructive flex-shrink-0" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-4 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Demo accounts:</p>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p><strong>Admin:</strong> john.mitchell@evmanufacturing.com</p>
                <p><strong>Production Manager:</strong> sarah.chen@evmanufacturing.com</p>
                <p><strong>Quality Inspector:</strong> michael.rodriguez@evmanufacturing.com</p>
                <p className="text-muted-foreground/70 mt-2">(Password: password123)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}