import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useMilestoneParams } from './use-milestone-params';

export const useSuspenseMilestones = (projectId: string) => {
  const trpc = useTRPC();
  const params = useMilestoneParams();

  return useSuspenseQuery({
    ...trpc.milestone.getMany.queryOptions({
      ...params,
      projectId,
    }),
  });
};

export const useCreateMilestone = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useMilestoneParams();

  return useMutation(
    trpc.milestone.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions({
            projectId: data.projectId,
            ...params,
          }),
        );
      },
    }),
  );
};

export const useUpdateMilestone = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useMilestoneParams();

  return useMutation(
    trpc.milestone.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions({
            projectId: data.projectId,
            ...params,
          }),
        );
      },
    }),
  );
};

export const useDeleteMilestone = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useMilestoneParams();

  return useMutation(
    trpc.milestone.delete.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions({
            projectId: data.projectId,
            ...params,
          }),
        );
      },
    }),
  );
};
