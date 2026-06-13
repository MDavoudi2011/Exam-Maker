import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ExamViewer } from '@/components/viewer/ExamViewer';

export const dynamic = 'force-dynamic';

export default async function ViewExamPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { data: exam, error } = await supabase.from('exams').select('*').eq('id', id).single();
  
  if (error || !exam) {
    return <div className="p-10 text-center font-bold text-red-500">آزمون یافت نشد.</div>;
  }

  const { data: questions } = await supabase.from('exam_questions').select('*, questions(*)').eq('exam_id', id).order('order_index', { ascending: true });

  const { data: { user } } = await supabase.auth.getUser();

  return <ExamViewer exam={exam} questions={questions || []} user={user} />;
}
