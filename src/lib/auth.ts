import db from '@/db';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  session: {
    additionalFields: {
      activeOrganizationSlug: {
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
});
