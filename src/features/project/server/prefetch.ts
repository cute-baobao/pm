import { prefetch, trpc } from '@/trpc/server';
import { ProjectPaginationData } from '../schema';

export const prefetchProjects = (payload: ProjectPaginationData) => {
  return prefetch(trpc.project.getMany.queryOptions(payload));
};

export const prefetchProject = (projectId: string) => {
  return prefetch(trpc.project.getOne.queryOptions({ projectId }));
};
