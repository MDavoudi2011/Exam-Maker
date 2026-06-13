/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/services/auth.service';
import { questionService } from '@/services/question.service';
import { examService } from '@/services/exam.service';
import { attemptService } from '@/services/attempt.service';

export function useEditModal(question: any, onSave: () => void, onClose: () => void) {
  const [content, setContent] = useState(question.content || '');
  const [options, setOptions] = useState<string[]>(Array.isArray(question.options) ? question.options : ['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(question.correct_option_index || 0);
  const [topic, setTopic] = useState(question.topic || '');
  const [score, setScore] = useState(question.point_value || 10);
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      if (question.id) {
        const { error } = await questionService.updateQuestion(question.id, {
          content,
          options,
          correct_option_index: correctIndex,
          topic,
          point_value: score
        });
        if (error) throw error;
      } else {
        const { error } = await questionService.createQuestion({
          content,
          options,
          correct_option_index: correctIndex,
          topic,
          point_value: score
        });
        if (error) throw error;
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(`عملیات با خطا مواجه شد:\n${err.message || 'مشکل در برقراری ارتباط با سرور'}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    content,
    setContent,
    options,
    setOptions,
    correctIndex,
    setCorrectIndex,
    topic,
    setTopic,
    score,
    setScore,
    loading,
    handleSave,
  };
}

export function useQuestionBankTab() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [previewQuestion, setPreviewQuestion] = useState<any>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10);
  const [showItemsPerPageDropdown, setShowItemsPerPageDropdown] = useState(false);
  
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [showAddTopic, setShowAddTopic] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTopicDropdown(false);
        setShowAddTopic(false);
      }
      if (itemsPerPageRef.current && !itemsPerPageRef.current.contains(event.target as Node)) {
        setShowItemsPerPageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await questionService.getQuestions();
      if (data) {
        setQuestions(data);
        const uniqueTopics = Array.from(new Set(data.map(q => q.topic).filter(Boolean)));
        setTopics(uniqueTopics as string[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
      try {
        const { error } = await questionService.deleteQuestion(id);
        if (error) throw error;
        fetchQuestions();
      } catch (err: any) {
        alert(`خطا در حذف سوال:\n${err.message || 'مشکلی رخ داد.'}`);
      }
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setSelectedTopic(newTopic.trim());
      setNewTopic('');
      setShowAddTopic(false);
      setShowTopicDropdown(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchesSearch = q.content?.includes(searchTerm);
    return matchesTopic && matchesSearch;
  });

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredQuestions.length / (itemsPerPage as number));
  const paginatedQuestions = itemsPerPage === 'all' ? filteredQuestions : filteredQuestions.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));

  return {
    questions,
    topics,
    selectedTopic,
    setSelectedTopic,
    searchTerm,
    setSearchTerm,
    loading,
    editingQuestion,
    setEditingQuestion,
    previewQuestion,
    setPreviewQuestion,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    showItemsPerPageDropdown,
    setShowItemsPerPageDropdown,
    showTopicDropdown,
    setShowTopicDropdown,
    newTopic,
    setNewTopic,
    showAddTopic,
    setShowAddTopic,
    dropdownRef,
    itemsPerPageRef,
    fetchQuestions,
    handleDelete,
    handleAddTopic,
    filteredQuestions,
    totalPages,
    paginatedQuestions
  };
}
