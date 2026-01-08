import { prefetch, trpc } from '@/trpc/server';
import { OrganizationAnalyticsParams } from '../schema';

export const prefetchOrganizations = () => {
  return prefetch(trpc.organization.getList.queryOptions());
};

export const prefetchOrganization = (slug: string) => {
  return prefetch(trpc.organization.getOne.queryOptions({ slug }));
};

export const prefetchOrganizationAnalytics = (params: OrganizationAnalyticsParams) => {
  return prefetch(trpc.organization.analytics.queryOptions(params));
}