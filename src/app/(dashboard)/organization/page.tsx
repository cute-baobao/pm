import { getOrganizations } from '@/features/organization/server/service';
import { getSession } from '@/lib/utils/auth-action';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getSession({});
  if (!session) {
    redirect('/login');
  }
  const organizations = await getOrganizations(session.user.id);

  redirect(`/organization/${organizations[0]?.slug || 'create'}`);
}
