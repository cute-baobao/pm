import { requireOrganizationAccess } from '@/lib/utils/auth-action';

interface SubdomainPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SubdomainPageProps) {
  //Check user session and access permission
  const { slug } = await params;
  await requireOrganizationAccess(slug);
  return <div>123</div>;
}
