import { useQueryStates } from 'nuqs';
import { taskParams } from '../params';

export function useTaskFilters() {
  return useQueryStates(taskParams);
}
