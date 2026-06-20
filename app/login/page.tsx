import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ClientLogin from '@/components/ClientLogin';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams?.code;
  
  if (code && typeof code === 'string') {
    redirect(`/auth/callback?code=${code}`);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <ClientLogin />;
}
