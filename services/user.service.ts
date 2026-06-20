import { createClient } from '@/lib/supabase/client';

export const userService = {
  getAllUsers: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not authenticated') };
    
    return supabase.from('profiles').select('id, email, role, created_at, username, display_name').order('created_at', { ascending: false });
  },

  updateUserRole: async (userId: string, newRole: string) => {
    const supabase = createClient();
    return supabase.rpc('admin_update_user_role', { target_user_id: userId, new_role: newRole });
  },

  deleteUser: async (userId: string) => {
    const supabase = createClient();
    return supabase.rpc('admin_delete_user', { target_user_id: userId });
  },

  updateUserPassword: async (userId: string, newPassword: string) => {
    const supabase = createClient();
    return supabase.rpc('admin_update_user_password', { target_user_id: userId, new_password: newPassword });
  }
};
