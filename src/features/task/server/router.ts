import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createTaskSchema, queryTaskSchema, updateTaskSchema } from '../schema';
import {
  bulkUpdateTasks,
  createTask,
  delteTaskById,
  getManyTasksByFilters,
  getTaskById,
  updateTask,
} from './service';

export const taskRouter = createTRPCRouter({
  create: permissionedProcedure
    .input(createTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const { activeOrganizationId } = ctx.auth.session;
      if (activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await createTask(input);
    }),
  getMany: permissionedProcedure
    .input(queryTaskSchema)
    .query(async ({ ctx, input }) => {
      const { activeOrganizationId } = ctx.auth.session;
      if (activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await getManyTasksByFilters(input);
    }),
  delete: permissionedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedTask = await delteTaskById(input.taskId);
      return { deletedTask };
    }),
  update: permissionedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input }) => {
      const task = await updateTask(input);

      return task;
    }),
  bulkUpdate: permissionedProcedure
    .input(z.array(updateTaskSchema))
    .mutation(async ({ input }) => {
      const tasks = await bulkUpdateTasks(input);
      return tasks;
    }),
  get: permissionedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const task = await getTaskById(input.taskId);
      return task;
    }),
});
