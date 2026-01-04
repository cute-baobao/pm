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
import { AnalyticsParams, GetProjectParams } from '../schema';
import { useProjectsParams } from './use-project-params';

export const useProjectId = () => {
  const params = useParams<{ projectId: string }>();
  return params?.projectId as string;
};

export const useSuspenseProjects = (organizationId: string) => {
  const trpc = useTRPC();
  const [params] = useProjectsParams();

  return useSuspenseQuery(
    trpc.project.getMany.queryOptions({ organizationId, ...params }),
  );
};

export const useSuspenseProject = (params: GetProjectParams) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.project.getOne.queryOptions(params));
};

export const useGetProject = (organizationId: string) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.project.getManyWithNoPagination.queryOptions({ organizationId }),
  );
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

export const useDeleteProject = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations('Project');
  const tRoot = useTranslations();

  return useMutation(
    trpc.project.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('deleteSuccess'));
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
        toast.error(t('deleteError', { message }));
      },
    }),
  );
};

export const useUpdateProject = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.project.update.mutationOptions({
      onSuccess: (data) => {
        toast.success('Project updated successfully');
        queryClient.invalidateQueries(
          trpc.project.getMany.queryOptions({
            organizationId: data.organizationId,
          }),
        );
      },
      onError: (error) => {
        toast.error('Failed to update project: ' + error.message);
      },
    }),
  );
};

export const useSuspenseProjectAnalytics = (params: AnalyticsParams) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.project.analytics.queryOptions(params));
};
