import { prefetch, trpc } from '@/trpc/server';

export const prefetchOrganizations = () => {
  return prefetch(trpc.organization.getList.queryOptions());
};
