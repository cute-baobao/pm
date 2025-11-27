import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { createProjectSchema, projectPaginationSchema } from '../schema';
import {
  createProject,
  getManyProjectsByOrganization,
  getOneProject,
} from './service';

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      const project = await createProject(input);
      return project;
    }),
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
    .input(projectPaginationSchema)
    .query(async ({ input }) => {
      const projects = await getManyProjectsByOrganization(input);
      return projects;
    }),
});
