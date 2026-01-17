import { createTRPCRouter, memberProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import {
  createTaskSchema,
  queryTaskSchema,
  taskPaginationSchema,
  updateTaskSchema,
} from '../schema';
import {
  bulkUpdateTasks,
  createTask,
  deleteTaskById,
  getManyTasksByFilters,
  getManyTasksWithPagination,
  getTaskById,
  getTaskChangeLog,
  getTaskWithoutMilestoneSelect,
  updateTask,
} from './service';

export const taskRouter = createTRPCRouter({
  create: memberProcedure
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
  getMany: memberProcedure
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
  getManyWithPagination: memberProcedure
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
  getTaskWithoutMilestoneSelect: memberProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { activeOrganizationId } = ctx.auth.session;
      return await getTaskWithoutMilestoneSelect(
        activeOrganizationId!,
        input.projectId,
      );
    }),
  delete: memberProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const deletedTask = await deleteTaskById(input.taskId);
      return { deletedTask };
    }),
  update: memberProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      const task = await updateTask(input, ctx.auth.session.userId);

      return task;
    }),
  bulkUpdate: memberProcedure
    .input(z.array(updateTaskSchema))
    .mutation(async ({ input, ctx }) => {
      const tasks = await bulkUpdateTasks(input, ctx.auth.session.userId);
      return tasks;
    }),
  get: memberProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const task = await getTaskById(input.taskId);
      return task;
    }),
  getChangeLog: memberProcedure
    .input(
      z.object({
        taskId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await getTaskChangeLog(input.taskId);
    }),
});
