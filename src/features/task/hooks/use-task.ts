import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTaskFilters } from './use-task-filters';

export const useTaskId = () => {
  const params = useParams();
  return params.taskId as string;
};

export const useSuspenseTasks = (organizationId: string) => {
  const trpc = useTRPC();
  const [params] = useTaskFilters();
  return useSuspenseQuery({
    ...trpc.task.getMany.queryOptions({
      ...params,
      organizationId,
    }),
  });
};

export const useCreateTask = () => {
  const trpc = useTRPC();
  const t = useTranslations('Task');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.task.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('createSuccess'));
        queryClient.invalidateQueries(
          trpc.task.getMany.queryOptions({
            organizationId: data.organizationId,
            projectId: data.projectId,
          }),
        );
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('createError', { message }));
      },
    }),
  );
};

export const useDeleteTask = () => {
  const trpc = useTRPC();
  const t = useTranslations('Task');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('createSuccess'));
        queryClient.invalidateQueries(
          trpc.task.getMany.queryOptions({
            organizationId: data.deletedTask.organizationId,
            projectId: data.deletedTask.projectId,
          }),
        );
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('createError', { message }));
      },
    }),
  );
};

export const useUpdateTask = () => {
  const trpc = useTRPC();
  const t = useTranslations('Task');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();
  const [params] = useTaskFilters();

  return useMutation(
    trpc.task.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('createSuccess'));
        queryClient.invalidateQueries(
          trpc.task.getMany.queryOptions({
            ...params,
            organizationId: data.organizationId,
          }),
        );
        queryClient.invalidateQueries(
          trpc.task.get.queryOptions({ taskId: data.id }),
        );
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('createError', { message }));
      },
    }),
  );
};

export const useBulkUpdateTasks = () => {
  const trpc = useTRPC();
  const t = useTranslations('Task');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.task.bulkUpdate.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('createSuccess'));
        queryClient.invalidateQueries(
          trpc.task.getMany.queryOptions({
            organizationId: data[0].organizationId,
            projectId: data[0].projectId,
          }),
        );
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('createError', { message }));
      },
    }),
  );
};

export const useGetTask = (taskId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.task.get.queryOptions({ taskId }));
};
