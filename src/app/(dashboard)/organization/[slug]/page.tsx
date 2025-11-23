import { setActiveOrganization } from '@/features/organization/server/service';
import { getSession } from '@/lib/utils/auth-action';
import { notFound, redirect } from 'next/navigation';

interface SubdomainPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SubdomainPageProps) {
  //Check user session and access permission
  const { slug } = await params;
  const session = await getSession({ withOrganizations: true });
  if (!session) {
    redirect('/login');
  } else {
    const hasAcess = session.user.organizations.some(
      (org) => org.slug === slug,
    );
    if (!hasAcess) {
      notFound();
    }
    await setActiveOrganization(session.session.token, hasAcess ? slug : null);
  }
  return <div>123</div>;
}
