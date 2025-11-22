import z from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(3, 'name is required').max(50, 'name is too long'),
  slug: z.string(),
  logo: z.string(),
  metadata: z.string(),
});

export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>;
