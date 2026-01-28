import { auth } from '@/lib/auth';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/router/_app';

export type TRPCCallerResult = {
  caller: Awaited<ReturnType<typeof appRouter.createCaller>>;
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
};

export const createTRPCCaller = async (
  email: string,
  password: string,
): Promise<TRPCCallerResult | null> => {
  const signUpRes = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    returnHeaders: true,
  });

  if (signUpRes.headers === null) return null;

  const sessionHeader = signUpRes.headers.getSetCookie();
  const sessionCookie = sessionHeader.find((c) =>
    c.includes('better-auth.session_token'),
  );
  if (!sessionCookie) return null;
  const ctx = await createTRPCContext({
    test: true,
    header: new Headers({
      cookie: sessionCookie || '',
    }),
  });

  const session = await auth.api.getSession({
    headers: ctx.header!,
  });

  return {
    caller: appRouter.createCaller(ctx),
    session,
  };
};
