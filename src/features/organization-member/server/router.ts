import {
  adminOrOwnerProcedure,
  createTRPCRouter,
  memberProcedure,
  protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import {
  deleteMemberSchema,
  exitOrganizationSchema,
  inviteMemberSchema,
  joinOrganizationViaInvitationSchema,
  updateMemberRoleSchema,
} from '../schema';
import {
  checkInvitationAvailability,
  deleteMember,
  exitOrganization,
  getOrganizationMembers,
  inviteMember,
  joinOrganizationViaInvitation,
  updateMemberRole,
} from './service';

export const organizationMemberRouter = createTRPCRouter({
  invite: adminOrOwnerProcedure
    .input(inviteMemberSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.auth.session.activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }
      const result = await inviteMember(input, ctx.auth.user.id);
      return result;
    }),
  getMany: memberProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      if (ctx.auth.session.activeOrganizationId !== input.organizationId) {
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
  updateRole: adminOrOwnerProcedure
    .input(updateMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.auth.session.activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      const result = await updateMemberRole(input);
      return result;
    }),
  delete: adminOrOwnerProcedure
    .input(deleteMemberSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.auth.session.activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await deleteMember(input);
    }),
  joinOrganizationViaInvitation: protectedProcedure
    .input(joinOrganizationViaInvitationSchema)
    .mutation(async ({ input }) => {
      // check invitation availability
      const record = await checkInvitationAvailability(input);
      const result = await joinOrganizationViaInvitation(input);
      return { ...result, slug: record.organization.slug };
    }),
  exitOrganization: memberProcedure
    .input(exitOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      return await exitOrganization(input, ctx.auth.user.id);
    }),
});
