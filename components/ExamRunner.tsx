'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronRight, ChevronLeft, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type Question = {
  id: string;
  contentHtml: string;
  options: string[];
};

type ExamRunnerProps = {
  examId: string;
  title: string;
  timeLimit: number; // minutes
  questions: Question[];
};

export default function ExamRunner({ examId, title, timeLimit, questions }: ExamRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (val: string) => {
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

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-6">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h2 className="text-3xl font-bold">آزمون به پایان رسید!</h2>
        <p className="text-muted-foreground text-lg">پاسخ‌های شما با موفقیت ثبت شد.</p>
        <Button onClick={() => window.location.href = '/dashboard'} size="lg">بازگشت به داشبورد</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-8 px-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center gap-2 text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{timeLimit}:00 مانده</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>سوال {currentIndex + 1} از {questions.length}</span>
          <span>{Math.round(progress)}% پیشرفت</span>
        </div>
        <Progress value={progress} className="h-2 rotate-180" />
      </div>

      <Card className="mt-4 border-2">
        <CardHeader className="bg-muted/30">
          <CardTitle className="leading-relaxed font-normal text-lg" dangerouslySetInnerHTML={{ __html: currentQ.contentHtml }} />
        </CardHeader>
        <CardContent className="pt-6">
          <RadioGroup 
            value={answers[currentQ.id]?.toString() || ''} 
            onValueChange={handleSelect}
            className="space-y-3"
          >
            {currentQ.options.map((opt, i) => (
              <div key={i} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors shadow-sm ${answers[currentQ.id] === i ? 'border-primary bg-primary/10' : 'hover:bg-muted border-transparent bg-muted/40'}`}>
                <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base">
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-5 bg-muted/20 rounded-b-xl">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="shadow-sm">
           <ChevronRight className="w-4 h-4 ms-2" /> 
           قبلی
          </Button>

          {currentIndex === questions.length - 1 ? (
             <Button onClick={handleSubmit} className="bg-primary text-primary-foreground shadow-md gap-2">
               پایان آزمون
               <CheckCircle2 className="w-5 h-5" /> 
             </Button>
          ) : (
             <Button onClick={handleNext} className="shadow-md gap-2">
               بعدی
               <ChevronLeft className="w-4 h-4" /> 
             </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
