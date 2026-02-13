'use server';
import db, { withUser } from '@/db';
import {
  member,
  Organization,
  organization,
  session,
  taskStatusValues,
  User,
} from '@/db/schemas';
import { eq, sql } from 'drizzle-orm';
import {
  CreateOrganizationData,
  OrganizationAnalyticsParams,
  UpdateOrganizationData,
} from '../schema';

import { randomUUID } from 'crypto';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

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

export const analytics = async (
  params: OrganizationAnalyticsParams & { assigneeId: string },
) => {
  const { organizationId, assigneeId } = params;
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const doneStatus = taskStatusValues[4];

  const result = await db.execute(sql`
    SELECT
      COUNT(*) FILTER (
        WHERE t.created_at >= ${thisMonthStart}
          AND t.created_at <= ${thisMonthEnd}
      ) AS task_count,
      COUNT(*) FILTER (
        WHERE t.created_at >= ${lastMonthStart}
          AND t.created_at <= ${lastMonthEnd}
      ) AS last_month_task_count,

      COUNT(*) FILTER (
        WHERE t.assigned_id = ${assigneeId}
          AND t.created_at >= ${thisMonthStart}
          AND t.created_at <= ${thisMonthEnd}
      ) AS assigned_task_count,
      COUNT(*) FILTER (
        WHERE t.assigned_id = ${assigneeId}
          AND t.created_at >= ${lastMonthStart}
          AND t.created_at <= ${lastMonthEnd}
      ) AS last_month_assigned_task_count,

      COUNT(*) FILTER (
        WHERE t.status <> ${doneStatus}
          AND t.created_at >= ${thisMonthStart}
          AND t.created_at <= ${thisMonthEnd}
      ) AS incompleted_task_count,
      COUNT(*) FILTER (
        WHERE t.status <> ${doneStatus}
          AND t.created_at >= ${lastMonthStart}
          AND t.created_at <= ${lastMonthEnd}
      ) AS last_month_incompleted_task_count,

      COUNT(*) FILTER (
        WHERE t.status = ${doneStatus}
          AND t.created_at >= ${thisMonthStart}
          AND t.created_at <= ${thisMonthEnd}
      ) AS complete_task_count,
      COUNT(*) FILTER (
        WHERE t.status = ${doneStatus}
          AND t.created_at >= ${lastMonthStart}
          AND t.created_at <= ${lastMonthEnd}
      ) AS last_month_complete_task_count,

      COUNT(*) FILTER (
        WHERE t.status <> ${doneStatus}
          AND t.due_date >= ${thisMonthStart}
          AND t.due_date <= ${thisMonthEnd}
      ) AS overdue_task_count,
      COUNT(*) FILTER (
        WHERE t.status <> ${doneStatus}
          AND t.due_date >= ${lastMonthStart}
          AND t.due_date <= ${lastMonthEnd}
      ) AS last_month_overdue_task_count
    FROM task t
    WHERE t.organization_id = ${organizationId}
  `);

  const row = result.rows[0] as
    | {
        task_count: number | string;
        last_month_task_count: number | string;
        assigned_task_count: number | string;
        last_month_assigned_task_count: number | string;
        incompleted_task_count: number | string;
        last_month_incompleted_task_count: number | string;
        complete_task_count: number | string;
        last_month_complete_task_count: number | string;
        overdue_task_count: number | string;
        last_month_overdue_task_count: number | string;
      }
    | undefined;

  const taskCount = Number(row?.task_count ?? 0);
  const lastMonthTaskCount = Number(row?.last_month_task_count ?? 0);
  const assignedTaskCount = Number(row?.assigned_task_count ?? 0);
  const lastMonthAssignedTaskCount = Number(
    row?.last_month_assigned_task_count ?? 0,
  );
  const incompletedTaskCount = Number(row?.incompleted_task_count ?? 0);
  const lastMonthIncompletedTaskCount = Number(
    row?.last_month_incompleted_task_count ?? 0,
  );
  const completeTaskCount = Number(row?.complete_task_count ?? 0);
  const lastMonthCompleteTaskCount = Number(
    row?.last_month_complete_task_count ?? 0,
  );
  const overdueTaskCount = Number(row?.overdue_task_count ?? 0);
  const lastMonthOverdueTaskCount = Number(
    row?.last_month_overdue_task_count ?? 0,
  );

  const taskDifference = taskCount - lastMonthTaskCount;
  const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTaskCount;
  const incompletedTaskDifference =
    incompletedTaskCount - lastMonthIncompletedTaskCount;
  const completeTaskDifference = completeTaskCount - lastMonthCompleteTaskCount;
  const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTaskCount;

  return {
    taskCount,
    taskDifference,
    assignedTaskCount,
    assignedTaskDifference,
    incompletedTaskCount,
    incompletedTaskDifference,
    completeTaskCount,
    completeTaskDifference,
    overdueTaskCount,
    overdueTaskDifference,
  };
};

export const inviteToUserOrganization = async () => {};
