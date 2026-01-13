import { milestoneRouter } from '@/features/milestone/server/router';
import { organizationMemberRouter } from '@/features/organization-member/server/router';
import { organizationRouter } from '@/features/organization/server/router';
import { projectRouter } from '@/features/project/server/router';
import { taskRouter } from '@/features/task/server/router';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  organizationMember: organizationMemberRouter,
  project: projectRouter,
  task: taskRouter,
  milestone: milestoneRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

const b = appRouter.createCaller({

})
