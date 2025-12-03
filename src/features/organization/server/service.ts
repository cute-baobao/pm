import db, { withUser } from '@/db';
import {
  member,
  Organization,
  organization,
  session,
  User,
} from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { CreateOrganizationData, UpdateOrganizationData } from '../schema';

import { randomUUID } from 'crypto';

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  const existingSlug = await db.query.organization.findFirst({
    where: (org, { eq }) => eq(org.slug, slug),
  });
  return !existingSlug;
};

export const createOrganization = async (
  input: CreateOrganizationData,
  user: User,
): Promise<Organization> => {
  const result = await withUser<Organization>(user.id, async (tx) => {
    const id = randomUUID();
    await tx.insert(organization).values({
      id,
      name: input.name,
      slug: input.slug,
      logo: input.logo,
      metadata: input.metadata,
    });
    await tx.insert(member).values({
      organizationId: id,
      userId: user.id,
      role: 'owner',
    });
    return {
      id,
      name: input.name,
      slug: input.slug,
      logo: input.logo,
      metadata: input.metadata || '',
      createdAt: new Date(),
    };
  });

  return result;
};

export const getOrganizations = async (userId: string) => {
  const orgs = await withUser(userId, async (tx) => {
    const members = await tx.query.member.findMany({
      where: (member, { eq }) => eq(member.userId, userId),
    });
    const orgIds = members.map((m) => m.organizationId);
    return await tx.query.organization.findMany({
      where: (org, { inArray }) => inArray(org.id, orgIds),
    });
  });

  return orgs;
};

export const setActiveOrganization = async (
  token: string,
  id: string | null,
) => {
  const [result] = await db
    .update(session)
    .set({ activeOrganizationId: id })
    .where(eq(session.token, token))
    .returning();

  return result;
};

export const updateOrganization = async (
  data: UpdateOrganizationData,
  userId: string,
) => {
  const [result] = await withUser<Organization[]>(userId, async (tx) => {
    return await tx
      .update(organization)
      .set({
        name: data.name,
        logo: data.logo,
        metadata: data.metadata,
        slug: data.slug,
      })
      .where(eq(organization.id, data.id))
      .returning();
  });

  return result;
};

export const deleteOrganization = async (id: string, userId: string) => {
  const [result] = await withUser<Organization[]>(userId, async (tx) => {
    return await tx
      .delete(organization)
      .where(eq(organization.id, id))
      .returning();
  });
  return result;
};

export const getOrganization = async (slug: string) => {
  const [org] = await db
    .select()
    .from(organization)
    .where(eq(organization.slug, slug));
  return org;
};

export const getUserMembers = async (userId: string) => {
  // const members = await db.query.member.findMany({
  //   where: (m, { eq }) => eq(m.userId, userId),
  // });
  const members = await withUser(userId, async (tx) => {
    return tx.query.member.findMany({
      where: (m, { eq }) => eq(m.userId, userId),
    });
  });
  return members;
};

export const inviteToUserOrganization = async () => {};
