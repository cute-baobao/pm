'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskViewSwitcher } from '@/features/task/components/task-view-switcher';
import { EditIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useSuspenseProject } from '../hooks/use-project';
import { ProjectAvatar } from './project-avatar';

interface ProjectViewProps {
  slug: string;
  organizationId: string;
  projectName: string;
}

export function ProjectView({
  slug,
  organizationId,
  projectName,
}: ProjectViewProps) {
  const { data } = useSuspenseProject({
    organizationId,
    projectName,
  });

  if (data === undefined) {
    throw notFound();
  }

  return (
    <Card className="h-full w-full shadow-none">
      <CardHeader>
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
            <Link href={`/organization/${slug}/projects/${data.name}/edit`}>
              <EditIcon className="mr-2 size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TaskViewSwitcher />
      </CardContent>
    </Card>
  );
}
