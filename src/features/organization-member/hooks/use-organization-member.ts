import { useTRPC } from '@/trpc/client';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useSuspenseOrganizationMembers = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.organizationMember.getMany.queryOptions({ organizationId: id }),
  );
};

export const useInviteOrganizationMember = () => {
  const trpc = useTRPC();
  const t = useTranslations();
  return useMutation(
    trpc.organizationMember.invite.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('OrganizationMember.inviteSuccess'));
      },
      onError: (error) => {
        const message = t.has(error.message) ? t(error.message) : error.message;
        toast.error(t('OrganizationMember.inviteError', { message }));
      },
    }),
  );
};
