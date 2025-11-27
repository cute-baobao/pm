import { PAGINATION } from '@/lib/configs/constants';
import z from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  image: z.string().optional(),
  organizationId: z.string().min(1, 'Organization ID is required'),
  description: z.string().optional(),
});

export const projectPaginationSchema = z.object({
  organizationId: z.string(),
  page: z.number().default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(''),
});

export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type ProjectPaginationData = z.infer<typeof projectPaginationSchema>;
