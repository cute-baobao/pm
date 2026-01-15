import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createTaskSchema, queryTaskSchema, taskPaginationSchema, updateTaskSchema } from '../schema';
import {
  bulkUpdateTasks,
  createTask,
  deleteTaskById,
  getManyTasksByFilters,
  getManyTasksWithPagination,
  getTaskById,
  getTaskChangeLog,
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

      return await createTask(input, ctx.auth.session.userId);
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
  getManyWithPagination: permissionedProcedure
    .input(taskPaginationSchema)
    .query(async ({ ctx, input }) => {
      const { activeOrganizationId } = ctx.auth.session;
      if (activeOrganizationId !== input.organizationId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Error.forbidden_no_permission',
        });
      }

      return await getManyTasksWithPagination(input);
    }),
  delete: permissionedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedTask = await deleteTaskById(input.taskId);
      return { deletedTask };
    }),
  update: permissionedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await updateTask(input, ctx.auth.session.userId);

      return task;
    }),
  bulkUpdate: permissionedProcedure
    .input(z.array(updateTaskSchema))
    .mutation(async ({ input, ctx }) => {
      const tasks = await bulkUpdateTasks(input, ctx.auth.session.userId);
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
  getChangeLog: permissionedProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await getTaskChangeLog(input.taskId);
    }),
});
