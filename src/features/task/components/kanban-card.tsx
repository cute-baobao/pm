import { DottedSeparator } from '@/components/dotted-separator';
import { Project, Task, User } from '@/db/schemas';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { ProjectAvatar } from '@/features/project/components/project-avatar';
import { MoreHorizontalIcon } from 'lucide-react';
import { TaskAction } from './task-action';
import { TaskDate } from './task-date';

export type TaskEnhanced = Task & { project: Project; assignedUser: User };

interface KanbanCardProps {
  task: TaskEnhanced;
}

export function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="mb-1.5 space-y-3 rounded bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>
        <TaskAction id={task.id} projectId={task.projectId}>
          <MoreHorizontalIcon className="size-[18px] shrink-0 stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskAction>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          className="size-6"
          name={task.assignedUser.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          className="size-6"
          name={task.project.name}
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
}
