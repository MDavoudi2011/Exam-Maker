"use client";
import React from "react";
import { Save, Copy, CheckCircle2, Search, Shuffle, ListChecks, ArrowRight, X, Loader2, ArrowLeft, Edit } from "lucide-react";
import { toFarsiNumber } from "@/utils/text.util";
import { STUDENT_DETAILS_FIELDS } from "@/constants/exam.constant";
import { useExamEditorInner } from "@/hooks/useExamEditorInner";
import { useExamEditor } from "@/hooks/useExamEditor";
import { ExamFormStep1 } from "./ExamFormStep1";
import { ExamFormStep2 } from "./ExamFormStep2";
import { ExamFormStep3 } from "./ExamFormStep3";
import { useRouter } from "next/navigation";
import { Exam, Question } from "@/types/exam.type";

interface ExamEditorProps {
  examId?: string;
  initialExam?: Exam | null;
  initialQuestions?: any[]; // Keep any for ExamQuestion mix match
  user?: any;
  onDataChanged?: () => void;
}

import { usePathname } from 'next/navigation';

export function ExamEditorInner({ exam, initialQuestions, user, onDataChanged }: { exam: Exam, initialQuestions: any[], user?: any, onDataChanged?: () => void }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');
  const returnUrl = isAdmin ? '/admin/exams' : '/dashboard/exams';
  const { step, setStep, title, setTitle, description, setDescription, isTimeLimited, setIsTimeLimited, timeLimit, setTimeLimit, showResults, setShowResults, studentDetails, setStudentDetails, loading, saving, selectedQuestions, publishUrl, copied, selectionMode, setSelectionMode, searchQuery, setSearchQuery, selectedTopics, setSelectedTopics, randomCounts, setRandomCounts, allTopics, filteredQuestions, toggleTopicFilter, toggleSelection, isSelected, handleNextStep, applyRandomGeneration, handlePublish, copyLink } = useExamEditorInner({ exam, initialQuestions });

  if (step === 3) {
    return <ExamFormStep3 publishUrl={publishUrl} copied={copied} copyLink={copyLink} onCreated={() => router.push(returnUrl)} title="تغییرات آزمون با موفقیت ثبت شد!" subtitle="لینک عمومی آزمون به شرح زیر است." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl w-full mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 px-2 md:px-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2 md:gap-3">
            <Edit className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            ویرایش آزمون
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-medium mt-1.5 md:mt-2">{step === 1 ? "مشخصات اولیه آزمون را ویرایش کنید" : "سوالات مورد نظر خود را ویرایش کنید"}</p>
        </div>
        {step === 2 && (
          <button onClick={handlePublish} disabled={saving || selectedQuestions.length === 0} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            ثبت تغییرات آزمون
          </button>
        )}
      </div>

      <div className="bg-card dark:bg-background rounded-[2rem] shadow-xl shadow-black/5 border border-border overflow-hidden">
        {step === 1 && (
          <ExamFormStep1
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            isTimeLimited={isTimeLimited}
            setIsTimeLimited={setIsTimeLimited}
            timeLimit={timeLimit}
            setTimeLimit={setTimeLimit}
            showResults={showResults}
            setShowResults={setShowResults}
            studentDetails={studentDetails}
            setStudentDetails={setStudentDetails}
            handleNextStep={handleNextStep}
            secondaryButton={
              <button onClick={() => router.push(returnUrl)} className="bg-card hover:bg-muted/50 dark:bg-background border border-border text-foreground dark:text-muted-foreground h-12 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all">
                <ArrowRight className="w-4 h-4" />
                بازگشت به لیست آزمون‌ها
              </button>
            }
          />
        )}

        {step === 2 && <ExamFormStep2 selectionMode={selectionMode} setSelectionMode={setSelectionMode} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} randomCounts={randomCounts} setRandomCounts={setRandomCounts} allTopics={allTopics} filteredQuestions={filteredQuestions} toggleTopicFilter={toggleTopicFilter} toggleSelection={toggleSelection} isSelected={isSelected} applyRandomGeneration={applyRandomGeneration} selectedQuestions={selectedQuestions} loading={loading} setStep={setStep} />}
      </div>
    </div>
  );
}

export function ExamEditor({ examId, initialExam, initialQuestions, onDataChanged }: ExamEditorProps) {
  const { exam, questions, loading } = useExamEditor(examId || "", initialExam || undefined, initialQuestions);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!exam) {
    return <div className="p-20 text-center font-bold text-muted-foreground">آزمون یافت نشد.</div>;
  }

  return <ExamEditorInner exam={exam as Exam} initialQuestions={questions} onDataChanged={onDataChanged} />;
}
