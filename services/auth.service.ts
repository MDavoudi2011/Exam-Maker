import { createClient } from '@/lib/supabase/client';

export const authService = {
  signIn: async ({ email, password }: any) => {
    const supabase = createClient();
    return supabase.auth.signInWithPassword({ email, password });
  },
  signUp: async ({ email, password }: any) => {
    const supabase = createClient();
    return supabase.auth.signUp({ email, password });
  },
  verifyOtp: async ({ email, token }: any) => {
    const supabase = createClient();
    return supabase.auth.verifyOtp({ email, token, type: 'email' });
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
