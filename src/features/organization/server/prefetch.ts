import { prefetch, trpc } from '@/trpc/server';

export const prefetchOrganizations = () => {
  return prefetch(trpc.organization.getList.queryOptions());
};

export const prefetchOrganization = (slug: string) => {
  return prefetch(trpc.organization.getOne.queryOptions({ slug }));
};
