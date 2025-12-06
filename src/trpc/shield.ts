import { User } from '@/db/schemas';
import { PERMSSION } from '@/lib/configs/permission';

export type Context = {
  auth?: {
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
      activeOrganizationId?: string | null | undefined;
    };
    user: User & { role: keyof typeof PERMSSION };
  };
};

export const anyone = async (ctx: Context) => {
  return true;
};

export const isOrganizationMember = async (ctx: Context) => {
  return ctx.auth?.user.role !== undefined;
};

export const isOrganizationAdmin = async (ctx: Context) => {
  return ctx.auth?.user.role === 'admin';
};

export const isOrganizationOwner = async (ctx: Context) => {
  console.log('Checking isOwner for user role:', ctx.auth?.user.role);
  return ctx.auth?.user.role === 'owner';
};
