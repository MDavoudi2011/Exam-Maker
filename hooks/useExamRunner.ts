import { useState } from 'react';
import { RunnerQuestion } from '@/types/runner.type';

export function useExamRunner(questions: RunnerQuestion[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  // Note: progress calculation should be adapted if we change how things are indexed.
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSelect = (val: string) => {
    if (!currentQ) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: parseInt(val) }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
    // Here we would sync results to database
  };

  return {
    currentIndex,
    answers,
    isFinished,
    currentQ,
    progress,
    handleSelect,
    handleNext,
    handlePrev,
    handleSubmit
  };
}
