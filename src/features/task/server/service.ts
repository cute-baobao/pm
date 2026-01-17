import db from '@/db';
import { milestoneTask, task } from '@/db/schemas';
import { recordTaskChange, recordTaskChanges } from '@/db/task-changelog-utils';
import { and, eq, ilike, lte, notExists, sql } from 'drizzle-orm';
import {
  CreateTaskData,
  QueryTaskData,
  TaskPaginationData,
  UpdateTaskData,
} from '../schema';

export const createTask = async (data: CreateTaskData, createdBy: string) => {
  const { projectId, status } = data;
  const result = await db.transaction(async (tx) => {
    const highestPositionTask = await tx.query.task.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.projectId, projectId), eq(t.status, status)),
      orderBy: (t, { desc }) => [desc(t.position)],
    });

    const newPosition = highestPositionTask
      ? highestPositionTask.position + 1000
      : 1000;

    const [newTask] = await tx
      .insert(task)
      .values({
        name: data.name,
        status: data.status,
        description: data.description,
        dueDate: data.dueDate,
        projectId: data.projectId,
        organizationId: data.organizationId,
        assignedId: data.assignedId,
        position: newPosition,
      })
      .returning();

    return newTask;
  });

  // record log
  await recordTaskChange({
    taskId: result.id,
    organizationId: result.organizationId,
    fieldName: 'assignedId',
    oldValue: null,
    newValue: result.assignedId,
    changedBy: createdBy,
  });

  return result;
};

export const getManyTasksByFilters = async (filters: QueryTaskData) => {
  return await db.query.task.findMany({
    where: (t, { eq, and, ilike, lte }) =>
      and(
        eq(t.organizationId, filters.organizationId),
        // 使用短路求值：有值则添加条件，否则返回 undefined（会被 and 忽略）
        filters.status ? eq(t.status, filters.status) : undefined,
        filters.projectId ? eq(t.projectId, filters.projectId) : undefined,
        filters.assignedId ? eq(t.assignedId, filters.assignedId) : undefined,
        filters.search ? ilike(t.name, `%${filters.search}%`) : undefined,
        filters.dueDate ? lte(t.dueDate, new Date(filters.dueDate)) : undefined,
      ),
    orderBy: (t, { desc, asc }) => [
      // 1. 已完成的在最后 (DONE = 1, 其他 = 0，升序排列)
      asc(sql`CASE WHEN ${t.status} = 'DONE' THEN 1 ELSE 0 END`),
      // 2. 逾期的在前面 (逾期 = 0, 未逾期 = 1，升序排列)
      asc(sql`CASE WHEN ${t.dueDate} < NOW() THEN 0 ELSE 1 END`),
      // 3. 按创建时间降序
      desc(t.createdAt),
    ],
    with: {
      project: true,
      organization: true,
      assignedUser: true,
    },
  });
};

export const getManyTasksWithPagination = async (
  filters: TaskPaginationData,
) => {
  const { page, pageSize, ...queryFilters } = filters;

  const whereCondition = and(
    eq(task.organizationId, queryFilters.organizationId),
    queryFilters.status ? eq(task.status, queryFilters.status) : undefined,
    queryFilters.projectId
      ? eq(task.projectId, queryFilters.projectId)
      : undefined,
    queryFilters.assignedId
      ? eq(task.assignedId, queryFilters.assignedId)
      : undefined,
    queryFilters.search
      ? ilike(task.name, `%${queryFilters.search}%`)
      : undefined,
    queryFilters.dueDate
      ? lte(task.dueDate, new Date(queryFilters.dueDate))
      : undefined,
  );

  const [items, totalCount] = await Promise.all([
    db.query.task.findMany({
      where: whereCondition,
      orderBy: (t, { desc, asc }) => [
        asc(sql`CASE WHEN ${t.status} = 'DONE' THEN 1 ELSE 0 END`),
        asc(sql`CASE WHEN ${t.dueDate} < NOW() THEN 0 ELSE 1 END`),
        desc(t.createdAt),
      ],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: {
        project: true,
        organization: true,
        assignedUser: true,
      },
    }),
    db.$count(task, whereCondition),
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

export const deleteTaskById = async (taskId: string) => {
  const result = await db.transaction(async (tx) => {
    const deletedTask = await tx
      .delete(task)
      .where(eq(task.id, taskId))
      .returning();

    return deletedTask[0];
  });

  return result;
};

export const updateTask = async (data: UpdateTaskData, changedBy: string) => {
  const res = await db.transaction(async (tx) => {
    const t = await tx.select().from(task).where(eq(task.id, data.id)).limit(1);

    if (t.length === 0) throw new Error('Task not found');
    const oldTask = t[0];

    const result = await tx
      .update(task)
      .set({ ...data })
      .where(eq(task.id, data.id))
      .returning();

    const changeRecords = Object.keys(data)
      .filter(
        (key) =>
          key !== 'id' &&
          key !== 'organizationId' &&
          key !== 'position' &&
          data[key as keyof UpdateTaskData] !== undefined &&
          // 过滤掉没有实际变化的字段
          oldTask[key as keyof UpdateTaskData] !==
            data[key as keyof UpdateTaskData],
      )
      .map((key) => ({
        taskId: data.id,
        organizationId: oldTask.organizationId,
        fieldName: key,
        oldValue: oldTask[key as keyof UpdateTaskData],
        newValue: data[key as keyof UpdateTaskData]!,
        changedBy: changedBy,
      }));

    // 批量插入所有变更记录
    if (changeRecords.length > 0) {
      await recordTaskChanges(changeRecords);
    }

    return result;
  });

  return res[0];
};

export const bulkUpdateTasks = async (
  data: UpdateTaskData[],
  changedBy: string,
) => {
  const result = await Promise.all(
    data.map(async (t) => {
      const res = await updateTask(t, changedBy);
      return res;
    }),
  );

  return result;
};

export const getTaskById = async (taskId: string) => {
  const result = await db.query.task.findFirst({
    where: eq(task.id, taskId),
    with: {
      project: true,
      organization: true,
      assignedUser: true,
      milestone: {
        with: {
          milestone: true,
        },
      },
    },
  });

  return result;
};

export const getTaskChangeLog = async (taskId: string) => {
  const result = await db.query.taskChangeLog.findMany({
    where: (t, { eq }) => eq(t.taskId, taskId),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
    with: {
      changedByUser: true,
    },
  });

  return result;
};

export const getTaskWithoutMilestoneSelect = async (
  organizationId: string,
  projectId?: string,
) => {
  const result = await db.query.task.findMany({
    where: and(
      eq(task.organizationId, organizationId),
      projectId ? eq(task.projectId, projectId) : undefined,
      notExists(
        db
          .select()
          .from(milestoneTask)
          .where(eq(milestoneTask.taskId, task.id)),
      ),
    ),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return result;
};
