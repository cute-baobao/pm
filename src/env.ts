// src/env.ts
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    DATABASE_URL: z.string().min(1, { message: 'DATABASE_URL is required' }),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    BETTER_AUTH_SECRET: z
      .string()
      .min(1, { message: 'BETTER_AUTH_SECRET is required' }),
    BETTER_AUTH_URL: z
      .string()
      .min(1, { message: 'BETTER_AUTH_URL is required' }),
    RESEND_API_KEY: z
      .string()
      .min(1, { message: 'RESEND_API_KEY is required' }),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});
