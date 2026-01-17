import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMilestoneParams } from './use-milestone-params';
import { useProjectId } from '@/features/project/hooks/use-project';

export const useMilestoneId = () => {
  const params = useParams();
  return params.milestoneId as string;
};

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

export const useSuspenseMilestoneById = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery({
    ...trpc.milestone.getById.queryOptions(id),
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
          trpc.milestone.getById.queryOptions(data.id),
        );
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
          trpc.milestone.getById.queryOptions(data.id),
        );
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

export const useAddTasksToMilestone = (milestoneId: string) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useMilestoneParams();
  const projectId = useProjectId()

  return useMutation(
    trpc.milestone.addTasks.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.milestone.getById.queryOptions(milestoneId),
        );
        queryClient.invalidateQueries(
          trpc.milestone.getMany.queryOptions({
            projectId,
            ...params,
          }),
        );
      },
    }),
  );
};
