import { organizationMemberRouter } from '@/features/organization-member/server/router';
import { organizationRouter } from '@/features/organization/server/router';
import { projectRouter } from '@/features/project/server/router';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  organizationMember: organizationMemberRouter,
  project: projectRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
