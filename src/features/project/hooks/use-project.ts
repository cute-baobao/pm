import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useSuspenseProjects = (organizationId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.project.getMany.queryOptions({ organizationId }),
  );
};

export const useSuspenseProject = (projectId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.project.getOne.queryOptions({ projectId }));
};
