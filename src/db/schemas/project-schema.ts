import { InferSelectModel, sql } from 'drizzle-orm';
import {
  index,
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
},
  (t) => [index('project_org_created_at_idx').on(t.organizationId, t.createdAt)],
);

export const taskStatus = pgEnum('task_status', [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
]);

export const taskStatusValues = taskStatus.enumValues;

export type TaskStatus = (typeof taskStatusValues)[number];

export const task = pgTable(
  'task',
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
    assignedId: text('assigned_id')
      .references(() => user.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    description: text(),
    dueDate: timestamp('due_date').notNull(),
    status: taskStatus().notNull().default('TODO'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    position: integer('position').notNull().default(0),
  },
  (t) => [
    index('task_org_created_at_idx').on(t.organizationId, t.createdAt),
    index('task_org_assigned_created_at_idx').on(
      t.organizationId,
      t.assignedId,
      t.createdAt,
    ),
    index('task_org_status_created_at_idx').on(
      t.organizationId,
      t.status,
      t.createdAt,
    ),
    index('task_org_due_date_not_done_idx')
      .on(t.organizationId, t.dueDate)
      .where(sql`${t.status} <> 'DONE'`),
    index('task_project_created_at_idx').on(t.projectId, t.createdAt),
    index('task_project_assigned_created_at_idx').on(
      t.projectId,
      t.assignedId,
      t.createdAt,
    ),
    index('task_project_status_created_at_idx').on(
      t.projectId,
      t.status,
      t.createdAt,
    ),
    index('task_project_due_date_not_done_idx')
      .on(t.projectId, t.dueDate)
      .where(sql`${t.status} <> 'DONE'`),
  ],
);

export const taskChangeLog = pgTable('task_change_log', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  taskId: uuid('task_id')
    .references(() => task.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  organizationId: uuid('organization_id')
    .references(() => organization.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  fieldName: text('field_name').notNull(), // e.g., 'status', 'name', 'assignedId'
  oldValue: text('old_value'),
  newValue: text('new_value'),
  changedBy: text('changed_by').references(() => user.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Project = InferSelectModel<typeof project>;
export type Task = InferSelectModel<typeof task>;
export type TaskChangeLog = InferSelectModel<typeof taskChangeLog>;
