import { taskStatusValues } from '@/db/schemas';
import { parseAsString, parseAsStringEnum } from 'nuqs/server';

export const taskParams = {
  projectId: parseAsString,
  status: parseAsStringEnum(Object.values(taskStatusValues)),
  assignedId: parseAsString,
  search: parseAsString,
  dueDate: parseAsString,
};
