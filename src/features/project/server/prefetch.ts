import { prefetch, trpc } from '@/trpc/server';
import { GetProjectParams, ProjectPaginationData } from '../schema';

export const prefetchProjects = (payload: ProjectPaginationData) => {
  return prefetch(trpc.project.getMany.queryOptions(payload));
};

export const prefetchProject = (params: GetProjectParams) => {
  return prefetch(trpc.project.getOne.queryOptions(params));
};
