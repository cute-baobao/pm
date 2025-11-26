import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
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
  const t = useTranslations('OrganizationMember');
  const tRoot = useTranslations();

  return useMutation(
    trpc.organizationMember.invite.mutationOptions({
      onSuccess: () => {
        toast.success(t('inviteSuccess'));
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('inviteError', { message }));
      },
    }),
  );
};

export const useUpdateOrganizationMemberRole = () => {
  const trpc = useTRPC();
  const t = useTranslations('OrganizationMember');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organizationMember.updateRole.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          toast.success(t('updateRoleSuccess'));
          queryClient.invalidateQueries(
            trpc.organizationMember.getMany.queryOptions({
              organizationId: data.organizationId,
            }),
          );
          return;
        }
        toast.error(t('updateRoleError'));
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('updateRoleError', { message }));
      },
    }),
  );
};

export const useDeleteOrganizationMember = () => {
  const trpc = useTRPC();
  const t = useTranslations('OrganizationMember');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organizationMember.delete.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('deleteMemberSuccess'));
        queryClient.invalidateQueries(
          trpc.organizationMember.getMany.queryOptions({
            organizationId: data.organizationId,
          }),
        );
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('deleteMemberError', { message }));
      },
    }),
  );
};

export const useJoinOrganizationViaInvitation = () => {
  const trpc = useTRPC();
  const t = useTranslations('OrganizationMember');
  const tRoot = useTranslations();

  return useMutation(
    trpc.organizationMember.joinOrganizationViaInvitation.mutationOptions({
      onSuccess: () => {
        toast.success(t('joinSuccess'));
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('joinError', { message }));
      },
    }),
  );
};

export const useExitOrganization = () => {
  const trpc = useTRPC();
  const t = useTranslations('OrganizationMember');
  const tRoot = useTranslations();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organizationMember.exitOrganization.mutationOptions({
      onSuccess: (data) => {
        toast.success(t('exitSuccess'));
        queryClient.invalidateQueries(
          trpc.organizationMember.getMany.queryOptions({
            organizationId: data.organizationId,
          }),
        );
        queryClient.invalidateQueries(trpc.organization.getList.queryOptions());
      },
      onError: (error) => {
        const message = tRoot.has(error.message)
          ? tRoot(error.message)
          : error.message;
        toast.error(t('exitError', { message }));
      },
    }),
  );
};
