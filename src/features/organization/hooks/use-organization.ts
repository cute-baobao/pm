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

export const useOrganizationSlug = () => {
  const params = useParams();
  return params?.slug as string;
};

export const useSuspenseOrganizations = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.organization.getList.queryOptions());
};

export const useCreateOrganization = () => {
  const trpc = useTRPC();
  const t = useTranslations('Organization');
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organization.create.mutationOptions({
      onSuccess: (data) => {
        // Invalidate any relevant queries or perform additional actions here
        toast.success(t('createSuccess', { name: data.name }));
        queryClient.invalidateQueries(trpc.organization.getList.queryOptions());
      },
      onError: (error) => {
        // 尝试查找翻译键，如果存在则使用翻译，否则使用原始错误消息
        const message = t.has(error.message) ? t(error.message) : error.message;
        toast.error(t('createError', { message }));
      },
    }),
  );
};
