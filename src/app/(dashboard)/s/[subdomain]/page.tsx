import { requireAuth } from '@/lib/utils/auth-action';

interface SubdomainPageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  await requireAuth();
  const { subdomain } = await params;
  return <div>{subdomain}</div>;
}
