import db from '@/db';
import { env } from '@/env';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: env.NODE_ENV === 'production',
      domain:
        env.NODE_ENV === 'production'
          ? `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
    },
    useSecureCookies: env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  },
  trustedOrigins: [
    `https://*.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    ...(env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
  ],
});
