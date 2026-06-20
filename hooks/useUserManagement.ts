/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from 'react';
import { userService } from '@/services/user.service';

export function useUserManagement(onDataChanged?: () => void) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await userService.getAllUsers();
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت لیست کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (user: any) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      // Optimistic update
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      
      const { error } = await userService.updateUserRole(user.id, newRole);
      if (error) throw error;
      
      // No need to dispatch to setUsers again unless successful but optimistic covers it
    } catch (err) {
      console.error("Failed to update role:", err);
      // Revert on faillure
      setUsers(users.map(u => u.id === user.id ? { ...u, role: user.role } : u));
      alert('خطا در تغییر نقش کاربر');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('آیا از حذف این کاربر اطمینان دارید؟ تمامی اطلاعات مرتبط از جمله آزمون‌ها حذف خواهند شد.')) return;
    
    setActionLoading(true);
    try {
      const { error } = await userService.deleteUser(userId);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== userId));
      if (onDataChanged) onDataChanged();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'خطا در حذف کاربر');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedUser || !newPassword || newPassword.length < 6) {
      alert('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    
    setActionLoading(true);
    try {
      const { error } = await userService.updateUserPassword(selectedUser.id, newPassword);
      if (error) throw error;
      alert('رمز عبور با موفقیت تغییر کرد');
      setPasswordModalOpen(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'خطا در تغییر رمز عبور');
    } finally {
      setActionLoading(false);
    }
  };

  const openPasswordModal = (user: any) => {
    setSelectedUser(user);
    setNewPassword('');
    setPasswordModalOpen(true);
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const p = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.email?.toLowerCase().includes(p) || 
        u.display_name?.toLowerCase().includes(p) ||
        u.username?.toLowerCase().includes(p)
      );
    }

    if (selectedRole !== 'all') {
      result = result.filter(u => u.role === selectedRole);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'date') {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        comparison = da - db;
      } else if (sortKey === 'role') {
        if (a.role === b.role) comparison = 0;
        else comparison = a.role === 'admin' ? 1 : -1;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [users, searchTerm, selectedRole, sortKey, sortDirection]);

  return {
    users,
    filteredUsers,
    loading,
    error,
    actionLoading,
    passwordModalOpen,
    setPasswordModalOpen,
    selectedUser,
    newPassword,
    setNewPassword,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    isRoleDropdownOpen,
    setIsRoleDropdownOpen,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    toggleRole,
    handleDeleteUser,
    handlePasswordChange,
    openPasswordModal
  };
}
