import { organizationRoleValues } from '@/db/schemas';
import z from 'zod';

export const inviteMemberSchema = z.object({
  organizationId: z.string().min(1, 'organizationId is required'),
  role: z.enum(organizationRoleValues),
  email: z.email().min(1, 'email is required'),
});

export type InviteMemberData = z.infer<typeof inviteMemberSchema>;
