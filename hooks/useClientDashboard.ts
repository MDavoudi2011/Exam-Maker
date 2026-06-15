/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';

export function useClientDashboard(initialTab: string = 'overview', initialParam: string | null = null, initialExams: any[] = []) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [navParam, setNavParam] = useState<string | null>(initialParam);
  const [exams, setExams] = useState(initialExams);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleTabClick = (tab: string) => {
    handleNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    setActiveTab(initialTab);
    setNavParam(initialParam);
  }, [initialTab, initialParam]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/edit')) {
        setActiveTab('edit');
        const parts = path.split('/');
        setNavParam(parts.length > 2 ? parts[2] : null);
      } else if (path.startsWith('/exams')) {
        setActiveTab('exams');
        setNavParam(null);
      } else if (path.startsWith('/create')) {
        setActiveTab('create');
        setNavParam(null);
      } else if (path.startsWith('/result')) {
        setActiveTab('reports');
        const parts = path.split('/');
        setNavParam(parts.length > 2 ? parts[2] : null);
      } else if (path.startsWith('/users')) {
        setActiveTab('users');
        setNavParam(null);
      } else if (path.startsWith('/questions')) {
        setActiveTab('question-bank');
        setNavParam(null);
      } else {
        setActiveTab('overview');
        setNavParam(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    setActiveTab(tab);
    setNavParam(param || null);
    
    let newUrl = '/dashboard';
    if (tab === 'exams') newUrl = '/exams';
    if (tab === 'edit') newUrl = param ? `/edit/${param}` : '/exams';
    if (tab === 'create') newUrl = '/create';
    if (tab === 'users') newUrl = '/users';
    if (tab === 'question-bank') newUrl = '/questions';
    if (tab === 'reports') {
      newUrl = param ? `/result/${param}` : '/result';
    }
    window.history.pushState(null, '', newUrl);
  };

  const refreshExams = async () => {
    try {
      const { data } = await examService.getExams();
      if (data) setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'exams' || activeTab === 'overview' || activeTab === 'edit' || activeTab === 'reports') {
      refreshExams();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await authService.signOut();
    window.location.reload();
  };

  return {
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
  };
}
