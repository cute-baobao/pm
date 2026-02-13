import {
  adminOrOwnerProcedure,
  createTRPCRouter,
  memberProcedure,
  ownerProcedure,
  protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import {
  createOrganizationSchema,
  organizationAnalyticsSchema,
  updateOrganizationSchema,
} from '../schema';
import {
  analytics,
  checkSlugAvailability,
  createOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
} from './service';

export const organizationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const check = await checkSlugAvailability(input.slug);
      if (!check) {
        throw new TRPCError({
          message: 'Organization.slugConflict',
          code: 'CONFLICT',
        });
      }
      const organization = await createOrganization(input, ctx.auth.user!);
      return organization;
    }),
  getList: protectedProcedure.query(async ({ ctx }) => {
    return await getOrganizations(ctx.auth.user.id);
  }),
  getOne: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const organization = await getOrganization(input.slug);
      if (!organization) {
        throw new TRPCError({
          message: 'Organization.notFound',
          code: 'NOT_FOUND',
        });
      }
      return organization;
    }),
  update: adminOrOwnerProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.auth.session.activeOrganizationId !== input.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await updateOrganization(input, ctx.auth.user.id);
    }),
  delete: ownerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.auth.session.activeOrganizationId !== input.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }
      return await deleteOrganization(input.id, ctx.auth.user.id);
    }),
  analytics: memberProcedure
    .input(organizationAnalyticsSchema)
    .query(async ({ input, ctx }) => {
      const res = await analytics({
        organizationId: input.organizationId,
        assigneeId: ctx.auth.user.id,
      });
      return res;
    }),
});
