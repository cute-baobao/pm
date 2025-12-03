import db from '@/db';
import { task } from '@/db/schemas';
import { CreateTaskData, QueryTaskData } from '../schema';

export const createTask = async (data: CreateTaskData) => {
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

    const [newTask] = await db
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

  return result;
};

export const getManyTasksByFilters = async (filters: QueryTaskData) => {
  return await db.query.task.findMany({
    where: (t, { eq, and, ilike, lte }) =>
      and(
        eq(t.organizationId, filters.organizationId),
        eq(t.status, filters.status),
        // 使用短路求值：有值则添加条件，否则返回 undefined（会被 and 忽略）
        filters.projectId ? eq(t.projectId, filters.projectId) : undefined,
        filters.assignedId ? eq(t.assignedId, filters.assignedId) : undefined,
        filters.search ? ilike(t.name, `%${filters.search}%`) : undefined,
        filters.dueDate ? lte(t.dueDate, new Date(filters.dueDate)) : undefined,
      ),
    with: {
      project: true,
      organization: true,
      assignedUser: true,
    },
  });
};
