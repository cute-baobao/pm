import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { organization } from './auth-schema';

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

export type Project = InferSelectModel<typeof project>;
