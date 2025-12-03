import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { createTaskSchema, queryTaskSchema } from '../schema';
import { createTask, getManyTasksByFilters } from './service';

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
});
