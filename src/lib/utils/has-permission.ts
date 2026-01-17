import { OrganizationRole } from '@/db/schemas';
import { PERMISSION } from '../configs/permission';

export const hasPermission = (role: OrganizationRole, action: string) => {
  const permissions = PERMISSION[role];
  return (permissions as readonly string[]).includes(action);
};
