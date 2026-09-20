'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleQuickFillDemo = () => {
    setIsLogin(true);
    setEmail('test@citrafoam.com');
    setPassword('citra123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign In Flow
        const res = await signIn('credentials', {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });

        if (res?.error) {
          setError('Invalid email or password. Please verify your credentials.');
          setIsLoading(false);
        } else {
          setSuccess('Signed in successfully! Redirecting...');
          setTimeout(() => {
            router.push(callbackUrl);
            router.refresh();
          }, 800);
        }
      } else {
        // Sign Up Flow
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email: email.trim().toLowerCase(),
            password,
            phone,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to create account. Please try again.');
          setIsLoading(false);
          return;
        }

        // Automatically sign in the newly registered user
        setSuccess('Account created! Signing you in...');
        const loginRes = await signIn('credentials', {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          // If automatic sign in failed, switch to login tab
          setIsLogin(true);
          setSuccess('Account created successfully! Please sign in with your password.');
          setIsLoading(false);
        } else {
          setTimeout(() => {
            router.push(callbackUrl);
            router.refresh();
          }, 800);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-porcelain flex flex-col items-center justify-center p-4">
      {/* Return Link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-graphite/60 hover:text-graphite transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
        <Link
          href="/account/orders"
          className="text-xs font-medium text-botanical-700 hover:underline"
        >
          Track Order as Guest
        </Link>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl shadow-glass p-8 border border-white/60">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-botanical-50 p-3.5 rounded-full mb-3 shadow-inner">
            <Leaf className="w-8 h-8 text-botanical-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-graphite">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-graphite/60 mt-1.5 text-sm font-sans text-center">
            {isLogin
              ? 'Sign in to access your orders, addresses & preferences'
              : 'Join Citrafoam for seamless reorders & carbon-neutral perks'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-full bg-graphite/5 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-full transition-all",
              isLogin ? "bg-white shadow-sm text-graphite" : "text-graphite/60 hover:text-graphite"
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-full transition-all",
              !isLogin ? "bg-white shadow-sm text-graphite" : "text-graphite/60 hover:text-graphite"
            )}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5 font-sans">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-graphite/10 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 outline-none transition-all font-sans text-sm"
                    required={!isLogin}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5 font-sans">
                    Phone Number <span className="text-graphite/40 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-graphite/10 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 outline-none transition-all font-sans text-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5 font-sans">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-graphite/10 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 outline-none transition-all font-sans text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-graphite/70 mb-1.5 font-sans">
              Password {isLogin ? '' : <span className="text-graphite/40 font-normal lowercase">(min. 6 characters)</span>}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-graphite/10 focus:border-botanical-500 focus:ring-2 focus:ring-botanical-200 outline-none transition-all font-sans text-sm"
              required
            />
          </div>

          {/* Feedback messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-botanical-600 hover:bg-botanical-700 text-white rounded-xl font-medium transition-all shadow-sm focus:ring-4 focus:ring-botanical-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLogin ? (isLoading ? 'Signing In...' : 'Sign In') : (isLoading ? 'Creating Account...' : 'Create Account')}</span>
          </button>
        </form>

        {/* Quick Demo Credentials */}
        {isLogin && (
          <div className="mt-6 pt-5 border-t border-graphite/10 flex flex-col items-center">
            <p className="text-xs text-graphite/60 mb-2">Want to test with a pre-seeded account?</p>
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="text-xs font-semibold text-botanical-700 hover:text-botanical-800 bg-botanical-50 hover:bg-botanical-100 px-3 py-1.5 rounded-full border border-botanical-200 transition-colors"
            >
              Quick-Fill: test@citrafoam.com
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-porcelain flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-botanical-600 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
