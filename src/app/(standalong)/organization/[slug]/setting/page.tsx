import { EditOrganizationForm } from '@/features/organization/components/edit-organization-form';
import {
  OrganizationError,
  OrganizationLoading,
} from '@/features/organization/components/organization';
import { prefetchOrganization } from '@/features/organization/server/prefetch';
import { getSession } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface SubdomainPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SubdomainPageProps) {
  const { slug } = await params;
  const session = await getSession({ withMembers: true });
  if (!session) {
    redirect(`/login?next=/organization/${slug}/setting`);
  }
  const member = session.user.members.find((m) => m.organizationSlug === slug);
  if (!member) {
    redirect(`/organization`);
  }
  await prefetchOrganization(slug);

  return (
    <div className="w-full lg:max-w-xl">
      <HydrateClient>
        <ErrorBoundary fallback={<OrganizationError />}>
          <Suspense fallback={<OrganizationLoading />}>
            <EditOrganizationForm slug={slug} role={member.role} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
