import { createClient } from '@/lib/supabase/client';

export const authService = {
  signIn: async ({ email, password }: any): Promise<{ data: any, error: any }> => {
    const supabase = createClient();
    let identifier = email;

    if (!identifier.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();
        
      if (data && data.email) {
        identifier = data.email;
      } else {
        return { data: null, error: new Error('نام کاربری یافت نشد') };
      }
    }

    return supabase.auth.signInWithPassword({ email: identifier, password });
  },
  signUp: async ({ email, username, password }: any): Promise<{ data: any, error: any }> => {
    const supabase = createClient();
    
    if (username) {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (data) {
        return { data: null, error: new Error('این نام کاربری از قبل ثبت شده است') };
      }
    }

    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { username }
      }
    });
  },
  verifyOtp: async ({ email, token }: any) => {
    const supabase = createClient();
    return supabase.auth.verifyOtp({ email, token, type: 'email' });
  },
  signInWithGoogle: async () => {
    const supabase = createClient();
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },
  resetPassword: async (email: string) => {
    const supabase = createClient();
    return supabase.auth.resetPasswordForEmail(email);
  },
  verifyRecoveryOtp: async ({ email, token }: any) => {
    const supabase = createClient();
    return supabase.auth.verifyOtp({ email, token, type: 'recovery' });
  },
  updatePassword: async (password: string) => {
    const supabase = createClient();
    return supabase.auth.updateUser({ password });
  },
  signOut: async () => {
    const supabase = createClient();
    return supabase.auth.signOut();
  },
  getUser: async () => {
    const supabase = createClient();
    return supabase.auth.getUser();
  }
};
