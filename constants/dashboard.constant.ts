import { LayoutDashboard, List, PlusCircle, BarChart3, Users, Database } from 'lucide-react';

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'داشبورد', icon: 'LayoutDashboard' },
  { id: 'exams', label: 'لیست آزمون‌ها', icon: 'List' },
  { id: 'create', label: 'ساخت آزمون', icon: 'PlusCircle' },
  { id: 'reports', label: 'گزارش‌ها و نتایج', icon: 'BarChart3' },
  { id: 'users', label: 'تحلیل عملکرد کاربران', icon: 'Users' },
  { id: 'question-bank', label: 'بانک سوالات', icon: 'Database' }
];
