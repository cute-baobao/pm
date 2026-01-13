import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

export const useSuspenseMilestones = (projectId: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery({
    ...trpc.milestone.getMany.queryOptions(projectId),
  });
};

export const useCreateMilestone = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.milestone.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions(data.projectId),
        );
      },
    }),
  );
};

export const useUpdateMilestone = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.milestone.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions(data.projectId),
        );
      },
    }),
  );
};

export const useDeleteMilestone = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.milestone.delete.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions(data.projectId),
        );
      },
    }),
  );
};
