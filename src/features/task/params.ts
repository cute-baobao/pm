import { taskStatusValues } from '@/db/schemas';
import { PAGINATION } from '@/lib/configs/constants';
import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server';

export const taskParams = {
  projectId: parseAsString,
  status: parseAsStringEnum(Object.values(taskStatusValues)),
  assignedId: parseAsString,
  search: parseAsString,
  dueDate: parseAsString,
};

export const taskPaginationParams = {
  ...taskParams,
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
};
