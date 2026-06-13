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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setExams(initialExams), 0);
  }, [initialExams]);

  useEffect(() => {
    setSearchTerm(initialSearchTerm || '');
  }, [initialSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
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
      return matchesSearch && matchesStatus;
    });
  }, [exams, searchTerm, selectedStatus]);

  return {
    exams,
    loading,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    showStatusDropdown,
    setShowStatusDropdown,
    dropdownRef,
    handleDelete,
    toggleStatus,
    getStatus,
    filteredExams
  };
}
