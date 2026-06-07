'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.reload();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMode('login');
        setError('حساب کاربری با موفقیت ساخته شد، حالا وارد شوید.');
      }
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative font-sans" dir="rtl">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-sky-400/20 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-3xl shadow-inner border border-primary/10 mb-6">
            <BrainCircuit className="w-10 h-10 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-2">آزمون‌ساز هوشیار</h1>
          <p className="text-slate-500 text-sm font-medium">لطفاً برای ادامه {mode === 'login' ? 'وارد حساب خود شوید' : 'حساب کاربری بسازید'}.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className={`p-4 text-sm rounded-xl font-medium ${error.includes('موفقیت') ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 pr-1">ایمیل</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dir-ltr text-left h-12"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 pr-1">رمز عبور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dir-ltr text-left h-12"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'ورود به پنل' : 'ساخت حساب')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => {
               setMode(mode === 'login' ? 'signup' : 'login');
               setError('');
            }}
            className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
          >
            {mode === 'login' ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : 'قبلاً ثبت‌نام کرده‌اید؟ وارد شوید'}
          </button>
        </div>
      </div>
    </div>
  );
}
