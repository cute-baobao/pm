import { prefetch, trpc } from '@/trpc/server';

export const prefetchOrganizationMembers = () => {
  return prefetch(trpc.organizationMember.getMany.queryOptions());
};
