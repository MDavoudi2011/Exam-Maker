'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, LayoutDashboard, List, LogOut, BarChart3, ChevronRight, Users, Database, Menu, X, Moon, Sun } from 'lucide-react';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ExamsTab } from '@/components/dashboard/ExamsTab';
import { ReportsTab } from '@/components/dashboard/ReportsTab';
import { UsersPerformanceTab } from '@/components/dashboard/UsersPerformanceTab';
import { QuestionBankTab } from '@/components/dashboard/QuestionBankTab';
import { UserManagementTab } from '@/components/dashboard/UserManagementTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Exam } from '@/types/exam.type';

export default function AdminDashboard({ user, initialExams, userRole = 'admin', initialTab = 'overview', initialParam = null }: { user: any, initialExams: any[], userRole?: string, initialTab?: string, initialParam?: string | null }) {
  const {
    activeTab,
    navParam,
    exams,
    handleNavigate,
    refreshExams,
    handleLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isDarkMode,
    toggleDarkMode,
    handleTabClick
  } = useClientDashboard(initialTab, initialParam, initialExams);

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative overflow-hidden" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
      <div className="absolute top-64 -right-64 w-[500px] h-[500px] bg-emerald-400/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex shrink-0 items-center justify-between p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -mr-1 text-slate-700 dark:text-slate-200" aria-label="Open Menu">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-1.5 rounded-xl border border-emerald-500/10">
              <BrainCircuit className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-600">پنل مدیریت</h2>
          </div>
        </div>
        
        <button
           onClick={toggleDarkMode}
           className="relative flex items-center w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors p-1"
        >
           <div className={`absolute top-1 max-w-full w-4 h-4 rounded-full bg-white dark:bg-slate-800 shadow-sm transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-0' : '-translate-x-6'}`}>
              {isDarkMode ? <Moon className="w-2.5 h-2.5 text-indigo-500" /> : <Sun className="w-2.5 h-2.5 text-yellow-500" />}
           </div>
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 right-0 w-72 bg-white/95 md:bg-white/70 dark:bg-slate-900/95 dark:md:bg-slate-900/70 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col z-50 md:z-10 shadow-2xl md:shadow-none h-full transition-transform duration-300 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-2.5 rounded-2xl shadow-inner border border-emerald-500/10">
              <BrainCircuit className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-600">پنل مدیریت</h2>
              <p className="text-xs text-slate-500 font-medium tracking-tight">هوشیار</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="hidden md:block">
            <button
               onClick={toggleDarkMode}
               className="relative flex items-center w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors p-1"
            >
               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-800 shadow-sm transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-0' : '-translate-x-6'}`}>
                  {isDarkMode ? <Moon className="w-2.5 h-2.5 text-indigo-500" /> : <Sun className="w-2.5 h-2.5 text-yellow-500" />}
               </div>
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 focus:outline-none overflow-y-auto pr-2 custom-scrollbar">
          <NavItem active={activeTab === 'overview'} onClick={() => handleTabClick('overview')} icon={<LayoutDashboard />} label="داشبورد" />
          <NavItem active={activeTab === 'exams'} onClick={() => handleTabClick('exams')} icon={<List />} label="همه آزمون‌ها" />
          <NavItem active={activeTab === 'reports'} onClick={() => handleTabClick('reports')} icon={<BarChart3 />} label="گزارش‌ها و نتایج" />
          <NavItem active={activeTab === 'users'} onClick={() => handleTabClick('users')} icon={<Users />} label="تحلیل عملکرد سیستم" />
          <NavItem active={activeTab === 'user-management'} onClick={() => handleTabClick('user-management')} icon={<Users />} label="مدیریت کاربران" />
          <NavItem active={activeTab === 'question-bank'} onClick={() => handleTabClick('question-bank')} icon={<Database />} label="بانک سوالات" />
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
           <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 mb-4 border border-emerald-100 dark:border-emerald-800/30">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-900">
               {user?.email?.charAt(0).toUpperCase() || 'A'}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{user?.email}</p>
               <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">مدیر کل سیستم</p>
             </div>
           </div>

           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent">
            <LogOut className="w-4 h-4" />
            <span>خروج از سیستم</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 lg:pr-8 overflow-y-auto z-10 relative">
        <div className="max-w-7xl mx-auto pb-10">
          {activeTab === 'overview' && <OverviewTab initialExams={exams} onNavigate={handleNavigate} />}
          {activeTab === 'exams' && <ExamsTab initialExams={exams} onNavigate={handleNavigate} onDataChanged={refreshExams} initialSearchTerm={navParam || ''} isAdmin={true} />}
          {activeTab === 'reports' && <ReportsTab initialExams={exams} initialSelectedExamId={navParam} />}
          {activeTab === 'users' && <UsersPerformanceTab initialExams={exams} />}
          {activeTab === 'user-management' && <UserManagementTab onNavigate={handleNavigate} onDataChanged={refreshExams} />}
          {activeTab === 'question-bank' && <QuestionBankTab userRole={userRole} />}
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
        active 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 translate-x-1' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <div className={`transition-colors [&>svg]:w-5 [&>svg]:h-5 ${active ? 'opacity-100' : 'text-slate-400 group-hover:text-emerald-600'}`}>
        {icon}
      </div>
      <span className="flex-1 text-right">{label}</span>
      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
    </button>
  );
}
