'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BrainCircuit, Loader2, ArrowRight } from 'lucide-react';

type Mode = 'login' | 'signup' | 'verify';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('login');
  
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
      } else if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If sign-up requires email confirmation, switch to verify mode
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
           setError('این ایمیل قبلاً ثبت شده است.');
        } else {
           setMode('verify');
        }
      }
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup',
      });
      
      if (error) throw error;
      
      // If verification is successful, reload to go to dashboard
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'کد وارد شده نامعتبر است یا منقضی شده.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative font-sans" dir="rtl">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-sky-400/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/40 dark:border-slate-800 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-[1.5rem] shadow-inner border border-primary/10 mb-5">
            <BrainCircuit className="w-8 h-8 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-2">هوشیار</h1>
          {mode !== 'verify' && (
             <p className="text-slate-500 text-sm font-medium">پلتفرم هوشمند مدیریت آزمون</p>
          )}
        </div>

        {mode !== 'verify' ? (
          <>
            <div className="flex p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl mb-8 border border-slate-200/50 dark:border-slate-700/50">
              <button 
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                ورود
              </button>
              <button 
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                ثبت‌نام
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {error && (
                <div className="p-4 text-sm tracking-tight rounded-2xl font-medium bg-red-50 text-red-600 border border-red-200/50">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-1">آدرس ایمیل</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 px-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dir-ltr text-left h-14 font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pr-1">رمز عبور</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 px-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dir-ltr text-left h-14 font-medium tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'ورود به داشبورد' : 'ساخت حساب کاربری')}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">تایید ایمیل</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  کد تأیید ۶ رقمی به ایمیل <span className="text-slate-800 dark:text-slate-200 dir-ltr inline-block">{email}</span> ارسال شد.
                </p>
             </div>

             {error && (
                <div className="p-4 text-sm rounded-2xl font-medium bg-red-50 text-red-600 border border-red-200/50">
                  {error}
                </div>
              )}

             <div className="space-y-2">
                <input 
                  type="text" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 px-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dir-ltr text-center font-bold text-2xl tracking-[0.5em] h-16"
                  placeholder="------"
                  maxLength={6}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || otpCode.length < 6}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تأیید کد و ورود'}
              </button>

              <button type="button" onClick={() => setMode('login')} className="w-full flex justify-center items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-bold mt-4">
                 <ArrowRight className="w-4 h-4" />
                 بازگشت به ورود
              </button>
          </form>
        )}
      </div>
    </div>
  );
}
