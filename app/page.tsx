import { redirect } from 'next/navigation';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams?.code;
  
  if (code && typeof code === 'string') {
    redirect(`/auth/callback?code=${code}`);
  }

  redirect('/dashboard');
}
