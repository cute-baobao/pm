'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { LoadingView } from '@/components/entity-component';
import { TaskBreadcrumbs } from '@/features/task/components/task-breadcrumbs';
import { TaskChangelogTimeline } from '@/features/task/components/task-changelog-timeline';
import { TaskDescription } from '@/features/task/components/task-description';
import { TaskOverview } from '@/features/task/components/task-overview';
import { useGetTask, useTaskId } from '@/features/task/hooks/use-task';

function TaskLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingView messageNode="Loading..." />
    </div>
  );
}

export function TaskClient() {
  const taskId = useTaskId();

  const { data: task, isLoading } = useGetTask(taskId);

  if (isLoading) {
    return <TaskLoading />;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
        <TaskChangelogTimeline />
      </div>
    </div>
  );
}
