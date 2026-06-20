/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo, useRef } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';
import { getStatus } from '@/utils/exam.util';

export function useExamsTab(initialExams: any[], onDataChanged: () => void, initialSearchTerm: string) {
  const [exams, setExams] = useState(initialExams);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCreator, setSelectedCreator] = useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const creatorDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setExams(initialExams), 0);
  }, [initialExams]);

  useEffect(() => {
    // If the search term is a UUID, we treat it as a creator filter (as passed by UserManagementTab onNavigate('exams', user.id))
    if (initialSearchTerm && initialSearchTerm.length === 36 && initialSearchTerm.includes('-')) {
       // UUID heuristics 
       setSelectedCreator(initialSearchTerm);
       setSearchTerm('');
    } else {
       setSearchTerm(initialSearchTerm || '');
       setSelectedCreator('all');
    }
  }, [initialSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (creatorDropdownRef.current && !creatorDropdownRef.current.contains(event.target as Node)) {
        setShowCreatorDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آزمون اطمینان دارید؟')) return;
    setLoading(true);
    const { error } = await examService.deleteExam(id);
    if (!error) {
      setExams(exams.filter(e => e.id !== id));
      onDataChanged();
    } else {
      alert('خطا در حذف آزمون: ' + error.message);
    }
    setLoading(false);
  };

  const toggleStatus = async (exam: any) => {
    if (loading) return;
    setLoading(true);
    const currentStatus = getStatus(exam);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const currentSettings = exam.settings || {};
    const newSettings = { ...currentSettings, status: newStatus };
    const isPublished = newStatus === 'active';

    const { error } = await examService.updateExam(exam.id, { settings: newSettings, is_published: isPublished });
    
    if (!error) {
      onDataChanged();
    } else {
      alert('خطا در تغییر وضعیت');
    }
    setLoading(false);
  };

  const filteredExams = useMemo(() => {
    return exams.filter(e => {
      const s = getStatus(e);
      const matchesSearch = (e.title || '').includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || s === selectedStatus;
      const matchesCreator = selectedCreator === 'all' || e.created_by === selectedCreator;
      return matchesSearch && matchesStatus && matchesCreator;
    });
  }, [exams, searchTerm, selectedStatus, selectedCreator]);

  const creators = useMemo(() => {
    const creatorMap = new Map<string, { id: string, name: string, count: number }>();
    exams.forEach(e => {
      if (e.created_by) {
        const profile = e.profiles || {};
        const name = profile.display_name || profile.username || profile.email?.split('@')[0] || 'نامشخص';
        if (creatorMap.has(e.created_by)) {
          creatorMap.get(e.created_by)!.count++;
        } else {
          creatorMap.set(e.created_by, { id: e.created_by, name, count: 1 });
        }
      }
    });
    return Array.from(creatorMap.values());
  }, [exams]);

  return {
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
  };
}
