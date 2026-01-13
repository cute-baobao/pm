import { prefetch, trpc } from '@/trpc/server';

export const prefetchMilestones = (projectId: string) => {
  return prefetch(trpc.milestone.getMany.queryOptions(projectId));
};
