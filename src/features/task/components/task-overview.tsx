import { DottedSeparator } from '@/components/dotted-separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { PencilIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { useGetTask } from '../hooks/use-task';
import { OverviewProperty } from './overview-property';
import { TaskDate } from './task-date';

type TaskWithMilestone = ReturnType<typeof useGetTask>['data'];

interface TaskOverviewProps {
  task: TaskWithMilestone;
}

export function TaskOverview({ task }: TaskOverviewProps) {
  const tStatus = useTranslations('Task.Status');
  const t = useTranslations('Task.Overview');
  const { open } = useEditTaskModal();
  const slug = useOrganizationSlug();

  if (!task) return null;

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{t('title')}</p>
          <Button onClick={() => open(task.id)} size="sm" variant="secondary">
            <PencilIcon className="mr-2 size-4" />
            {t('edit')}
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label={t('assignee')}>
            <MemberAvatar
              className="size-6"
              name={task.assignedUser.name}
              image={task.assignedUser.image}
              fallbackClassName="text-[10px]"
            />
            <p className="text-sm font-medium">{task.assignedUser.name}</p>
          </OverviewProperty>
          <OverviewProperty label={t('dueDate')}>
            <TaskDate
              status={task.status}
              value={task.dueDate}
              className="text-sm font-medium"
            />
          </OverviewProperty>
          <OverviewProperty label={t('status')}>
            <Badge variant={task.status}>{tStatus(task.status)}</Badge>
          </OverviewProperty>
          <OverviewProperty label={t('milestone')}>
            {task.milestone ? (
              <Link
                href={`/organization/${slug}/projects/${task.projectId}/milestones/${task.milestone.milestoneId}`}
              >
                <span className="text-primary text-sm font-medium hover:underline">
                  {task.milestone.milestone.name}
                </span>
              </Link>
            ) : (
              <span className="text-muted-foreground text-sm">
                {t('noMilestone')}
              </span>
            )}
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}
