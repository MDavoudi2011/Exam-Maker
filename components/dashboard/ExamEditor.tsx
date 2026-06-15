'use client';
import React from 'react';
import { Save, Copy, CheckCircle2, Search, Shuffle, ListChecks, ArrowRight, X, Loader2, ArrowLeft, Edit } from 'lucide-react';
import { toFarsiNumber } from '@/utils/text.util';
import { STUDENT_DETAILS_FIELDS } from '@/constants/exam.constant';
import { useExamEditorInner } from '@/hooks/useExamEditorInner';
import { useExamEditor } from '@/hooks/useExamEditor';
import { ExamFormStep1 } from './ExamFormStep1';
import { ExamFormStep2 } from './ExamFormStep2';
import { ExamFormStep3 } from './ExamFormStep3';

export function ExamEditorInner({ exam, initialQuestions, user, onNavigate, onDataChanged }: any) {
  const {
    step,
    setStep,
    title,
    setTitle,
    description,
    setDescription,
    isTimeLimited,
    setIsTimeLimited,
    timeLimit,
    setTimeLimit,
    showResults,
    setShowResults,
    studentDetails,
    setStudentDetails,
    loading,
    saving,
    selectedQuestions,
    publishUrl,
    copied,
    selectionMode,
    setSelectionMode,
    searchQuery,
    setSearchQuery,
    selectedTopics,
    setSelectedTopics,
    randomCounts,
    setRandomCounts,
    allTopics,
    filteredQuestions,
    toggleTopicFilter,
    toggleSelection,
    isSelected,
    handleNextStep,
    applyRandomGeneration,
    handlePublish,
    copyLink
  } = useExamEditorInner({ exam, initialQuestions });

  if (step === 3) {
    return (
      <ExamFormStep3 
        publishUrl={publishUrl}
        copied={copied}
        copyLink={copyLink}
        onCreated={() => onNavigate && onNavigate('exams')}
        title="تغییرات آزمون با موفقیت ثبت شد!"
        subtitle="لینک عمومی آزمون به شرح زیر است."
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl w-full mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 px-2 md:px-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 md:gap-3">
            <Edit className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            ویرایش آزمون
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1.5 md:mt-2">
            {step === 1 ? 'مشخصات اولیه آزمون را ویرایش کنید' : 'سوالات مورد نظر خود را ویرایش کنید'}
          </p>
        </div>
        {step === 2 && (
          <button 
            onClick={handlePublish} disabled={saving || selectedQuestions.length === 0}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
            ثبت تغییرات آزمون
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {step === 1 && (
          <ExamFormStep1
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            isTimeLimited={isTimeLimited} setIsTimeLimited={setIsTimeLimited}
            timeLimit={timeLimit} setTimeLimit={setTimeLimit}
            showResults={showResults} setShowResults={setShowResults}
            studentDetails={studentDetails} setStudentDetails={setStudentDetails}
            handleNextStep={handleNextStep}
            secondaryButton={
              <button 
                onClick={() => onNavigate && onNavigate('exams')} 
                className="bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 h-12 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به لیست آزمون‌ها
              </button>
            }
          />
        )}

        {step === 2 && (
          <ExamFormStep2
            selectionMode={selectionMode} setSelectionMode={setSelectionMode}
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics}
            randomCounts={randomCounts} setRandomCounts={setRandomCounts}
            allTopics={allTopics} filteredQuestions={filteredQuestions}
            toggleTopicFilter={toggleTopicFilter} toggleSelection={toggleSelection}
            isSelected={isSelected}
            applyRandomGeneration={applyRandomGeneration}
            selectedQuestions={selectedQuestions}
            loading={loading}
            setStep={setStep}
          />
        )}

      </div>
    </div>
  );
}

export function ExamEditor({ examId, initialExam, initialQuestions, onNavigate, onDataChanged }: any) {
  const { exam, questions, loading } = useExamEditor(examId, initialExam, initialQuestions);

  if (loading) {
    return <div className="flex items-center justify-center p-20 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!exam) {
    return <div className="p-20 text-center font-bold text-slate-500">آزمون یافت نشد.</div>;
  }

  return <ExamEditorInner exam={exam} initialQuestions={questions} onNavigate={onNavigate} onDataChanged={onDataChanged} />;
}
