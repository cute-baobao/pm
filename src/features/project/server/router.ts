import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { getManyProjectsByOrganization, getOneProject } from './service';

export const projectRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const project = await getOneProject(input.projectId);
      return project;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const projects = await getManyProjectsByOrganization(
        input.organizationId,
      );
      return projects;
    }),
});
