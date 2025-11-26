import db, { withUser } from '@/db';
import { invitation, member } from '@/db/schemas';
import { env } from '@/env';
import { OrganizationInviteTemplate } from '@/lib/templates/invite-organization-email';
import { protocol, rootDomain } from '@/lib/utils';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { Resend } from 'resend';
import {
  DeleteMemberData,
  ExitOrganizationData,
  InviteMemberData,
  JoinOrganizationViaInvitationData,
  UpdateMemberRoleData,
} from '../schema';

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
          eq(inv.status, 'pending'),
        ),
    });

    if (check) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Error.invitation_already_exists',
      });
    }

    const member = await tx.query.member.findFirst({
      where: (mem, { eq, and }) =>
        and(
          eq(mem.organizationId, data.organizationId),
          eq(mem.userId, inviterId),
        ),
    });

    if (!member) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Error.forbidden_no_membership',
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
  data: JoinOrganizationViaInvitationData,
) => {
  const { token, userId, email } = data;
  const result = await withUser(userId, async (tx) => {
    const invitationRecord = await tx.query.invitation.findFirst({
      where: (inv, { eq, and }) => and(eq(inv.id, token), eq(inv.email, email)),
    });

    if (
      !invitationRecord ||
      invitationRecord.expiresAt < new Date() ||
      invitationRecord.status !== 'pending'
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Error.invitation_invalid_or_expired',
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
        message: 'Error.user_already_member',
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

    await tx
      .update(invitation)
      .set({
        status: 'accepted',
      })
      .where(eq(invitation.id, invitationRecord.id));

    return memberRecord;
  });

  return result;
};

export const updateMemberRole = async (data: UpdateMemberRoleData) => {
  const result = await withUser(data.operatorId, async (tx) => {
    const [updated] = await tx
      .update(member)
      .set({
        role: data.role,
      })
      .where(
        and(
          eq(member.id, data.memberId),
          eq(member.organizationId, data.organizationId),
        ),
      )
      .returning();

    return updated;
  });

  return result;
};

export const deleteMember = async (data: DeleteMemberData) => {
  const result = await withUser(data.operatorId, async (tx) => {
    const [deleted] = await tx
      .delete(member)
      .where(
        and(
          eq(member.id, data.memberId),
          eq(member.organizationId, data.organizationId),
        ),
      )
      .returning();

    return deleted;
  });
  return result;
};

export const checkInvitationAvailability = async (
  data: JoinOrganizationViaInvitationData,
) => {
  const invitationRecord = await db.query.invitation.findFirst({
    where: (inv, { eq }) => eq(inv.id, data.token),
    with: {
      organization: true,
    },
  });

  if (
    !invitationRecord ||
    invitationRecord.expiresAt < new Date() ||
    invitationRecord.status !== 'pending'
  ) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Error.invitation_invalid_or_expired',
    });
  }

  if (invitationRecord.email !== data.email) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Error.invitation_email_mismatch',
    });
  }

  const member = await db.query.member.findFirst({
    where: (mem, { and, eq }) =>
      and(
        eq(mem.organizationId, invitationRecord.organizationId),
        eq(mem.userId, data.userId),
      ),
  });

  if (member) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Error.user_already_member',
    });
  }

  return invitationRecord;
};

export const exitOrganization = async (
  data: ExitOrganizationData,
  userId: string,
) => {
  const result = await withUser(userId, async (tx) => {
    const [deleted] = await tx
      .delete(member)
      .where(
        and(
          eq(member.organizationId, data.organizationId),
          eq(member.userId, userId),
        ),
      )
      .returning();

    return deleted;
  });
  return result;
};
