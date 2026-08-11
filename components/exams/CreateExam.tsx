'use client';
import React from 'react';
import { PlusCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useCreateExam } from '@/hooks/useCreateExam';
import { ExamFormStep1 } from './ExamFormStep1';
import { ExamFormStep2 } from './ExamFormStep2';
import { ExamFormStep3 } from './ExamFormStep3';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { useRouter, usePathname } from 'next/navigation';

export function CreateExam({ onCreated, onCancel }: { onCreated?: () => void, onCancel?: () => void }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const returnUrl = pathname.startsWith('/admin') ? '/admin/exams' : '/dashboard/exams';

  const handleCreated = () => {
    if (onCreated) onCreated();
    router.push(returnUrl);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.push(returnUrl);
  };

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
  } = useCreateExam(handleCreated);

  if (step === 3) {
    return (
      <ExamFormStep3 
        publishUrl={publishUrl}
        copied={copied}
        copyLink={copyLink}
        onCreated={handleCreated}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl w-full mx-auto pb-20">
 
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 px-2 md:px-0">
        <SectionHeader 
          icon={PlusCircle} 
          title="ساخت آزمون جدید" 
          description={step === 1 ? 'مشخصات اولیه آزمون را وارد کنید' : 'سوالات مورد نظر خود را انتخاب کنید'} 
        />
        {step === 2 && (
          <button 
            onClick={handlePublish} disabled={saving || selectedQuestions.length === 0}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle2 className="w-5 h-5" />}
            انتشار نهایی آزمون
          </button>
        )}
      </div>

      <div className="bg-card dark:bg-background rounded-[2rem] shadow-xl shadow-black/5 border border-border overflow-hidden">
 
        {step === 1 && (
          <ExamFormStep1
            title={title} setTitle={setTitle}
            description={description} setDescription={setDescription}
            isTimeLimited={isTimeLimited} setIsTimeLimited={setIsTimeLimited}
            timeLimit={timeLimit} setTimeLimit={setTimeLimit}
            showResults={showResults} setShowResults={setShowResults}
            studentDetails={studentDetails} setStudentDetails={setStudentDetails}
            handleNextStep={handleNextStep}
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
