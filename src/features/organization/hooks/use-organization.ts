'use client';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { OrganizationAnalyticsParams } from '../schema';

export const useOrganizationSlug = () => {
  const params = useParams();
  return params?.slug as string;
};

export const useSuspenseOrganizations = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.organization.getList.queryOptions());
};

export const useSuspenseOrganizationAnalytics = (
  params: OrganizationAnalyticsParams,
) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.organization.analytics.queryOptions(params));
};

export const useSuspenseOrganization = (slug: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.organization.getOne.queryOptions({ slug }));
};

export const useOrganizationId = () => {
  const slug = useOrganizationSlug();
  const { data } = useSuspenseOrganization(slug);
  return data.id;
};

export const useCreateOrganization = () => {
  const trpc = useTRPC();

  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organization.create.mutationOptions({
      onSuccess: (data) => {
        // Invalidate any relevant queries or perform additional actions here
        toast.success(t('Organization.createSuccess', { name: data.name }));
        queryClient.invalidateQueries(trpc.organization.getList.queryOptions());
      },
      onError: (error) => {
        // 尝试查找翻译键，如果存在则使用翻译，否则使用原始错误消息
        const message = t.has(error.message) ? t(error.message) : error.message;
        toast.error(t('Organization.createError', { message }));
      },
    }),
  );
};

export const useUpdateOrganization = () => {
  const trpc = useTRPC();
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organization.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('Organization.updateSuccess', { name: data.name }));
        queryClient.invalidateQueries(trpc.organization.getList.queryOptions());
        queryClient.invalidateQueries(
          trpc.organization.getOne.queryOptions({ slug: data.slug }),
        );
      },
      onError: (error) => {
        const message = t.has(error.message) ? t(error.message) : error.message;
        toast.error(t('Organization.updateError', { message }));
      },
    }),
  );
};

export const useDeleteOrganization = () => {
  const trpc = useTRPC();
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organization.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('Organization.deleteSuccess', { name: data.name }));
        queryClient.invalidateQueries(trpc.organization.getList.queryOptions());
        queryClient.invalidateQueries(
          trpc.organization.getOne.queryOptions({ slug: data.slug }),
        );
      },
      onError: (error) => {
        const message = t.has(error.message) ? t(error.message) : error.message;
        toast.error(t('Organization.deleteError', { message }));
      },
    }),
  );
};
