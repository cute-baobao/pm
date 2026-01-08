import { InferSelectModel, relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { organization, user } from './auth-schema';

export const project = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text().notNull(),
  organizationId: uuid('organization_id')
    .references(() => organization.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  image: text(),
  description: text(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const taskStatus = pgEnum('task_status', [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
]);

export const taskStatusValues = taskStatus.enumValues;

export type TaskStatus = (typeof taskStatusValues)[number];

export const task = pgTable('task', {
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
  assignedId: text('assigned_id').references(() => user.id, {
    onDelete: 'cascade',
  }).notNull(),
  description: text(),
  dueDate: timestamp('due_date').notNull(),
  status: taskStatus().notNull().default('TODO'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  position: integer('position').notNull().default(0),
});

export const taskRelations = relations(task, ({ one }) => ({
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
  organization: one(organization, {
    fields: [task.organizationId],
    references: [organization.id],
  }),
  assignedUser: one(user, {
    fields: [task.assignedId],
    references: [user.id],
  }),
}));

export type Project = InferSelectModel<typeof project>;
export type Task = InferSelectModel<typeof task>;
