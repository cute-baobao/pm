import { hasPermission } from '@/lib/utils/has-permission';
import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import {
  deleteMemberSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
} from '../schema';
import {
  deleteMember,
  getOrganizationMembers,
  inviteMember,
  updateMemberRole,
} from './service';

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
      const result = await inviteMember(input, ctx.auth.user.id);
      return result;
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
      return await getOrganizationMembers({
        organizationId: input.organizationId,
        userId: ctx.auth.user.id,
      });
    }),
  updateRole: permissionedProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      const permission = hasPermission(ctx.auth.user.role, 'update');
      if (
        !permission ||
        ctx.auth.session.activeOrganizationId !== input.organizationId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      const result = await updateMemberRole(input);
      return result;
    }),
  delete: permissionedProcedure
    .input(deleteMemberSchema)
    .mutation(async ({ ctx, input }) => {
      const permission = hasPermission(ctx.auth.user.role, 'delete');
      if (
        !permission ||
        ctx.auth.session.activeOrganizationId !== input.organizationId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await deleteMember(input);
    }),
});
