import {
  MilestonesContainer,
  MilestonesError,
  MilestonesList,
  MilestonesLoading,
} from '@/features/milestone/components/milestones';
import { milestoneParamsLoader } from '@/features/milestone/server/params-loader';
import { prefetchMilestones } from '@/features/milestone/server/prefetch';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface MilestonesPageProps {
  params: Promise<{ slug: string; projectId: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function MilestonesPage({
  params,
  searchParams: p,
}: MilestonesPageProps) {
  const { slug, projectId } = await params;

  await requireOrganizationAccess(slug);
  const search = await milestoneParamsLoader(p);

  await prefetchMilestones({
    ...search,
    projectId,
  });

  return (
    <HydrateClient>
      <MilestonesContainer>
        <ErrorBoundary fallback={<MilestonesError />}>
          <Suspense fallback={<MilestonesLoading />}>
            <MilestonesList />
          </Suspense>
        </ErrorBoundary>
      </MilestonesContainer>
    </HydrateClient>
  );
}
