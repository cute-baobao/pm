import { prefetch, trpc } from '@/trpc/server';

export const prefetchOrganizationMembers = (id: string) => {
  return prefetch(
    trpc.organizationMember.getMany.queryOptions({ organizationId: id }),
  );
};
