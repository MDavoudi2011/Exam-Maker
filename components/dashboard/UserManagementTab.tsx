import React, { useState, useMemo, useRef } from 'react';
import { User, Shield, ShieldAlert, Trash2, KeyRound, Loader2, Eye, LayoutDashboard, BrainCircuit, Users, ArrowUpDown } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { toFarsiNumber } from '@/utils/text.util';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { ActionButton, ActionButtonGroup } from '@/components/ui/ActionButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { SortDropdown } from '@/components/ui/SortDropdown';

export function UserManagementTab({ onNavigate, onDataChanged }: { onNavigate: (tab: string, param?: string) => void, onDataChanged?: () => void }) {
  const {
    users,
    loading,
    error,
    actionLoading,
    passwordModalOpen,
    setPasswordModalOpen,
    selectedUser,
    newPassword,
    setNewPassword,
    toggleRole,
    handleDeleteUser,
    handlePasswordChange,
    openPasswordModal
  } = useUserManagement(onDataChanged);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortKey, setSortKey] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <SectionHeader icon={Users} title="مدیریت کاربران" description="مشاهده، ویرایش نقش‌ها و تغییر رمز عبور کاربران سیستم" />
      </div>

      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="جستجو در ایمیل‌ها..." />
          </div>
          
          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
            <FilterDropdown
              value={selectedRole}
              options={[
                { value: 'all', label: 'همه نقش‌ها' },
                { value: 'admin', label: 'مدیران سیستم' },
                { value: 'user', label: 'کاربران عادی' }
              ]}
              onChange={setSelectedRole}
              isOpen={isRoleDropdownOpen}
              onToggle={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              onClose={() => setIsRoleDropdownOpen(false)}
            />
            
            <SortDropdown
              value={sortKey}
              direction={sortDirection}
              options={[
                { value: 'date', label: 'تاریخ ثبت‌نام' },
                { value: 'role', label: 'بر اساس نقش' }
              ]}
              onChange={setSortKey}
              onDirectionToggle={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              isOpen={isSortDropdownOpen}
              onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              onClose={() => setIsSortDropdownOpen(false)}
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          <table className={`w-full text-right border-collapse z-10 relative ${filteredUsers.length > 0 ? 'min-w-max md:min-w-[800px]' : 'min-w-full'}`}>
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs md:text-sm border-y border-border dark:border-border">
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold w-16 text-center">ردیف</th>
                <th className="p-3 md:p-4 font-semibold text-right">ایمیل</th>
                <th className="p-3 md:p-4 font-semibold text-center w-32 md:w-40 text-nowrap">تاریخ ثبت‌نام</th>
                <th className="p-3 md:p-4 font-semibold text-center w-32 md:w-36">نقش</th>
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-32 md:w-40">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border  text-xs md:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-destructive bg-destructive/10 rounded-2xl border border-destructive/20 m-4 block w-auto">
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u, index) => (
                  <tr key={u.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="p-3 md:p-4 px-4 md:px-6 font-medium text-muted-foreground dark:text-muted-foreground text-center">{toFarsiNumber(index + 1)}</td>
                    <td className="p-3 md:p-4 font-bold text-foreground text-right" dir="ltr">{u.email || u.id}</td>
                    <td className="p-3 md:p-4 text-muted-foreground text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">
                      {u.created_at ? toFarsiNumber(new Date(u.created_at).toLocaleString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <button 
                        onClick={() => toggleRole(u)}
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                          u.role === 'admin' 
                            ? 'bg-success/10 text-success cursor-pointer hover:bg-success/20' 
                            : 'bg-muted text-muted-foreground cursor-pointer hover:bg-secondary'
                        }`}
                      >
                        {u.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}
                      </button>
                    </td>
                    <td className="p-2 md:p-4 px-4 md:px-6 text-center whitespace-nowrap">
                      <ActionButtonGroup>
                        <ActionButton 
                          onClick={() => onNavigate('exams', u.id)}
                          icon={Eye}
                          title="مشاهده آزمون‌ها"
                          color="sky"
                        />
                        <ActionButton 
                          onClick={() => openPasswordModal(u)}
                          icon={KeyRound}
                          title="تغییر رمز عبور"
                          color="amber"
                        />
                        <ActionButton 
                          onClick={() => handleDeleteUser(u.id)}
                          icon={Trash2}
                          title="حذف کاربر"
                          color="rose"
                          disabled={actionLoading}
                        />
                      </ActionButtonGroup>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 md:px-6 py-8">
                    <EmptyState icon={Users} title="هنوز کاربری ثبت نشده است." description="" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {passwordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card dark:bg-background w-full max-w-md rounded-3xl shadow-2xl border border-border dark:border-border overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <KeyRound className="w-6 h-6 text-orange-500" />
                تغییر رمز عبور
              </h3>
 
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-muted-foreground mb-2">رمز عبور جدید</label>
                  <input 
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-muted/50 border border-border dark:border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground "
                    placeholder="حداقل ۶ کاراکتر"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
 
            <div className="p-4 bg-muted/50 flex items-center justify-end gap-3 border-t border-border dark:border-border">
              <button 
                onClick={() => setPasswordModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-muted-foreground dark:text-muted-foreground hover:bg-muted rounded-xl transition-colors"
                disabled={actionLoading}
              >
                انصراف
              </button>
              <button 
                onClick={handlePasswordChange}
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                disabled={actionLoading || !newPassword || newPassword.length < 6}
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
