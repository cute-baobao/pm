import z from 'zod';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, 'name is required')
    .max(50, 'name is too long')
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      'name can only contain letters, numbers, spaces, and hyphens',
    ),
  slug: z.string(),
  logo: z.string().min(1, 'logo is required'),
  metadata: z.string().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.extend({
  id: z.string().min(1, 'id is required'),
});

export type UpdateOrganizationData = z.infer<typeof updateOrganizationSchema>;
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
