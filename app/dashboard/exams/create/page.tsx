import { CreateExam } from '@/components/exams/CreateExam';

export const dynamic = 'force-dynamic';

export default function CreateExamPage() {
  return (
    <CreateExam
      onCreated={() => {}} // We will update these to use Next.js router.push later
      onCancel={() => {}}
    />
  );
}
