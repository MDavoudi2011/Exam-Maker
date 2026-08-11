import { dashboardServer } from '@/services/dashboard.server';
import { QuestionBank } from '@/components/questions/QuestionBank';

export const dynamic = 'force-dynamic';

export default async function AdminQuestionsPage() {
  const { userRole } = await dashboardServer.getInitialData(true);

  return <QuestionBank userRole={userRole} />;
}
