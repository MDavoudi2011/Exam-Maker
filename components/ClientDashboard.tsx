'use client';

import React from 'react';
import { BrainCircuit, LayoutDashboard, List, PlusCircle, LogOut, BarChart3, ChevronRight, Users, Database } from 'lucide-react';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ExamsTab } from '@/components/dashboard/ExamsTab';
import { CreateTab } from '@/components/dashboard/CreateTab';
import { ReportsTab } from '@/components/dashboard/ReportsTab';
import { UsersPerformanceTab } from '@/components/dashboard/UsersPerformanceTab';
import { QuestionBankTab } from '@/components/dashboard/QuestionBankTab';
import { ExamEditor } from '@/components/dashboard/ExamEditor';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Exam } from '@/types/exam.type';

export default function ClientDashboard({ user, initialExams, initialTab = 'overview', initialParam = null, initialExam = null, initialQuestions = [] }: { user: any, initialExams: any[], initialTab?: string, initialParam?: string | null, initialExam?: any, initialQuestions?: any[] }) {
  const {
    activeTab,
    navParam,
    exams,
    handleNavigate,
    refreshExams,
    handleLogout
  } = useClientDashboard(initialTab, initialParam, initialExams);

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative flex-1 overflow-hidden" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
      <div className="absolute top-64 -right-64 w-[500px] h-[500px] bg-sky-400/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>

      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col z-10 shadow-[0_0_40px_rgba(0,0,0,0.03)] dark:shadow-none min-h-[auto] md:min-h-screen relative">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-2.5 rounded-2xl shadow-inner border border-primary/10">
            <BrainCircuit className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-primary to-sky-600">هوشیار</h2>
            <p className="text-xs text-slate-500 font-medium tracking-tight">آزمون‌ساز هوشمند</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 focus:outline-none">
          <NavItem active={activeTab === 'overview'} onClick={() => handleNavigate('overview')} icon={<LayoutDashboard />} label="داشبورد" />
          <NavItem active={activeTab === 'exams' || activeTab === 'edit'} onClick={() => handleNavigate('exams')} icon={<List />} label="لیست آزمون‌ها" />
          <NavItem active={activeTab === 'create'} onClick={() => handleNavigate('create')} icon={<PlusCircle />} label="ساخت آزمون" />
          <NavItem active={activeTab === 'reports'} onClick={() => handleNavigate('reports')} icon={<BarChart3 />} label="گزارش‌ها و نتایج" />
          <NavItem active={activeTab === 'users'} onClick={() => handleNavigate('users')} icon={<Users />} label="تحلیل عملکرد کاربران" />
          <NavItem active={activeTab === 'question-bank'} onClick={() => handleNavigate('question-bank')} icon={<Database />} label="بانک سوالات" />
        </nav>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
           <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 mb-4 border border-slate-200/50 dark:border-slate-800">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-900">
               {user?.email?.charAt(0).toUpperCase() || 'A'}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">{user?.email}</p>
               <p className="text-xs text-slate-500 font-medium">مدیر سیستم</p>
             </div>
           </div>

           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-4 h-4" />
            <span>خروج از سیستم</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 h-[calc(100vh-auto)] md:h-screen overflow-y-auto z-10 relative">
        <div className="max-w-6xl mx-auto pb-10">
          {activeTab === 'overview' && <OverviewTab initialExams={exams} onNavigate={handleNavigate} />}
          {activeTab === 'exams' && <ExamsTab initialExams={exams} onNavigate={handleNavigate} onDataChanged={refreshExams} initialSearchTerm={navParam || ''} />}
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
          {activeTab === 'question-bank' && <QuestionBankTab />}
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
          ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      }`}
    >
      <div className={`transition-colors [&>svg]:w-5 [&>svg]:h-5 ${active ? 'opacity-100' : 'text-slate-400 group-hover:text-primary'}`}>
        {icon}
      </div>
      <span className="flex-1 text-right">{label}</span>
      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
    </button>
  );
}
