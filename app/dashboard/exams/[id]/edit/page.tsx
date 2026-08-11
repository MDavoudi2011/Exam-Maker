import { dashboardServer } from '@/services/dashboard.server';
import { ExamEditor } from '@/components/exams/ExamEditor';
import { examService } from '@/services/exam.service';

export const dynamic = 'force-dynamic';

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  // We need to fetch the exam and questions for the server-side render, just like the dashboard did before
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: initialExam } = await examService.getExamById(id);
  const { data: initialQuestions } = await examService.getExamQuestions(id);

  return (
    <ExamEditor
      examId={id}
      initialExam={initialExam}
      initialQuestions={initialQuestions || []}
    />
  );
}
