import React from 'react';
import { User, Shield, ShieldAlert, Trash2, KeyRound, Loader2, Eye, LayoutDashboard, BrainCircuit, Users } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { toFarsiNumber } from '@/utils/text.util';

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            مدیریت کاربران
          </h2>
          <p className="text-slate-500 font-medium mt-2">مشاهده، ویرایش نقش‌ها و تغییر رمز عبور کاربران سیستم</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          <table className="w-full text-right border-collapse min-w-max md:min-w-[800px] z-10 relative">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs md:text-sm border-y border-slate-100 dark:border-slate-800">
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold w-16 text-center">ردیف</th>
                <th className="p-3 md:p-4 font-semibold text-right">تلفن یا ایمیل کاربری</th>
                <th className="p-3 md:p-4 font-semibold text-center w-32 md:w-40 text-nowrap">تاریخ ثبت‌نام</th>
                <th className="p-3 md:p-4 font-semibold text-center w-32 md:w-36">نقش</th>
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center w-32 md:w-40">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs md:text-sm">
              {loading ? (
                <tr>
                   <td colSpan={5} className="p-16 text-center">
                     <div className="flex justify-center items-center">
                       <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                     </div>
                   </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 m-4 block w-auto">
                    {error}
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u, index) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-3 md:p-4 px-4 md:px-6 font-medium text-slate-600 dark:text-slate-400 text-center">{toFarsiNumber(index + 1)}</td>
                    <td className="p-3 md:p-4 font-bold text-slate-800 dark:text-slate-200 text-right" dir="ltr">{u.email || u.id}</td>
                    <td className="p-3 md:p-4 text-slate-500 text-[10px] md:text-sm text-center whitespace-nowrap" dir="ltr">
                      {u.created_at ? toFarsiNumber(new Date(u.created_at).toLocaleString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' })) : '-'}
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <button 
                        onClick={() => toggleRole(u)}
                        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                          u.role === 'admin' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 cursor-pointer hover:bg-emerald-200' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 cursor-pointer hover:bg-slate-200'
                        }`}
                      >
                        {u.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}
                      </button>
                    </td>
                    <td className="p-2 md:p-4 px-4 md:px-6 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center gap-1 opacity-100 md:opacity-70 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onNavigate('exams', u.id)}
                          className="p-1.5 md:p-2 bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-sky-500/10 dark:hover:text-sky-400 rounded-lg md:rounded-xl transition-all shadow-sm tooltip-trigger"
                          title="مشاهده آزمون‌ها"
                        >
                          <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button 
                          onClick={() => openPasswordModal(u)}
                          className="p-1.5 md:p-2 bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-orange-500/10 dark:hover:text-orange-400 rounded-lg md:rounded-xl transition-all shadow-sm tooltip-trigger"
                          title="تغییر رمز عبور"
                        >
                          <KeyRound className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 md:p-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg md:rounded-xl transition-all shadow-sm tooltip-trigger"
                          title="حذف کاربر"
                          disabled={actionLoading}
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-4">
                      <Users className="w-12 h-12 text-slate-300 mb-4" />
                      <h3 className="font-bold text-lg text-slate-400 dark:text-slate-500">هنوز کاربری ثبت نشده است.</h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {passwordModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <KeyRound className="w-6 h-6 text-orange-500" />
                تغییر رمز عبور
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">رمز عبور جدید</label>
                  <input 
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                    placeholder="حداقل ۶ کاراکتر"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setPasswordModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
