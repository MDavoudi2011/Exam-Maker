'use client';

import React from 'react';
import { ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
import { useClientLogin } from '@/hooks/useClientLogin';
import { Footer } from '@/components/Footer';

export default function ClientLogin() {
  const {
    email,
    setEmail,
    username,
    setUsername,
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
    handleVerify,
    handleGoogleLogin
  } = useClientLogin();

  return (
    <div className="min-h-screen w-full bg-muted/50 flex flex-col justify-between dark:bg-background font-sans overflow-x-hidden relative" dir="rtl">
      {/* Decorative Orbs */}
      <div className="fixed top-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none hidden md:block z-0"></div>
      <div className="fixed bottom-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none hidden md:block z-0"></div>

      <div className="w-full flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-4xl bg-card rounded-[2rem] shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 grid md:grid-cols-2 overflow-hidden border border-border">
        
        {/* Branding Side (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center justify-center p-12 bg-primary/5 text-center border-l border-border">
            <BrainCircuit className="w-24 h-24 text-primary mb-8" />
            <h1 className="text-4xl font-black text-foreground mb-4">هوشیار</h1>
            <p className="text-muted-foreground font-medium">پلتفرم هوشمند مدیریت آزمون</p>
        </div>

        {/* Form Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-8 md:hidden">
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
              <div className="flex p-1 bg-muted/80 rounded-2xl mb-8 border border-border/50">
                <button 
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  ورود
                </button>
                <button 
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  ثبت‌نام
                </button>
              </div>

              <form onSubmit={handleAuth} className="flex flex-col gap-5">
                {error && (
                  <div className="p-4 text-sm tracking-tight rounded-2xl font-medium bg-destructive/10 text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-foreground px-1">نام کاربری</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-muted/50 border border-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium dir-ltr text-left"
                      placeholder="MDavoudi"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-foreground px-1">
                    {mode === 'login' ? 'ایمیل یا نام کاربری' : 'آدرس ایمیل'}
                  </label>
                  <input 
                    type={mode === 'login' ? 'text' : 'email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted/50 border border-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dir-ltr text-left font-medium"
                    placeholder={mode === 'login' ? 'MDavoudi' : 'name@example.com'}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-foreground px-1">رمز عبور</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/50 border border-border px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dir-ltr text-left font-medium tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'ورود' : 'ساخت حساب')}
                  </button>
                </div>

                <div className="relative flex items-center my-[-4px]">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">یا</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-12 bg-card hover:bg-muted text-foreground border border-border font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-[0.98]"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  ادامه با گوگل
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-foreground mb-2">تایید ایمیل</h3>
                <p className="text-sm text-muted-foreground font-medium">کد ۶ رقمی به {email} ارسال شد.</p>
              </div>
              {error && <div className="p-4 text-sm rounded-2xl font-medium bg-destructive/10 text-destructive border border-destructive/20">{error}</div>}
              <input 
                type="text" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-muted/50 border border-border px-4 py-3 rounded-2xl outline-none font-bold text-2xl tracking-[0.5em] h-14 text-center"
                placeholder="------"
                maxLength={6}
                required
              />
              <button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all">تأیید</button>
              <button type="button" onClick={() => setMode('login')} className="w-full flex justify-center items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-bold">
                <ArrowRight className="w-4 h-4" /> بازگشت
              </button>
            </form>
          )}
        </div>
      </div>
      </div>
      
      <Footer className="border-none mt-auto" />
    </div>
  );
}
