import { OrganizationRole } from '@/db/schemas';

export const PERMISSION: Record<OrganizationRole, readonly string[]> = {
  owner: ['create', 'read', 'update', 'delete'],
  admin: ['create', 'read', 'update'],
  member: ['read'],
} as const;
