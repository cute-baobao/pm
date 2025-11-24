import { hasPermission } from '@/lib/utils/has-permission';
import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { inviteMemberSchema } from '../schema';
import { getOrganizationMembers, inviteMember } from './service';

export const organizationMemberRouter = createTRPCRouter({
  invite: permissionedProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ input, ctx }) => {
      const permission = hasPermission(ctx.auth.user.role, 'create');
      if (!permission) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }
      return await inviteMember(input, ctx.auth.user.id);
    }),
  getMany: permissionedProcedure.query(async ({ ctx }) => {
    const permission = hasPermission(ctx.auth.user.role, 'read');
    if (!permission) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Error.forbidden_no_permission',
      });
    }
    return await getOrganizationMembers(ctx.auth.session.activeOrganizationId!);
  }),
});
