import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useSuspenseOrganizationMembers = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.organizationMember.getMany.queryOptions({ organizationId: id }),
  );
};
