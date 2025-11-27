import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useProjectsParams } from './use-project-params';

export const useSuspenseProjects = (organizationId: string) => {
  const trpc = useTRPC();
  const [params] = useProjectsParams();

  return useSuspenseQuery(
    trpc.project.getMany.queryOptions({ organizationId, ...params }),
  );
};

export const useSuspenseProject = (projectId: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.project.getOne.queryOptions({ projectId }));
};

export const useCreateProject = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations('Project');
  const tRoot = useTranslations();

  return useMutation(
    trpc.project.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('createSuccess'));
        queryClient.invalidateQueries(
          trpc.project.getMany.queryOptions({
            organizationId: data.organizationId,
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
