import { taskStatusValues } from '@/db/schemas';
import { PAGINATION } from '@/lib/configs/constants';
import z from 'zod';

export const createTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  status: z.enum(taskStatusValues, {
    error: 'Status is required',
  }),
  description: z.string().nullable(),
  dueDate: z.date(),
  projectId: z.string().min(1, 'Project ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
  assignedId: z.string(),
});

export const queryTaskSchema = z.object({
  organizationId: z.string(),
  projectId: z.string().nullish(),
  assignedId: z.string().nullish(),
  status: z.enum(taskStatusValues).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export const taskPaginationSchema = queryTaskSchema.extend({
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().min(1, 'Task ID is required'),
  position: z.number().optional(),
});

export type CreateTaskData = z.infer<typeof createTaskSchema>;
export type QueryTaskData = z.infer<typeof queryTaskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;
export type TaskPaginationData = z.infer<typeof taskPaginationSchema>;
