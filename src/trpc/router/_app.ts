import { organizationMemberRouter } from '@/features/organization-member/server/router';
import { organizationRouter } from '@/features/organization/server/router';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  organizationMember: organizationMemberRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
