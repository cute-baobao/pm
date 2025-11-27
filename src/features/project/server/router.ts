import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { createProjectSchema, getProjectSchema, projectPaginationSchema } from '../schema';
import {
  createProject,
  deleteProject,
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
  delete: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await deleteProject(input.projectId);
      return project;
    }),
  getOne: protectedProcedure
    .input(
     getProjectSchema,
    )
    .query(async ({ input }) => {
      const project = await getOneProject(input);
      return project;
    }),
  getMany: protectedProcedure
    .input(projectPaginationSchema)
    .query(async ({ input }) => {
      const projects = await getManyProjectsByOrganization(input);
      return projects;
    }),
});
