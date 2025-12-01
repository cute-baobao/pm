import { createTRPCRouter, permissionedProcedure } from '@/trpc/init';
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
  getManyProjectsByOrganizationNoPagination,
  getOneProject,
  updateProject,
} from './service';

export const projectRouter = createTRPCRouter({
  create: permissionedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      const project = await createProject(input);
      return project;
    }),
  delete: permissionedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await deleteProject(input.projectId);
      return project;
    }),
  update: permissionedProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input }) => {
      const project = await updateProject(input);
      return project;
    }),
  getOne: permissionedProcedure
    .input(getProjectSchema)
    .query(async ({ input }) => {
      const project = await getOneProject(input);
      return project;
    }),
  getMany: permissionedProcedure
    .input(projectPaginationSchema)
    .query(async ({ input }) => {
      const projects = await getManyProjectsByOrganization(input);
      return projects;
    }),
  getManyWithNoPagination: permissionedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const projects = await getManyProjectsByOrganizationNoPagination(
        input.organizationId,
      );
      return projects;
    }),
});
