import db from '@/db';
import { project, task, taskStatusValues } from '@/db/schemas';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { and, desc, eq, gte, ilike, lte, ne } from 'drizzle-orm';
import {
  AnalyticsParams,
  CreateProjectData,
  GetProjectParams,
  ProjectPaginationData,
  UpdateProjectData,
} from '../schema';

export const getOneProject = async (params: GetProjectParams) => {
  const { projectId, organizationId } = params;
  const project = await db.query.project.findFirst({
    where: (p, { eq, and }) =>
      and(eq(p.id, projectId), eq(p.organizationId, organizationId)),
  });

  return project;
};

export const getManyProjectsByOrganization = async (
  data: ProjectPaginationData,
) => {
  const { search, page, pageSize, organizationId } = data;
  const whereCondition = search
    ? and(
        eq(project.organizationId, organizationId),
        ilike(project.name, `%${search}%`),
      )
    : eq(project.organizationId, organizationId);

  const [items, totalCount] = await Promise.all([
    db.query.project.findMany({
      where: whereCondition,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      orderBy: desc(project.createdAt),
    }),
    db.$count(project, whereCondition),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getManyProjectsByOrganizationNoPagination = async (
  organizationId: string,
) => {
  const items = await db.query.project.findMany({
    where: eq(project.organizationId, organizationId),
    orderBy: desc(project.createdAt),
  });

  return items;
};

export const createProject = async (data: CreateProjectData) => {
  const [result] = await db
    .insert(project)
    .values({
      name: data.name,
      image: data.image ?? null,
      organizationId: data.organizationId,
      description: data.description ?? null,
    })
    .returning();
  return result;
};

export const deleteProject = async (projectId: string) => {
  const [result] = await db
    .delete(project)
    .where(eq(project.id, projectId))
    .returning();
  return result;
};

export const updateProject = async (data: UpdateProjectData) => {
  const [result] = await db
    .update(project)
    .set({
      name: data.name,
      image: data.image ?? null,
      description: data.description ?? null,
    })
    .where(
      and(
        eq(project.id, data.id),
        eq(project.organizationId, data.organizationId),
      ),
    )
    .returning();

  return result;
};

export const analytics = async (params: AnalyticsParams) => {
  const { projectId, assigneeId } = params;
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
      gte(task.createdAt, lastMonthStart),
      lte(task.createdAt, lastMonthEnd),
    ),
  });

  const taskCount = thisMonthTasks.length;
  const taskDifference = taskCount - lastMonthTasks.length;

  const thisMonthAssignedTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
      eq(task.assignedId, assigneeId),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthAssignedTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
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
      eq(task.projectId, projectId),
      ne(task.status, taskStatusValues[4]),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthIncompletedTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
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
      eq(task.projectId, projectId),
      eq(task.status, taskStatusValues[4]),
      gte(task.createdAt, thisMonthStart),
      lte(task.createdAt, thisMonthEnd),
    ),
  });

  const lastMonthCompleteTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
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
      eq(task.projectId, projectId),
      ne(task.status, taskStatusValues[4]),
      lte(task.dueDate, thisMonthEnd),
      gte(task.dueDate, thisMonthStart),
    ),
  });

  const lastMonthOverdueTasks = await db.query.task.findMany({
    where: and(
      eq(task.projectId, projectId),
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
