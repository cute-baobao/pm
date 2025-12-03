import { OrganizationRole } from '@/db/schemas';
import { PERMSSION } from '../configs/permission';

export const hasPermission = (role: OrganizationRole, action: string) => {
  const permissions = PERMSSION[role];
  return (permissions as readonly string[]).includes(action);
};
