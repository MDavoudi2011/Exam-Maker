import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { AuthMode } from '@/types/auth.type';

const getPersianError = (error: any) => {
  if (!error) return 'خطایی رخ داد.';
  const msg = typeof error === 'string' ? error : (error.message || '');
  
  if (msg.includes('Invalid login credentials')) return 'ایمیل یا رمز عبور اشتباه است.';
  if (msg.includes('Email not confirmed')) return 'ایمیل تایید نشده است.';
  if (msg.includes('User already registered')) return 'این کاربر از قبل ثبت نام کرده است.';
  if (msg.includes('Password should be at least')) return 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
  if (msg.includes('Token has expired or is invalid') || msg.includes('OTP expired') || msg.includes('Invalid Token')) return 'کد وارد شده نامعتبر است یا منقضی شده.';
  if (msg.includes('rate_limit')) return 'درخواست‌های شما بیش از حد مجاز است. لطفا بعدا تلاش کنید.';
  if (msg.includes('نام کاربری یافت نشد') || msg.includes('این نام کاربری از قبل ثبت شده است')) return msg;
  
  return msg;
};

export function useClientLogin() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error } = await authService.signIn({ email, password });
        if (error) throw error;
        window.location.reload();
      } else if (mode === 'signup') {
        const { error, data } = await authService.signUp({ email, username, password });
        if (error) throw error;
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
           setError('این ایمیل قبلاً ثبت شده است.');
        } else {
           setMode('verify');
        }
      }
    } catch (err: any) {
      setError(getPersianError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await authService.verifyOtp({
        email,
        token: otpCode,
      });
      
      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      setError(getPersianError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await authService.resetPassword(email);
      if (error) throw error;
      setMode('reset_password_verify');
    } catch (err: any) {
      setError(getPersianError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await authService.verifyRecoveryOtp({
        email,
        token: otpCode,
      });
      
      if (error) throw error;
      setMode('reset_password_set');
    } catch (err: any) {
      setError(getPersianError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { error } = await authService.updatePassword(password);
      if (error) throw error;
      // Password updated successfully. They are usually logged in at this point if they verified OTP on the same device.
      window.location.reload();
    } catch (err: any) {
      setError(getPersianError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await authService.signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(getPersianError(err) || 'خطایی در ورود با گوگل رخ داد.');
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    otpCode,
    setOtpCode,
    loading,
    error,
    setError,
    mode,
    setMode,
    handleAuth,
    handleVerify,
    handleForgotPassword,
    handleVerifyResetOtp,
    handleResetPassword,
    handleGoogleLogin
  };
}
