import db, { withUser } from '@/db';
import { invitation, member } from '@/db/schemas';
import { env } from '@/env';
import { OrganizationInviteTemplate } from '@/lib/templates/invite-organization-email';
import { protocol, rootDomain } from '@/lib/utils';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { InviteMemberData } from '../schema';

export const inviteMember = async (
  data: InviteMemberData,
  inviterId: string,
) => {
  const r = await db.transaction(async (tx) => {
    const check = await tx.query.invitation.findFirst({
      where: (inv, { eq, and, gt }) =>
        and(
          eq(inv.email, data.email),
          eq(inv.organizationId, data.organizationId),
          gt(inv.expiresAt, new Date()),
        ),
    });

    if (check) {
      throw new TRPCError({
        code: 'CONFLICT',
        message:
          'An active invitation already exists for this email and organization.',
      });
    }

    const [result] = await tx
      .insert(invitation)
      .values({
        organizationId: data.organizationId,
        email: data.email,
        role: data.role,
        inviterId: inviterId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      })
      .returning();

    const organization = await db.query.organization.findFirst({
      where: (org, { eq }) => eq(org.id, data.organizationId),
    });
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'projects <projects@redbao.space>',
      to: [data.email],
      subject: `Projects: 您被邀请加入${organization?.name || '组织'}`,
      react: OrganizationInviteTemplate({
        organizationName: organization?.name || '您的组织',
        inviteLink: `${protocol}://${rootDomain}/organization/invite?token=${result.id}`,
      }),
    });

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to send invitation email: ${error.message}`,
      });
    }

    return result;
  });

  return r;
};

export const getOrganizationMembers = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  console.log(123);
  const members = await withUser(userId, async (tx) => {
    return await tx.query.member.findMany({
      where: (member, { eq }) => eq(member.organizationId, organizationId),
      with: {
        user: true,
      },
    });
  });

  return members;
};

export const joinOrganizationViaInvitation = async (
  token: string,
  userId: string,
  email: string,
) => {
  const result = await db.transaction(async (tx) => {
    const invitationRecord = await tx.query.invitation.findFirst({
      where: (inv, { eq, and }) => and(eq(inv.id, token), eq(inv.email, email)),
    });

    console.log('invitationRecord', invitationRecord);

    if (!invitationRecord || invitationRecord.expiresAt < new Date()) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invitation token is invalid or has expired.',
      });
    }

    const isMember = await tx.query.member.findFirst({
      where: (mem, { and, eq }) =>
        and(
          eq(mem.organizationId, invitationRecord.organizationId),
          eq(mem.userId, userId),
        ),
    });

    if (isMember) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User is already a member of the organization.',
      });
    }

    const [memberRecord] = await tx
      .insert(member)
      .values({
        organizationId: invitationRecord.organizationId,
        userId: userId,
        role: invitationRecord.role || 'member',
      })
      .returning();

    await tx.delete(invitation).where(eq(invitation.id, invitationRecord.id));

    return memberRecord;
  });

  return result;
};
