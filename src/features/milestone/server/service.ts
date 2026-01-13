import db from '@/db';
import { milestone, milestoneTask } from '@/db/schemas';
import { desc, eq } from 'drizzle-orm';
import { CreateMilestoneInput, UpdateMilestoneInput } from '../schema';

export const getManyMilestones = async (projectId: string) => {
  const milestones = await db
    .select()
    .from(milestone)
    .where(eq(milestone.projectId, projectId))
    .orderBy(desc(milestone.createdAt));

  return milestones;
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
