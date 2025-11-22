'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { protocol, rootDomain } from '.';
import { auth } from '../auth';

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`${protocol}://${rootDomain}/login`);
  }

  const user = {
    ...session.user,
    image: session.user.image ?? null,
  };

  return {
    ...session,
    user,
  };
}

export async function requireNoAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(`${protocol}://${rootDomain}`);
  }
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = {
    ...session.user,
    image: session.user.image ?? null,
  };

  return {
    ...session,
    user,
  };
}
