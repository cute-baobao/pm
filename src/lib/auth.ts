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
      enabled: true,
      domain: `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
    },
    useSecureCookies: env.NODE_ENV === 'production',
  },
  trustedOrigins: [
    `*.${env.NEXT_PUBLIC_ROOT_DOMAIN}`, // For development
    `https://${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
  ],
});
