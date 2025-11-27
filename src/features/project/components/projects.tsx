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
import { Project } from '@/db/schemas';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { useEntitySearch } from '@/lib/hooks/use-entity-search';
import { formatDistanceToNow } from 'date-fns';
import { FolderOpenDotIcon, WorkflowIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createContext, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { useSuspenseProjects } from '../hooks/use-project';
import { useProjectsParams } from '../hooks/use-project-params';

export const ProjectsContext = createContext<{ organizationId: string }>({
  organizationId: '',
});

export function ProjectsList() {
  const { organizationId } = useContext(ProjectsContext);
  const projects = useSuspenseProjects(organizationId);
  return (
    <EntityList
      items={projects.data.items}
      getKey={(project) => project.id}
      renderItem={(project) => <ProjectItem data={project} />}
      emptyView={<ProjectsEmpty />}
    />
  );
}

export function ProjectsHeader({ disabled }: { disabled?: boolean }) {
  const slug = useOrganizationSlug();
  const t = useTranslations('Project');

  const router = useRouter();

  const handleCreate = () => {
    router.push(`/organization/${slug}/projects/new`);
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

export function ProjectsSearch() {
  const [params, setParams] = useProjectsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  const t = useTranslations('Project');

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

export function ProjectsPagination() {
  const { organizationId } = useContext(ProjectsContext);
  const projects = useSuspenseProjects(organizationId);
  const [params, setParams] = useProjectsParams();

  return (
    <EntityPagination
      disabled={projects.isFetching}
      totalPages={projects.data.totalPages}
      page={params.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
}

export function WorkflowsContainer({
  organizationId,
  children,
}: {
  organizationId: string;
  children: React.ReactNode;
}) {
  return (
    <ProjectsContext.Provider value={{ organizationId }}>
      <EntityContainer
        header={<ProjectsHeader />}
        search={<ProjectsSearch />}
        pagination={<ProjectsPagination />}
      >
        {children}
      </EntityContainer>
    </ProjectsContext.Provider>
  );
}

export function ProjectsLoading() {
  const t = useTranslations('Project');
  return <LoadingView message={t('List.loadingMessage')} entity="projects" />;
}

export function ProjectsError() {
  const t = useTranslations('Project');
  return <ErrorView message={t('List.errorMessage')} />;
}

export function ProjectsEmpty() {
  const slug = useOrganizationSlug();
  const router = useRouter();
  const t = useTranslations('Project');
  const handleCreate = () => {
    router.push(`/organization/${slug}/projects/new`);
  };
  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message={t('List.emptyMessage')}
      />
    </>
  );
}

export function ProjectItem({ data }: { data: Project }) {
  //   const removeProject = useRemoveProject();

  const handleRemove = () => {
    // removeWorkflow.mutate({ id: data.id });
  };

  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={<>{formatDistanceToNow(data.createdAt, { addSuffix: true })}</>}
      image={
        <div className="flex size-8 items-center justify-center">
          <FolderOpenDotIcon className="text-muted-foreground size-5" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={false}
    />
  );
}
