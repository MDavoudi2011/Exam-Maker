'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, LayoutDashboard, List, LogOut, BarChart3, ChevronRight, Users, Database, Menu, X, Moon, Sun, PlusCircle } from 'lucide-react';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ExamsTab } from '@/components/dashboard/ExamsTab';
import { CreateTab } from '@/components/dashboard/CreateTab';
import { ExamEditor } from '@/components/dashboard/ExamEditor';
import { ReportsTab } from '@/components/dashboard/ReportsTab';
import { UsersPerformanceTab } from '@/components/dashboard/UsersPerformanceTab';
import { QuestionBankTab } from '@/components/dashboard/QuestionBankTab';
import { UserManagementTab } from '@/components/dashboard/UserManagementTab';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Exam } from '@/types/exam.type';
import { Footer } from '@/components/Footer';

export default function AdminDashboard({ user, initialExams, userRole = 'admin', initialTab = 'overview', initialParam = null, initialExam, initialQuestions }: { user: any, initialExams: any[], userRole?: string, initialTab?: string, initialParam?: string | null, initialExam?: any, initialQuestions?: any[] }) {
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
  } = useClientDashboard(initialTab, initialParam, initialExams, true);

  return (
    <div className="h-screen w-full bg-muted/50 dark:bg-background font-sans text-foreground flex flex-col relative overflow-hidden" dir="rtl">
      <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row relative">
 
      {/* Background Decor */}
      <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
      <div className="absolute top-64 -right-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex shrink-0 items-center justify-between p-4 bg-card/70 dark:bg-background/70 backdrop-blur-xl border-b border-border z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -mr-1 text-foreground " aria-label="Open Menu">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 rounded-xl border border-primary/10">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/70">پنل مدیریت</h2>
          </div>
        </div>
 
        <button
          onClick={toggleDarkMode}
          className="relative flex items-center w-12 h-6 rounded-full bg-secondary transition-colors p-1"
        >
          <div className={`absolute top-1 max-w-full w-4 h-4 rounded-full bg-card shadow-sm transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-0' : '-translate-x-6'}`}>
            {isDarkMode ? <Moon className="w-2.5 h-2.5 text-primary" /> : <Sun className="w-2.5 h-2.5 text-warning" />}
          </div>
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 right-0 w-72 bg-card/95 md:bg-card/70 dark:bg-background/95 dark:md:bg-background/70 backdrop-blur-2xl border-l border-border p-6 flex flex-col z-50 md:z-10 shadow-2xl md:shadow-none h-full transition-transform duration-300 shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-2.5 rounded-2xl shadow-inner border border-primary/10">
              <BrainCircuit className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/70">پنل مدیریت</h2>
              <p className="text-xs text-muted-foreground font-medium tracking-tight">آزمون‌ساز هوشیار</p>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 text-muted-foreground bg-muted rounded-xl hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
 
          <div className="hidden md:block">
            <button
              onClick={toggleDarkMode}
              className="relative flex items-center w-12 h-6 rounded-full bg-secondary transition-colors p-1"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-card shadow-sm transition-transform duration-300 flex items-center justify-center ${isDarkMode ? 'translate-x-0' : '-translate-x-6'}`}>
                {isDarkMode ? <Moon className="w-2.5 h-2.5 text-primary" /> : <Sun className="w-2.5 h-2.5 text-warning" />}
              </div>
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 focus:outline-none overflow-y-auto pr-2 custom-scrollbar">
          <NavItem active={activeTab === 'overview'} onClick={() => handleTabClick('overview')} icon={<LayoutDashboard />} label="داشبورد" />
          <NavItem active={activeTab === 'exams'} onClick={() => handleTabClick('exams')} icon={<List />} label="همه آزمون‌ها" />
          <NavItem active={activeTab === 'create'} onClick={() => handleTabClick('create')} icon={<PlusCircle />} label="ساخت آزمون" />
          <NavItem active={activeTab === 'reports'} onClick={() => handleTabClick('reports')} icon={<BarChart3 />} label="گزارش‌ها و نتایج" />
          <NavItem active={activeTab === 'users'} onClick={() => handleTabClick('users')} icon={<Users />} label="عملکرد کاربران" />
          <NavItem active={activeTab === 'user-management'} onClick={() => handleTabClick('user-management')} icon={<Users />} label="مدیریت کاربران" />
          <NavItem active={activeTab === 'question-bank'} onClick={() => handleTabClick('question-bank')} icon={<Database />} label="بانک سوالات" />
        </nav>

        <div className="mt-6 pt-6 border-t border-border space-y-2 shrink-0">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-primary/10 mb-4 border border-primary/20">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-md ring-2 ring-background ">
              {(user?.user_metadata?.display_name || user?.user_metadata?.username || user?.email)?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-foreground dir-ltr text-right">{user?.user_metadata?.display_name || user?.user_metadata?.username || user?.email}</p>
              <p className="text-xs text-primary font-medium">مدیر کل سیستم</p>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all border border-transparent">
            <LogOut className="w-4 h-4" />
            <span>خروج از سیستم</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto z-10 relative flex flex-col">
        <div className="p-4 md:p-8 lg:p-10 lg:pr-8 flex-1">
          <div className="max-w-7xl mx-auto pb-10">
            {activeTab === 'overview' && <OverviewTab initialExams={exams} onNavigate={handleNavigate} />}
            {activeTab === 'exams' && <ExamsTab initialExams={exams} onNavigate={handleNavigate} onDataChanged={refreshExams} initialSearchTerm={navParam || ''} isAdmin={true} />}
            {activeTab === 'create' && (
              <CreateTab 
                onCreated={() => { refreshExams(); handleNavigate('exams'); }} 
                onCancel={() => handleNavigate('exams')} 
              />
            )}
            {activeTab === 'edit' && navParam && (
              <ExamEditor 
                examId={navParam} 
                initialExam={initialExam}
                initialQuestions={initialQuestions}
                onNavigate={handleNavigate} 
                onDataChanged={refreshExams} 
              />
            )}
            {activeTab === 'reports' && <ReportsTab initialExams={exams} initialSelectedExamId={navParam} />}
          {activeTab === 'users' && <UsersPerformanceTab initialExams={exams} />}
          {activeTab === 'user-management' && <UserManagementTab onNavigate={handleNavigate} onDataChanged={refreshExams} />}
          {activeTab === 'question-bank' && <QuestionBankTab userRole={userRole} />}
          </div>
        </div>
        <Footer className="border-none mt-auto" />
      </main>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
        active 
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1' 
          : 'text-muted-foreground dark:text-muted-foreground hover:bg-muted hover:text-foreground '
      }`}
    >
      <div className={`transition-colors [&>svg]:w-5 [&>svg]:h-5 ${active ? 'opacity-100' : 'text-muted-foreground group-hover:text-primary'}`}>
        {icon}
      </div>
      <span className="flex-1 text-right">{label}</span>
      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
    </button>
  );
}
