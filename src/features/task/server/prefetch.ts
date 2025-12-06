import { prefetch, trpc } from '@/trpc/server';
import { QueryTaskData } from '../schema';

export const prefetchTasks = (payload: QueryTaskData) => {
  return prefetch(trpc.task.getMany.queryOptions(payload));
};

// export const prefetchProject = (params: GetProjectParams) => {
//   return prefetch(trpc.project.getOne.queryOptions(params));
// };
