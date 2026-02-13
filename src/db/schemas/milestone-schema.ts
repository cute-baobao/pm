import { InferSelectModel } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { organization, user } from './auth-schema';
import { project, task } from './project-schema';

export const milestoneStatus = pgEnum('milestone_status', [
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'ON_HOLD',
]);

export const milestoneStatusValues = milestoneStatus.enumValues;

export type MilestoneStatus = (typeof milestoneStatusValues)[number];

export const milestone = pgTable(
  'milestone',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    projectId: uuid('project_id')
      .references(() => project.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    organizationId: uuid('organization_id')
      .references(() => organization.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    name: text().notNull(),
    description: text(),
    targetDate: timestamp('target_date'),
    status: milestoneStatus().notNull().default('PLANNED'),
    createdBy: text('created_by')
      .references(() => user.id, {
        onDelete: 'set null',
      }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('milestone_project_created_at_idx').on(t.projectId, t.createdAt),
    index('milestone_org_created_at_idx').on(t.organizationId, t.createdAt),
  ],
);

// Junction table for many-to-many relationship between milestones and tasks
export const milestoneTask = pgTable(
  'milestone_task',
  {
    milestoneId: uuid('milestone_id')
      .references(() => milestone.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    taskId: uuid('task_id')
      .references(() => task.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.milestoneId, table.taskId] }),
    index('milestone_task_task_id_idx').on(table.taskId),
  ],
);

// Export types
export type Milestone = InferSelectModel<typeof milestone>;
export type MilestoneTask = InferSelectModel<typeof milestoneTask>;
