import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { QueryTaskData } from '../schema';

export const useSuspenseTasks = (data: QueryTaskData) => {
  const trpc = useTRPC();
  return useQuery(trpc.task.getMany.queryOptions(data));
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
