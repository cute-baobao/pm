import { useQueryStates } from 'nuqs';
import { projectsParams } from '../params';

export function useProjectsParams() {
  return useQueryStates(projectsParams);
}
