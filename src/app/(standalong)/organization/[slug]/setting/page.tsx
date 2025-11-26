import { EditOrganizationForm } from '@/features/organization/components/edit-organization-form';
import { OrganizationError } from '@/features/organization/components/organization';
import { prefetchOrganization } from '@/features/organization/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface SubdomainPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SubdomainPageProps) {
  const { slug } = await params;
  const session = await requireOrganizationAccess(slug, true);
  const member = session.user.members.find(
    (m) => m.organizationId === session.session.activeOrganizationId,
  );
  if (!member) {
    redirect(`/organization`);
  }
  await prefetchOrganization(slug);

  return (
    <div className="w-full lg:max-w-xl">
      <HydrateClient>
        <ErrorBoundary fallback={<OrganizationError />}>
          <Suspense>
            <EditOrganizationForm slug={slug} role={member.role} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
}
