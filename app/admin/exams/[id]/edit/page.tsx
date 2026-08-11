import { dashboardServer } from '@/services/dashboard.server';
import { ExamEditor } from '@/components/exams/ExamEditor';
import { examService } from '@/services/exam.service';

export const dynamic = 'force-dynamic';

export default async function AdminEditExamPage({ params }: { params: Promise<{ id: string }> }) {
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
