import { env } from '@/env';
import { createAuthClient } from 'better-auth/react';
export const { signIn, signOut, signUp, useSession } = createAuthClient({
  baseURL: 'http://' + env.NEXT_PUBLIC_ROOT_DOMAIN,
});
