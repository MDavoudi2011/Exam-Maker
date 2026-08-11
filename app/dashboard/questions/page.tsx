import { dashboardServer } from '@/services/dashboard.server';
import { QuestionBank } from '@/components/questions/QuestionBank';

export const dynamic = 'force-dynamic';

export default async function QuestionsPage() {
  const { userRole } = await dashboardServer.getInitialData(false);

  return <QuestionBank userRole={userRole} />;
}
