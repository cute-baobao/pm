import { organizationRoleValues } from '@/db/schemas';
import z from 'zod';

export const inviteMemberSchema = z.object({
  organizationId: z.string().min(1, 'organizationId is required'),
  role: z.enum(organizationRoleValues),
  email: z.email().min(1, 'email is required'),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1, 'memberId is required'),
  role: z.enum(organizationRoleValues),
  organizationId: z.string().min(1, 'organizationId is required'),
  operatorId: z.string().min(1, 'operatorId is required'),
});

export const deleteMemberSchema = z.object({
  memberId: z.string().min(1, 'memberId is required'),
  organizationId: z.string().min(1, 'organizationId is required'),
  operatorId: z.string().min(1, 'operatorId is required'),
});

export const joinOrganizationViaInvitationSchema = z.object({
  token: z.string().min(1, 'token is required'),
  userId: z.string().min(1, 'userId is required'),
  email: z.string().min(1, 'email is required'),
});

export const exitOrganizationSchema = z.object({
  organizationId: z.string().min(1, 'organizationId is required'),
  userId: z.string().min(1, 'userId is required'),
});

export type InviteMemberData = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleData = z.infer<typeof updateMemberRoleSchema>;
export type DeleteMemberData = z.infer<typeof deleteMemberSchema>;
export type JoinOrganizationViaInvitationData = z.infer<
  typeof joinOrganizationViaInvitationSchema
>;
export type ExitOrganizationData = z.infer<typeof exitOrganizationSchema>;
