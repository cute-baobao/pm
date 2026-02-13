import db from '@/db';
import { env } from '@/env';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  session: {
    additionalFields: {
      activeOrganizationId: {
        type: 'string',
        required: false,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  rateLimit: {
    enabled: !env.BETTER_AUTH_DISABLE_RATE_LIMIT,
  },
});
