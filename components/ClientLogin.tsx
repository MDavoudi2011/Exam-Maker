'use client';

import React from 'react';
import { BrainCircuit, Loader2, ArrowRight } from 'lucide-react';
import { useClientLogin } from '@/hooks/useClientLogin';

export default function ClientLogin() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    otpCode,
    setOtpCode,
    loading,
    error,
    setError,
    mode,
    setMode,
    handleAuth,
    handleVerify
  } = useClientLogin();

  return (
    <div className="h-screen w-full overflow-hidden bg-muted/50 dark:bg-background flex items-center justify-center p-6 relative font-sans" dir="rtl">
 
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-card/70 dark:bg-background/70 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-white/40 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-[1.5rem] shadow-inner border border-primary/10 mb-5">
            <BrainCircuit className="w-8 h-8 text-primary drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground mb-2">هوشیار</h1>
          {mode !== 'verify' && (
            <p className="text-muted-foreground text-sm font-medium">پلتفرم هوشمند مدیریت آزمون</p>
          )}
        </div>

        {mode !== 'verify' ? (
          <>
            <div className="flex p-1 bg-muted/80 rounded-2xl mb-8 border border-border/50 /50">
              <button 
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-card shadow-sm text-foreground dark:text-white' : 'text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground'}`}
              >
                ورود
              </button>
              <button 
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-card shadow-sm text-foreground dark:text-white' : 'text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground'}`}
              >
                ثبت‌نام
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
              {error && (
                <div className="p-4 text-sm tracking-tight rounded-2xl font-medium bg-destructive/10 text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
 
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground dark:text-muted-foreground pr-1">آدرس ایمیل</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted/50/50 border border-border /50 px-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dir-ltr text-left h-14 font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground dark:text-muted-foreground pr-1">رمز عبور</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/50/50 border border-border /50 px-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dir-ltr text-left h-14 font-medium tracking-widest"
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
              <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">تایید ایمیل</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                کد تأیید ۶ رقمی به ایمیل <span className="text-foreground dir-ltr inline-block">{email}</span> ارسال شد.
              </p>
            </div>

            {error && (
              <div className="p-4 text-sm rounded-2xl font-medium bg-destructive/10 text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <input 
                type="text" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-muted/50/50 border border-border /50 px-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dir-ltr text-center font-bold text-2xl tracking-[0.5em] h-16"
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

            <button type="button" onClick={() => setMode('login')} className="w-full flex justify-center items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-bold mt-4">
              <ArrowRight className="w-4 h-4" />
              بازگشت به ورود
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
