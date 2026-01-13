import { InferSelectModel, relations } from 'drizzle-orm';
import {
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

export const milestone = pgTable('milestone', {
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
});

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
  (table) => [primaryKey({ columns: [table.milestoneId, table.taskId] })],
);

// Relations
export const milestoneRelations = relations(milestone, ({ one, many }) => ({
  project: one(project, {
    fields: [milestone.projectId],
    references: [project.id],
  }),
  organization: one(organization, {
    fields: [milestone.organizationId],
    references: [organization.id],
  }),
  creator: one(user, {
    fields: [milestone.createdBy],
    references: [user.id],
  }),
  tasks: many(milestoneTask),
}));

export const milestoneTaskRelations = relations(milestoneTask, ({ one }) => ({
  milestone: one(milestone, {
    fields: [milestoneTask.milestoneId],
    references: [milestone.id],
  }),
  task: one(task, {
    fields: [milestoneTask.taskId],
    references: [task.id],
  }),
}));

// Export types
export type Milestone = InferSelectModel<typeof milestone>;
export type MilestoneTask = InferSelectModel<typeof milestoneTask>;
