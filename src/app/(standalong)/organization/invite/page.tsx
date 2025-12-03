import { JoinCard } from '@/features/organization-member/components/join-card';
import { getSession } from '@/lib/utils/auth-action';
import { redirect } from 'next/navigation';

interface OrganizationInvitePageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function OrganizationInvitePage({
  searchParams,
}: OrganizationInvitePageProps) {
  const { token } = await searchParams;
  const session = await getSession({});
  if (!session) {
    redirect(
      `/login?next=${encodeURIComponent(`/organization/invite?token=${token}`)}`,
    );
  }
  // const result = await joinOrganizationViaInvitation(
  //   token,
  //   session.user.id,
  //   session.user.email,
  // );

  // if (result) {
  //   redirect('/organization');
  // }

  return <JoinCard token={token} />;
}
