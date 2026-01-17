'use client';

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from '@/components/entity-component';
import { Progress } from '@/components/ui/progress';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { useSession } from '@/lib/auth-client';
import { useEntitySearch } from '@/lib/hooks/use-entity-search';
import { formatDistanceToNow } from 'date-fns';
import { MilestoneIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createContext } from 'react';
import {
  useDeleteMilestone,
  useSuspenseMilestones,
} from '../hooks/use-milestone';
// import { useMilestonesParams } from '../hooks/us';
import { useProjectId } from '@/features/project/hooks/use-project';
import { useMilestoneParams } from '../hooks/use-milestone-params';

type MilestoneWithPercentComplete = ReturnType<
  typeof useSuspenseMilestones
>['data']['items'][number];

export const MilestonesContext = createContext<{ organizationId: string }>({
  organizationId: '',
});

export function MilestonesList() {
  const projectId = useProjectId();
  const Milestones = useSuspenseMilestones(projectId);
  return (
    <EntityList
      items={Milestones.data.items}
      getKey={(milestone) => milestone.id}
      renderItem={(milestone) => <MilestoneItem data={milestone} />}
      emptyView={<MilestonesEmpty />}
    />
  );
}

export function MilestonesHeader({ disabled }: { disabled?: boolean }) {
  const slug = useOrganizationSlug();
  const projectId = useProjectId();
  const t = useTranslations('Milestone');

  const router = useRouter();

  const handleCreate = () => {
    router.push(`/organization/${slug}/projects/${projectId}/milestones/new`);
  };

  return (
    <>
      <EntityHeader
        title={t('List.title')}
        description={t('List.description')}
        onNew={handleCreate}
        newButtonLabel={t('List.newButtonLabel')}
        disabled={disabled}
      />
    </>
  );
}

export function MilestonesSearch() {
  const [params, setParams] = useMilestoneParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  const t = useTranslations('Milestone');

  return (
    <>
      <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder={t('List.searchPlaceholder')}
      />
    </>
  );
}

export function MilestonesPagination() {
  const projectId = useProjectId();
  const Milestones = useSuspenseMilestones(projectId);
  const [params, setParams] = useMilestoneParams();

  return (
    <EntityPagination
      disabled={Milestones.isFetching}
      totalPages={Milestones.data.totalPages}
      page={params.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
}

export function MilestonesContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: sessionData } = useSession();
  const organizationId = sessionData?.session?.activeOrganizationId || '';

  return (
    <MilestonesContext.Provider value={{ organizationId }}>
      <EntityContainer
        header={<MilestonesHeader />}
        search={<MilestonesSearch />}
        pagination={<MilestonesPagination />}
      >
        {children}
      </EntityContainer>
    </MilestonesContext.Provider>
  );
}

export function MilestonesLoading() {
  const t = useTranslations('Milestone');
  return <LoadingView message={t('List.loadingMessage')} entity="Milestones" />;
}

export function MilestonesError() {
  const t = useTranslations('Milestone');
  return <ErrorView message={t('List.errorMessage')} />;
}

export function MilestonesEmpty() {
  const slug = useOrganizationSlug();
  const projectId = useProjectId();
  const router = useRouter();
  const t = useTranslations('Milestone');
  const handleCreate = () => {
    router.push(`/organization/${slug}/projects/${projectId}/milestones/new`);
  };
  return (
    <>
      <EmptyView onNew={handleCreate} message={t('List.emptyMessage')} />
    </>
  );
}

export function MilestoneItem({
  data,
}: {
  data: MilestoneWithPercentComplete;
}) {
  const removeMilestone = useDeleteMilestone();
  const projectId = useProjectId();
  const slug = useOrganizationSlug();
  const handleRemove = () => {
    removeMilestone.mutate(data.id);
  };

  return (
    <EntityItem
      href={`/organization/${slug}/projects/${projectId}/milestones/${data.id}`}
      title={data.name}
      subtitle={
        <div className="flex w-full flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(data.createdAt, { addSuffix: true })}
            </span>
            <span className="text-primary text-xs font-semibold tabular-nums">
              {data.percentage || 0}%
            </span>
          </div>
          <Progress value={data.percentage || 0} className="h-1.5" />
        </div>
      }
      image={
        <div className="flex size-8 items-center justify-center">
          <MilestoneIcon className="text-muted-foreground size-5" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeMilestone.isPending}
    />
  );
}
