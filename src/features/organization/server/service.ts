import db from '@/db';
import { member, organization, User } from '@/db/schemas';
import { CreateOrganizationData } from '../schema';

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
  const existingSlug = await db.query.organization.findFirst({
    where: (org, { eq }) => eq(org.slug, slug),
  });
  return !existingSlug;
};

export const createOrganiztion = async (
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
