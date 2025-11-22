import { organizationRouter } from '@/features/organization/server/router';
import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  organization: organizationRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
