import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import {
  createProjectSchema,
  getProjectSchema,
  projectPaginationSchema,
  updateProjectSchema,
} from '../schema';
import {
  createProject,
  deleteProject,
  getManyProjectsByOrganization,
  getOneProject,
  updateProject,
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
  update: protectedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input }) => {
      const project = await updateProject(input);
      return project;
    }),
  getOne: protectedProcedure
    .input(getProjectSchema)
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
