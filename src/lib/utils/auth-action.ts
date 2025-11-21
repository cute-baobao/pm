'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { protocol, rootDomain } from '.';
import { auth } from '../auth';

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('Auth check, session:', session);

  if (!session) {
    redirect(`${protocol}://${rootDomain}/login`);
  }

  return session;
}

export async function requireNoAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log('No-auth check, session:', session);

  if (session) {
    redirect(`${protocol}://${rootDomain}`);
  }
}
