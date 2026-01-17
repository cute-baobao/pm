'use server';
import db, { withUser } from '@/db';
import {
  member,
  Organization,
  organization,
  session,
  task,
  taskStatusValues,
  User,
} from '@/db/schemas';
import { and, eq, gte, lte, ne } from 'drizzle-orm';
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

export const analytics = async (params: OrganizationAnalyticsParams) => {
  const { organizationId, assigneeId } = params;
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      gte(task.createdAt, lastMonthStart),
      lte(task.createdAt, lastMonthEnd),
    ),
  });

  const taskCount = thisMonthTasks.length;
  const taskDifference = taskCount - lastMonthTasks.length;

  const thisMonthAssignedTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      eq(task.assignedId, assigneeId),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthAssignedTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      eq(task.assignedId, assigneeId),
      gte(task.createdAt, lastMonthStart),
      lte(task.createdAt, lastMonthEnd),
    ),
  });

  const assignedTaskCount = thisMonthAssignedTasks.length;
  const assignedTaskDifference =
    assignedTaskCount - lastMonthAssignedTasks.length;

  const thisMonthIncompletedTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      ne(task.status, taskStatusValues[4]),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthIncompletedTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      ne(task.status, taskStatusValues[4]),
      gte(task.createdAt, lastMonthStart),
      lte(task.createdAt, lastMonthEnd),
    ),
  });

  const incompletedTaskCount = thisMonthIncompletedTasks.length;
  const incompletedTaskDifference =
    incompletedTaskCount - lastMonthIncompletedTasks.length;

  const thisMonthCompleteTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      eq(task.status, taskStatusValues[4]),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthCompleteTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      eq(task.status, taskStatusValues[4]),
      gte(task.createdAt, lastMonthStart),
      lte(task.createdAt, lastMonthEnd),
    ),
  });

  const completeTaskCount = thisMonthCompleteTasks.length;
  const completeTaskDifference =
    completeTaskCount - lastMonthCompleteTasks.length;

  const thisMonthOverdueTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      ne(task.status, taskStatusValues[4]),
      lte(task.dueDate, thisMonthEnd),
      gte(task.dueDate, thisMonthStart),
    ),
  });

  const lastMonthOverdueTasks = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      ne(task.status, taskStatusValues[4]),
      lte(task.dueDate, lastMonthEnd),
      gte(task.dueDate, lastMonthStart),
    ),
  });

  const overdueTaskCount = thisMonthOverdueTasks.length;
  const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.length;

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
