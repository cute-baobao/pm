'use client';

import { Analytics } from '@/components/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskViewSwitcher } from '@/features/task/components/task-view-switcher';
import { useSession } from '@/lib/auth-client';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  useSuspenseProject,
  useSuspenseProjectAnalytics,
} from '../hooks/use-project';
import { ProjectAvatar } from './project-avatar';

interface ProjectViewProps {
  slug: string;
  projectId: string;
  userId: string;
}

export function ProjectView({ slug, projectId, userId }: ProjectViewProps) {
  const { data: sessionData } = useSession();
  const organizationId = sessionData?.session?.activeOrganizationId || '';
  const router = useRouter();
  const { data } = useSuspenseProject({
    organizationId,
    projectId,
  });

  const { data: analytics } = useSuspenseProjectAnalytics({
    projectId,
    assigneeId: userId,
  });

  const onNewTask = () => {
    router.push(`/organization/${slug}/projects/${projectId}/task/new`);
  };

  if (data === undefined || analytics === undefined) {
    throw notFound();
  }

  return (
    <>
      <Card className="h-full w-full border-none p-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle>
              <div className="flex items-center gap-2">
                <ProjectAvatar
                  image={data.image ? data.image : undefined}
                  name={data.name}
                />
                <span className="flex text-lg">{data.name}</span>
              </div>
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href={`/organization/${slug}/projects/${data.id}/edit`}>
                <EditIcon className="mr-2 size-4" />
                Edit Project
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col gap-y-4">
            <Analytics data={analytics} />
            <TaskViewSwitcher
              organizationId={organizationId}
              onNewTask={onNewTask}
              hideProjectFilter
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
