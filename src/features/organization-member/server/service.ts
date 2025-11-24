import db from '@/db';
import { invitation } from '@/db/schemas';
import { InviteMemberData } from '../schema';

export const inviteMember = async (
  data: InviteMemberData,
  inviterId: string,
) => {
  const [result] = await db
    .insert(invitation)
    .values({
      organizationId: data.organizationId,
      email: data.email,
      role: data.role,
      inviterId: inviterId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    })
    .returning();
};

export const getOrganizationMembers = async (organizationId: string) => {
  const members = await db.query.member.findMany({
    where: (member, { eq }) => eq(member.organizationId, organizationId),
    with: {
      user: true,
    },
  });

  return members;
};
