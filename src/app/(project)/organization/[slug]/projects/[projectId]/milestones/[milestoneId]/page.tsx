import { prefetchMilestoneById } from '@/features/milestone/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MilestoneClient, MilestoneError, MilestoneLoading } from './client';

interface MilestonePageProps {
  params: Promise<{ slug: string; projectId: string; milestoneId: string }>;
}

export default async function MilestonePage({ params }: MilestonePageProps) {
  const { slug, milestoneId } = await params;
  await requireOrganizationAccess(slug);

  await prefetchMilestoneById(milestoneId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<MilestoneError />}>
        <Suspense fallback={<MilestoneLoading />}>
          <MilestoneClient />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
