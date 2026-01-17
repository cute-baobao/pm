import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import {
  addTasksToMilestoneSchema,
  createMilestoneSchema,
  milestonePaginationSchema,
  updateMilestoneSchema,
} from '../schema';
import {
  addTasksToMilestone,
  createMilestone,
  deleteMilestoneById,
  getManyMilestones,
  getMilestone,
  getMilestonesAnalytics,
  updateMilestone,
} from './service';

export const milestoneRouter = createTRPCRouter({
  getAnalytics: permissionedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return getMilestonesAnalytics(input.projectId);
    }),
  create: permissionedProcedure
    .input(createMilestoneSchema)
    .mutation(async ({ ctx, input }) => {
      const { activeOrganizationId } = ctx.auth.session;
      if (activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await createMilestone(input);
    }),
  update: permissionedProcedure
    .input(updateMilestoneSchema)
    .mutation(async ({ ctx, input }) => {
      return updateMilestone(input);
    }),
  getMany: permissionedProcedure
    .input(milestonePaginationSchema)
    .query(async ({ input }) => {
      return getManyMilestones(input);
    }),
  getById: permissionedProcedure
    .input(z.string().min(1, 'Milestone ID is required'))
    .query(async ({ input }) => {
      const milestone = await getMilestone(input);
      return milestone;
    }),
  delete: permissionedProcedure
    .input(z.string().min(1, 'Milestone ID is required'))
    .mutation(async ({ input }) => {
      return deleteMilestoneById(input);
    }),
  addTasks: permissionedProcedure
    .input(addTasksToMilestoneSchema)
    .mutation(async ({ input }) => {
      return addTasksToMilestone(input);
    }),
});
