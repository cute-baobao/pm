import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useSuspenseOrganizationMembers = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.organizationMember.getMany.queryOptions());
};
