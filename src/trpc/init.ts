import db from '@/db';
import { auth } from '@/lib/auth';
import { PERMSSION } from '@/lib/configs/permission';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Error.unauthorized',
    });
  }

  const user = {
    ...session.user,
    image: session.user.image ?? null,
  };

  return next({ ctx: { ...ctx, auth: { ...session, user } } });
});

// check user permission procedure
export const permissionedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const { session, user } = ctx.auth;
    if (!session.activeOrganizationId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Error.forbidden_no_active_organization',
      });
    }

    const member = await db.query.member.findFirst({
      where: (m, { eq, and }) =>
        and(
          eq(m.userId, user.id),
          eq(m.organizationId, session.activeOrganizationId!),
        ),
    });

    if (!member) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Error.forbidden_no_membership',
      });
    }

    const userWithRole: typeof user & { role: keyof typeof PERMSSION } = {
      ...user,
      role: member.role as keyof typeof PERMSSION,
    };
    return next({
      ctx: { ...ctx, auth: { session, user: userWithRole } },
    });
  },
);
