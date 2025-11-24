import { hasPermission } from '@/lib/utils/has-permission';
import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { inviteMemberSchema } from '../schema';
import { getOrganizationMembers, inviteMember } from './service';

export const organizationMemberRouter = createTRPCRouter({
  invite: permissionedProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ input, ctx }) => {
      const permission = hasPermission(ctx.auth.user.role, 'create');
      if (
        !permission ||
        ctx.auth.session.activeOrganizationId !== input.organizationId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }
      return await inviteMember(input, ctx.auth.user.id);
    }),
  getMany: permissionedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      const permission = hasPermission(ctx.auth.user.role, 'read');
      if (
        !permission ||
        ctx.auth.session.activeOrganizationId !== input.organizationId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }
      return await getOrganizationMembers(input.organizationId);
    }),
});
