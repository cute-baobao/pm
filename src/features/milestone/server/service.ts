import db from '@/db';
import { milestone, milestoneTask } from '@/db/schemas';
import { and, desc, eq, ilike } from 'drizzle-orm';
import {
  AddTasksToMilestoneInput,
  CreateMilestoneInput,
  MilestonePaginationInput,
  UpdateMilestoneInput,
} from '../schema';

export const getManyMilestones = async (input: MilestonePaginationInput) => {
  const { search, page, pageSize, projectId } = input;
  const whereCondition = search
    ? and(
        eq(milestone.projectId, projectId),
        ilike(milestone.name, `%${search}%`),
      )
    : eq(milestone.projectId, projectId);
  const [items, totalCount] = await Promise.all([
    db.query.milestone.findMany({
      where: whereCondition,
      orderBy: desc(milestone.createdAt),
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: {
        tasks: {
          with: {
            task: true,
          },
        },
      },
    }),
    db.$count(milestone, whereCondition),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const itemsWithAnalytics = items.map((m) => {
    const tasks = m.tasks.map((mt) => mt.task);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
    const percentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...m,
      totalTasks,
      completedTasks,
      percentage,
    };
  });

  return {
    items: itemsWithAnalytics,
    page,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getMilestone = async (milestoneId: string) => {
  const result = await db.query.milestone.findFirst({
    where: eq(milestone.id, milestoneId),
    with: {
      project: true,
      tasks: {
        with: {
          task: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error('Milestone not found');
  }

  const tasks = result.tasks.map((mt) => mt.task);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    ...result,
    totalTasks,
    completedTasks,
    percentage,
  };
};

export const createMilestone = async (input: CreateMilestoneInput) => {
  const result = await db.transaction(async (tx) => {
    const {
      projectId,
      organizationId,
      name,
      description,
      targetDate,
      createdBy,
      taskIds,
    } = input;
    const inserted = await tx
      .insert(milestone)
      .values({
        organizationId,
        projectId,
        name,
        description,
        targetDate,
        createdBy,
      })
      .returning();

    const createdMilestone = inserted[0];
    if (!createdMilestone) {
      throw new Error('Failed to create milestone');
    }

    if (taskIds?.length) {
      const milestoneId = createdMilestone.id;
      await Promise.all(
        taskIds.map((taskId) => {
          return tx.insert(milestoneTask).values({
            milestoneId,
            taskId,
          });
        }),
      );
    }

    return createdMilestone;
  });
  return result;
};

export const updateMilestone = async (input: UpdateMilestoneInput) => {
  const m = await db
    .select()
    .from(milestone)
    .where(eq(milestone.id, input.milestoneId))
    .limit(1);

  if (m.length === 0) {
    throw new Error('Milestone not found');
  }

  const result = await db.transaction(async (tx) => {
    if (input.taskIds !== undefined) {
      await tx
        .delete(milestoneTask)
        .where(eq(milestoneTask.milestoneId, input.milestoneId));

      await Promise.all(
        input.taskIds.map((taskId) =>
          tx.insert(milestoneTask).values({
            milestoneId: input.milestoneId,
            taskId,
          }),
        ),
      );
    }
    const updatedMilestones = await tx
      .update(milestone)
      .set({
        name: input.name ?? m[0].name,
        description: input.description ?? m[0].description,
        targetDate: input.targetDate ?? m[0].targetDate,
        status: input.status ?? m[0].status,
      })
      .where(eq(milestone.id, input.milestoneId))
      .returning();

    const updated = updatedMilestones[0];
    if (!updated) {
      throw new Error('Failed to update milestone');
    }

    return updated;
  });

  return result;
};

export const deleteMilestoneById = async (milestoneId: string) => {
  const deletedMilestones = await db
    .delete(milestone)
    .where(eq(milestone.id, milestoneId))
    .returning();

  const deleted = deletedMilestones[0];
  if (!deleted) {
    throw new Error('Failed to delete milestone');
  }

  return deleted;
};

export const getMilestonesAnalytics = async (projectId: string) => {
  const milestonesWithTasks = await db.query.milestone.findMany({
    where: eq(milestone.projectId, projectId),
    with: {
      tasks: {
        with: {
          task: true,
        },
      },
    },
    orderBy: desc(milestone.createdAt),
  });

  return milestonesWithTasks.map((m) => {
    const tasks = m.tasks.map((mt) => mt.task);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'DONE').length;

    return {
      id: m.id,
      name: m.name,
      status: m.status,
      totalTasks,
      completedTasks,
      percentage:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  });
};

export const addTasksToMilestone = async (input: AddTasksToMilestoneInput) => {
  const m = await db.query.milestone.findFirst({
    where: eq(milestone.id, input.milestoneId),
  });

  if (!m) {
    throw new Error('Milestone not found');
  }

  // Insert task associations (ignore duplicates)
  await Promise.all(
    input.taskIds.map((taskId) =>
      db
        .insert(milestoneTask)
        .values({
          milestoneId: input.milestoneId,
          taskId,
        })
        .onConflictDoNothing(),
    ),
  );

  return m;
};
