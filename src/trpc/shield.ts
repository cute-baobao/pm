import { Session, User } from '@/db/schemas';
import { PERMSSION } from '@/lib/configs/permission';
import { rule } from 'trpc-shield/src';

export type Context = {
  auth?: {
    session: Session;
    user: User & { role: keyof typeof PERMSSION };
  };
};

export const anyone = rule<Context>()(async () => {
  return true;
});

export const isOrganizationMember = rule<Context>()(async (ctx) => {
  return ctx.auth?.user.role !== undefined;
});

export const isOrganizationAdmin = rule<Context>()(async (ctx) => {
  return ctx.auth?.user.role === 'admin';
});

export const isOrganizationOwner = rule<Context>()(async (ctx) => {
  console.log('Checking isOwner for user role:', ctx.auth?.user.role);
  return ctx.auth?.user.role === 'owner';
});
