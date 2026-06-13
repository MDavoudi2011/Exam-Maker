'use client';
import React from 'react';
import { PlusCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useCreateTab } from '@/hooks/useCreateTab';
import { ExamFormStep1 } from './ExamFormStep1';
import { ExamFormStep2 } from './ExamFormStep2';
import { ExamFormStep3 } from './ExamFormStep3';

export function CreateTab({ onCreated, onCancel }: { onCreated: () => void, onCancel: () => void }) {
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
  } = useCreateTab(onCreated);

  if (step === 3) {
    return (
      <ExamFormStep3 
        publishUrl={publishUrl}
        copied={copied}
        copyLink={copyLink}
        onCreated={onCreated}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl w-full mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <PlusCircle className="w-7 h-7 text-primary" />
            ساخت آزمون جدید
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            {step === 1 ? 'مشخصات اولیه آزمون را وارد کنید' : 'سوالات مورد نظر خود را انتخاب کنید'}
          </p>
        </div>
        {step === 2 && (
          <button 
            onClick={handlePublish} disabled={saving || selectedQuestions.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle2 className="w-5 h-5" />}
            انتشار نهایی آزمون
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
