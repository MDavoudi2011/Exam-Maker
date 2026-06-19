import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { AuthMode } from '@/types/auth.type';

export function useClientLogin() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      const { error } = await authService.verifyOtp({
        email,
        token: otpCode,
      });
      
      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'کد وارد شده نامعتبر است یا منقضی شده.');
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
      setError(err.message || 'خطایی در ورود با گوگل رخ داد.');
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
  };
}
