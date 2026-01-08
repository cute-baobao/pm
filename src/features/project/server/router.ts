import {
  adminOrOwnerProcedure,
  createTRPCRouter,
  memberProcedure,
} from '@/trpc/init';
import z from 'zod';
import {
  analyticsSchema,
  createProjectSchema,
  getProjectSchema,
  projectPaginationSchema,
  updateProjectSchema,
} from '../schema';
import {
  analytics,
  createProject,
  deleteProject,
  getManyProjectsByOrganization,
  getManyProjectsByOrganizationNoPagination,
  getOneProject,
  updateProject,
} from './service';

export const projectRouter = createTRPCRouter({
  create: adminOrOwnerProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      const project = await createProject(input);
      return project;
    }),
  delete: adminOrOwnerProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const project = await deleteProject(input.projectId);
      return project;
    }),
  update: adminOrOwnerProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input }) => {
      const project = await updateProject(input);
      return project;
    }),
  getOne: memberProcedure.input(getProjectSchema).query(async ({ input }) => {
    const project = await getOneProject(input);
    return project;
  }),
  getMany: memberProcedure
    .input(projectPaginationSchema)
    .query(async ({ input }) => {
      const projects = await getManyProjectsByOrganization(input);
      return projects;
    }),
  getManyWithNoPagination: memberProcedure
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
  analytics: memberProcedure.input(analyticsSchema).query(async ({ input }) => {
    const data = await analytics(input);
    return data;
  }),
});
