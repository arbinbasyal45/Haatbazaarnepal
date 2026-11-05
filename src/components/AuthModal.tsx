import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useMarketplace();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, role);
      } else {
        await register(fullName, email, role);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
            HB
          </div>
          <h3 className="text-xl font-black font-serif text-stone-900 pt-1">
            {mode === 'login' ? 'Welcome to HaatBazaar' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-stone-500">
            {mode === 'login'
              ? 'Sign in to access your orders, wishlist, and discounts.'
              : 'Join thousands of shoppers and verified vendors across Nepal.'}
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-600">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-stone-700 mb-1">Your Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Adhikari"
                  className="w-full p-2.5 pl-9 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-emerald-700"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@nepalmail.com"
                className="w-full p-2.5 pl-9 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-emerald-700"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 pl-9 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-emerald-700"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-black py-3 rounded-xl text-xs transition-colors shadow-md shadow-emerald-900/10 disabled:opacity-50"
            >
              {mode === 'login' ? 'Sign In to HaatBazaar' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center text-[11px] text-stone-400 pt-1">
          By signing in you agree to HaatBazaar&apos;s Terms of Service and Privacy Policy for Nepal.
        </div>
      </div>
    </div>
  );
};
