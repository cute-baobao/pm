'use client';
import { Analytics } from '@/components/analytics';
import { DottedSeparator } from '@/components/dotted-separator';
import { ErrorView, LoadingView } from '@/components/entity-component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Member, Project, User } from '@/db/schemas';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { useSuspenseOrganizationMembers } from '@/features/organization-member/hooks/use-organization-member';
import { ProjectAvatar } from '@/features/project/components/project-avatar';
import { useSuspenseProjects } from '@/features/project/hooks/use-project';
import { useCreateTaskModal } from '@/features/task/hooks/use-create-task-modal';
import { useSuspenseTaskPagination } from '@/features/task/hooks/use-task';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  useOrganizationSlug,
  useSuspenseOrganizationAnalytics,
} from '../hooks/use-organization';

export function OrganizationLoading() {
  const t = useTranslations('Organization');
  return <LoadingView message={t('loading')} entity="organizations" />;
}

export function OrganizationError() {
  const t = useTranslations('Organization');
  return <ErrorView message={t('error')} />;
}

interface OrganizationViewProps {
  organizationId: string;
}

export function OrganizationView({ organizationId }: OrganizationViewProps) {
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useSuspenseOrganizationAnalytics({
      organizationId,
    });
  const { data: tasks, isLoading: isTasksLoading } =
    useSuspenseTaskPagination(organizationId);

  const { data: projects, isLoading: isProjectsLoading } =
    useSuspenseProjects(organizationId);

  const { data: members, isLoading: isMembersLoading } =
    useSuspenseOrganizationMembers(organizationId);

  const isLoading =
    organizationId === '' ||
    isAnalyticsLoading ||
    isTasksLoading ||
    isProjectsLoading ||
    isMembersLoading;

  if (isLoading) {
    return <OrganizationLoading />;
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList data={tasks.items} />
        <ProjectList data={projects.items} />
        <MemberList data={members} />
      </div>
    </div>
  );
}

interface ProjectListProps {
  data: Project[];
}

export function ProjectList({ data }: ProjectListProps) {
  const slug = useOrganizationSlug();
  const t = useTranslations('Project');
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{t('title')}</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/organization/${slug}/projects/new`}>
              <PlusIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.length > 0 &&
            data.map((project) => (
              <li key={project.id}>
                <Link href={`/organization/${slug}/projects/${project.id}`}>
                  <Card className="rounded-lg p-0 shadow-none transition hover:opacity-75">
                    <CardContent className="flex items-center gap-x-2.5 p-4">
                      <ProjectAvatar
                        className="size-12"
                        fallbackClassName="text-lg"
                        name={project.name}
                        image={project.image ?? undefined}
                      />
                      <p className="truncate text-lg font-medium">
                        {project.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          {data.length === 0 && (
            <li className="text-muted-foreground col-span-2 hidden text-center text-sm first-of-type:block">
              {t('notFound')}
            </li>
          )}
        </ul>
        <Button variant="secondary" className="mt-4 w-full" asChild>
          <Link href={`/organization/${slug}/projects`}>{t('showAll')}</Link>
        </Button>
      </div>
    </div>
  );
}

interface TaskListProps {
  data: ReturnType<typeof useSuspenseTaskPagination>['data']['items'];
}

export function TaskList({ data }: TaskListProps) {
  const slug = useOrganizationSlug();
  const { open } = useCreateTaskModal();
  const t = useTranslations('Task');
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{t('title')}</p>
          <Button variant="secondary" size="icon" onClick={() => open()}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.length > 0 &&
            data.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/organization/${slug}/projects/${task.projectId}/task/${task.id}`}
                >
                  <Card className="rounded-lg p-0 shadow-none transition hover:opacity-75">
                    <CardContent className="p-4">
                      <p className="truncate text-lg font-medium">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p>{task.project.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-muted-foreground flex items-center text-sm">
                          <CalendarIcon className="mr-1 size-3" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          {data.length === 0 && (
            <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
              {t('notFound')}
            </li>
          )}
        </ul>
        <Button variant="secondary" className="mt-4 w-full" asChild>
          <Link href={`/organization/${slug}/tasks`}>{t('showAll')}</Link>
        </Button>
      </div>
    </div>
  );
}

interface MemberListProps {
  data: (Member & { user: User })[];
}

export function MemberList({ data }: MemberListProps) {
  const slug = useOrganizationSlug();
  const t = useTranslations('OrganizationMember');
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{t('title')}</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/organization/${slug}/members`}>
              <PlusIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.length > 0 &&
            data.map((member) => (
              <li key={member.id}>
                <Card className="overflow-hidden rounded-lg p-0 shadow-none">
                  <CardContent className="flex flex-col items-center gap-x-2.5 p-3">
                    <MemberAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={member.user.name}
                      image={member.user.image ?? undefined}
                    />
                    <div className="flex flex-col items-center overflow-hidden">
                      <p className="line-clamp-1 text-lg font-medium">
                        {member.user.name}
                      </p>
                      <p className="line-clamp-1 text-sm font-medium">
                        {member.user.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          {data.length === 0 && (
            <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
              {t('notFound')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
