import { taskStatusValues } from '@/db/schemas';
import { PAGINATION } from '@/lib/configs/constants';
import { parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server';

export const taskParams = {
  projectId: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  status: parseAsStringEnum(Object.values(taskStatusValues)).withOptions({
    clearOnDefault: true,
  }),
  assignedId: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withOptions({
    clearOnDefault: true,
  }),
  dueDate: parseAsString.withOptions({
    clearOnDefault: true,
  }),
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
