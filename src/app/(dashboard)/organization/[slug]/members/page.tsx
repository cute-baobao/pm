import { InviteMemberForm } from '@/features/organization-member/components/invite-member-form';
import { MemberList } from '@/features/organization-member/components/member-list';
import { prefetchOrganizationMembers } from '@/features/organization-member/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

interface WorkspaceMembersPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkspaceMembersPage({
  params,
}: WorkspaceMembersPageProps) {
  const { slug } = await params;
  const session = await requireOrganizationAccess(slug, true);
  console.log('member', session);
  const member = session.user.members.find(
    (m) => m.organizationId === session.session.activeOrganizationId,
  );

  if (!member) {
    redirect('/organization');
  }

  await prefetchOrganizationMembers();

  return (
    <HydrateClient>
      <div className="mx-auto flex w-full flex-col gap-4">
        <Suspense>
          <InviteMemberForm
            organizationId={member.organizationId}
            role={member.role}
          />
          <MemberList />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
