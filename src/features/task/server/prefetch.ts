import { prefetch, trpc } from '@/trpc/server';
import { QueryTaskData, TaskPaginationData } from '../schema';

export const prefetchTasks = (payload: QueryTaskData) => {
  return prefetch(trpc.task.getMany.queryOptions(payload));
};

export const prefetchTaskPagination = (payload: TaskPaginationData) => {
  return prefetch(trpc.task.getManyWithPagination.queryOptions(payload));
};

export const prefetchTaskChangeLog = (taskId: string) => {
  return prefetch(trpc.task.getChangeLog.queryOptions({ taskId }));
};

export const prefetchTaskWithoutMilestoneSelect = (projectId: string) => {
  return prefetch(
    trpc.task.getTaskWithoutMilestoneSelect.queryOptions({ projectId }),
  );
};
