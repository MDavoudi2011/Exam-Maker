import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';
import { AuthMode } from '@/types/auth.type';

export function useClientLogin() {
  const [email, setEmail] = useState('');
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
        const { error, data } = await authService.signUp({ email, password });
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
        type: 'signup',
      });
      
      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'کد وارد شده نامعتبر است یا منقضی شده.');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
