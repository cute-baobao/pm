import { milestoneStatusValues } from '@/db/schemas';
import z from 'zod';

export const createMilestoneSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  projectId: z.string().min(1, 'Project ID is required'),
  name: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: z.string().optional(),
  targetDate: z.date().optional(),
  createdBy: z.string().min(1, 'Creator ID is required'),
  taskIds: z.array(z.string()).optional(),
});

export const updateMilestoneSchema = z.object({
  milestoneId: z.string().min(1, 'Milestone ID is required'),
  name: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters')
    .optional(),
  description: z.string().optional(),
  targetDate: z.date().optional(),
  status: z.enum(milestoneStatusValues).optional(),
  taskIds: z.array(z.string()).optional(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
