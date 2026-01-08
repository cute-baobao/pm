import { Project, TaskStatus, taskStatusValues, User } from '@/db/schemas';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { ProjectAvatar } from '@/features/project/components/project-avatar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';

type EventType = {
  start: Date;
  end: Date;
  title: string;
  project: Project;
  assignee: User;
  id: string;
  status: TaskStatus;
};

interface EventCardProps {
  data: EventType;
}

const statusColorMap: Record<TaskStatus, string> = {
  [taskStatusValues[0]]: 'border-l-pink-500',
  [taskStatusValues[1]]: 'border-l-red-500',
  [taskStatusValues[2]]: 'border-l-yellow-500',
  [taskStatusValues[3]]: 'border-l-blue-500',
  [taskStatusValues[4]]: 'border-l-emerald-500',
};

export function EventCard({ data }: EventCardProps) {
  const { title, project, assignee, id, status } = data;
  const slug = useOrganizationSlug();
  const router = useRouter();
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    router.push(`/organization/${slug}/projects/${project.id}/task/${id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          'text-primary flex cursor-pointer flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5 text-xs transition hover:opacity-75',
          statusColorMap[status],
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar
            className="size-6"
            name={assignee.name}
            fallbackClassName="text-[10px]"
          />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.image ?? undefined}
            fallbackClassName="text-[10px]"
          />
        </div>
      </div>
    </div>
  );
}
