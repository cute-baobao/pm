import { prefetch, trpc } from '@/trpc/server';
import { MilestonePaginationInput } from '../schema';

export const prefetchMilestones = (input: MilestonePaginationInput) => {
  return prefetch(trpc.milestone.getMany.queryOptions(input));
};
