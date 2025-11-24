import db from '@/db';
import { member, organization, session, User } from '@/db/schemas';
import { eq, getTableColumns } from 'drizzle-orm';
import { CreateOrganizationData, UpdateOrganizationData } from '../schema';

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  const existingSlug = await db.query.organization.findFirst({
    where: (org, { eq }) => eq(org.slug, slug),
  });
  return !existingSlug;
};

export const createOrganization = async (
  input: CreateOrganizationData,
  user: User,
) => {
  const result = await db.transaction(async (tx) => {
    const [o] = await tx
      .insert(organization)
      .values({
        name: input.name,
        slug: input.slug,
        logo: input.logo,
        metadata: input.metadata,
      })
      .returning();
    await tx.insert(member).values({
      organizationId: o.id,
      userId: user.id,
      role: 'owner',
    });
    return o;
  });

  return result;
};

export const getOrganizations = async (userId: string) => {
  const orgs = await db
    .select({ ...getTableColumns(organization) })
    .from(organization)
    .leftJoin(member, eq(organization.id, member.organizationId))
    .where(eq(member.userId, userId));

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

export const updateOrganization = async (data: UpdateOrganizationData) => {
  const [result] = await db
    .update(organization)
    .set({
      name: data.name,
      logo: data.logo,
      metadata: data.metadata,
      slug: data.slug,
    })
    .where(eq(organization.id, data.id))
    .returning();

  return result;
};

export const deleteOrganization = async (id: string) => {
  const [result] = await db
    .delete(organization)
    .where(eq(organization.id, id))
    .returning();

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
  const members = await db.query.member.findMany({
    where: (m, { eq }) => eq(m.userId, userId),
  });
  return members;
};

export const inviteToUserOrganization = async () => {};
