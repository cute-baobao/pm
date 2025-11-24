'use server';
import { Member, Organization } from '@/db/schemas';
import {
  getOrganizations,
  getUserMembers,
  setActiveOrganization,
} from '@/features/organization/server/service';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
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

interface getSessionPayload {
  withOrganizations?: boolean;
  withMembers?: boolean;
}

export async function getSession({
  withMembers = false,
  withOrganizations = false,
}: getSessionPayload) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  let organizations: Organization[] = [];
  let members: Member[] = [];

  if (withOrganizations) {
    organizations = await getOrganizations(session.user.id);
  }

  if (withMembers) {
    members = await getUserMembers(session.user.id);
  }

  const user = {
    ...session.user,
    image: session.user.image ?? null,
    organizations,
    members,
  };

  return {
    ...session,
    user,
  };
}

export async function requireOrganizationAccess(
  slug: string,
  withMembers = false,
) {
  const session = await getSession({
    withOrganizations: true,
    withMembers,
  });
  if (!session) {
    redirect('/login');
  }

  const hasAccess = session.user.organizations.find((org) => org.slug === slug);

  if (!hasAccess) {
    await setActiveOrganization(session.session.token, null);
    notFound();
  }

  await setActiveOrganization(session.session.token, hasAccess.id);
  return session;
}
