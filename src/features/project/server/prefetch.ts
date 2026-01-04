import { prefetch, trpc } from '@/trpc/server';
import { AnalyticsParams, GetProjectParams, ProjectPaginationData } from '../schema';

export const prefetchProjects = (payload: ProjectPaginationData) => {
  return prefetch(trpc.project.getMany.queryOptions(payload));
};

export const prefetchProject = (params: GetProjectParams) => {
  return prefetch(trpc.project.getOne.queryOptions(params));
};

export const prefetchProjectAnalytics = (params: AnalyticsParams) => {
  return prefetch(trpc.project.analytics.queryOptions(params));
}