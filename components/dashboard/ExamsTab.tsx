'use client';
import React from 'react';
import { Search, Play, Edit, Trash, Plus, FileText, BarChart2, List, ChevronDown } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { useExamsTab } from '@/hooks/useExamsTab';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { ActionButton, ActionButtonGroup } from '@/components/ui/ActionButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function ExamsTab({ initialExams, onNavigate, onDataChanged, initialSearchTerm = '', isAdmin = false }: { initialExams: any[], onNavigate: (tab: string, param?: string) => void, onDataChanged: () => void, initialSearchTerm?: string, isAdmin?: boolean }) {
  const {
    exams,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedCreator,
    setSelectedCreator,
    showStatusDropdown,
    setShowStatusDropdown,
    showCreatorDropdown,
    setShowCreatorDropdown,
    dropdownRef,
    creatorDropdownRef,
    handleDelete,
    toggleStatus,
    getStatus,
    filteredExams,
    creators
  } = useExamsTab(initialExams, onDataChanged, initialSearchTerm);

  const statusOptions = [
    { value: 'all', label: 'همه وضعیت‌ها', count: exams.length },
    { value: 'active', label: 'در حال اجرا', count: exams.filter(e => getStatus(e) === 'active').length },
    { value: 'inactive', label: 'غیر فعال', count: exams.filter(e => getStatus(e) === 'inactive').length },
  ];

  const creatorOptions = [
    { value: 'all', label: 'همه سازندگان', count: exams.length },
    ...(creators?.map(c => ({ value: c.id, label: c.name, count: c.count })) || [])
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionHeader icon={List} title="لیست آزمون‌ها" description="مدیریت و بررسی آزمون‌های ایجاد شده" />
      </div>

      <DashboardCard>
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-20 w-full">
          <div className="relative flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="جستجو در آزمون‌ها..." />
          </div>
 
          <div className="flex flex-row items-center gap-4 w-full md:w-auto shrink-0 z-10">
            <FilterDropdown
              value={selectedStatus}
              options={statusOptions}
              onChange={(v) => setSelectedStatus(v as "all" | "active" | "inactive")}
              isOpen={showStatusDropdown}
              onToggle={() => setShowStatusDropdown(!showStatusDropdown)}
              onClose={() => setShowStatusDropdown(false)}
            />

            {isAdmin && (
              <FilterDropdown
                value={selectedCreator}
                options={creatorOptions}
                onChange={setSelectedCreator}
                isOpen={showCreatorDropdown}
                onToggle={() => setShowCreatorDropdown(!showCreatorDropdown)}
                onClose={() => setShowCreatorDropdown(false)}
              />
            )}
 
            {!isAdmin && (
              <PrimaryButton onClick={() => onNavigate('create')} icon={<Plus className="w-4 h-4 md:w-5 md:h-5" />}>
                <span className="hidden sm:inline">ساخت آزمون جدید</span>
                <span className="sm:hidden inline">آزمون جدید</span>
              </PrimaryButton>
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:-mx-6 pb-2 md:pb-4">
          <table className={`w-full text-right border-collapse z-10 relative ${filteredExams.length > 0 ? 'min-w-max md:min-w-[800px]' : 'min-w-full'}`}>
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs md:text-sm border-y border-border dark:border-border">
                <th className={`p-3 md:p-4 px-4 md:px-6 font-semibold ${isAdmin ? 'w-40 md:w-48' : 'min-w-[200px] md:w-2/5'}`}>عنوان آزمون</th>
                {isAdmin && <th className="p-3 md:p-4 font-semibold text-center min-w-[120px] md:w-1/3">سازنده</th>}
                <th className="p-3 md:p-4 font-semibold text-center w-24 md:w-32 whitespace-nowrap">وضعیت</th>
                <th className="p-3 md:p-4 font-semibold text-center w-20 md:w-28">سوالات</th>
                <th className="p-3 md:p-4 font-semibold text-center w-20 md:w-28">زمان</th>
                <th className="p-3 md:p-4 font-semibold w-24 md:w-32 text-center whitespace-nowrap">تاریخ ایجاد</th>
                <th className="p-3 md:p-4 px-4 md:px-6 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border  text-xs md:text-sm">
              {filteredExams.map((exam) => {
                const status = getStatus(exam);
                const creatorName = exam.profiles?.display_name || exam.profiles?.username || exam.profiles?.email?.split('@')[0] || 'نامشخص';
                return (
                  <tr key={exam.id} className="hover:bg-muted/50 transition-colors group">
                    <td className={`p-3 md:p-4 px-4 md:px-6 font-bold text-foreground ${isAdmin ? 'max-w-[150px] truncate' : ''}`} title={isAdmin ? exam.title : undefined}>{exam.title}</td>
                    {isAdmin && (
                      <td className="p-3 md:p-4 text-center text-muted-foreground font-medium truncate max-w-[200px]" title={creatorName}>
                        {creatorName}
                      </td>
                    )}
                    <td className="p-2 md:p-4 text-center whitespace-nowrap">
                      <button onClick={() => toggleStatus(exam)} disabled={loading} className="w-full">
                        <StatusBadge status={status} trueLabel="در حال اجرا" falseLabel="غیر فعال" />
                      </button>
                    </td>
                    <td className="p-3 md:p-4 font-medium text-muted-foreground dark:text-muted-foreground text-center">
                      {toFarsiNumber(exam.exam_questions?.[0]?.count || 0)}
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <span className="bg-muted px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold text-muted-foreground dark:text-muted-foreground">
                        {toFarsiNumber(exam.time_limit_minutes || 0)}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-[10px] md:text-sm text-muted-foreground text-center whitespace-nowrap">
                      {toFarsiNumber(new Date(exam.created_at).toLocaleDateString('fa-IR'))}
                    </td>
                    <td className="p-2 md:p-4 px-3 md:px-6 text-center whitespace-nowrap">
                      <ActionButtonGroup>
                        <ActionButton onClick={() => window.open(`/view/${exam.id}`, '_blank')} icon={Play} title="پیش‌نمایش" color="sky" />
                        <ActionButton onClick={() => onNavigate('edit', exam.id)} icon={Edit} title="ویرایش" color="amber" />
                        <ActionButton onClick={() => onNavigate('reports', exam.id)} icon={BarChart2} title="مشاهده نتایج" color="indigo" />
                        <ActionButton onClick={() => handleDelete(exam.id)} disabled={loading} icon={Trash} title="حذف" color="rose" />
                      </ActionButtonGroup>
                    </td>
                  </tr>
                );
              })}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-4 md:px-6 py-8">
                    {exams.length > 0 ? (
                      <EmptyState icon={Search} title="آزمونی پیدا نشد." description="با تغییر عبارات جستجو دوباره امتحان کنید" />
                    ) : (
                      <EmptyState 
                        icon={FileText} 
                        title="هنوز هیچ آزمونی ساخته نشده است." 
                        description="" 
                        action={!isAdmin && <button onClick={() => onNavigate('create')} className="mt-4 text-primary hover:underline text-sm font-bold">همین الان اولین آزمون را بسازید</button>} 
                      />
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}


