import { useQueryStates } from 'nuqs';
import { milestoneParams } from '../params';

export function useMilestoneParams() {
  return useQueryStates(milestoneParams);
}
