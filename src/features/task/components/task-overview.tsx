import { DottedSeparator } from '@/components/dotted-separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { TaskEnhanced } from './kanban-card';
import { OverviewProperty } from './overview-property';
import { TaskDate } from './task-date';

interface TaskOverviewProps {
  task: TaskEnhanced;
}

export function TaskOverview({ task }: TaskOverviewProps) {
  const tStatus = useTranslations('Task.Status');
  const { open } = useEditTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => open(task.id)} size="sm" variant="secondary">
            <PencilIcon className="mr-2 size-4" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar
              className="size-6"
              name={task.assignedUser.name}
              image={task.assignedUser.image}
              fallbackClassName="text-[10px]"
            />
            <p className="text-sm font-medium">{task.assignedUser.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>{tStatus(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}
