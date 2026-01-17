import { relations } from 'drizzle-orm';
import { organization, user } from './auth-schema';
import { milestone, milestoneTask } from './milestone-schema';
import { project, task, taskChangeLog } from './project-schema';

// Task Relations
export const taskRelations = relations(task, ({ one, many }) => ({
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
  milestone: one(milestoneTask, {
    fields: [task.id],
    references: [milestoneTask.taskId],
  }),
}));

// TaskChangeLog Relations
export const taskChangeLogRelations = relations(taskChangeLog, ({ one }) => ({
  task: one(task, {
    fields: [taskChangeLog.taskId],
    references: [task.id],
  }),
  organization: one(organization, {
    fields: [taskChangeLog.organizationId],
    references: [organization.id],
  }),
  changedByUser: one(user, {
    fields: [taskChangeLog.changedBy],
    references: [user.id],
  }),
}));

// Milestone Relations
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

// MilestoneTask Relations
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
