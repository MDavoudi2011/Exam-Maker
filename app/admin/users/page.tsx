import { UserManagement } from '@/components/users/UserManagement';

export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  return <UserManagement onDataChanged={() => {}} />;
}
