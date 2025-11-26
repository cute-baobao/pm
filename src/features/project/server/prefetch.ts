import { prefetch, trpc } from '@/trpc/server';

export const prefetchProjects = (organizationId: string) => {
  return prefetch(trpc.project.getMany.queryOptions({ organizationId }));
};

export const prefetchProject = (projectId: string) => {
  return prefetch(trpc.project.getOne.queryOptions({ projectId }));
};
