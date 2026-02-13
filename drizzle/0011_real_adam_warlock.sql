CREATE INDEX "invitation_org_email_status_expires_idx" ON "invitation" USING btree ("organization_id","email","status","expires_at");--> statement-breakpoint
CREATE INDEX "invitation_org_status_idx" ON "invitation" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "member_user_id_idx" ON "member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "member_org_id_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "member_org_user_idx" ON "member" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "project_org_created_at_idx" ON "project" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "task_org_created_at_idx" ON "task" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "task_org_assigned_created_at_idx" ON "task" USING btree ("organization_id","assigned_id","created_at");--> statement-breakpoint
CREATE INDEX "task_org_status_created_at_idx" ON "task" USING btree ("organization_id","status","created_at");--> statement-breakpoint
CREATE INDEX "task_org_due_date_not_done_idx" ON "task" USING btree ("organization_id","due_date") WHERE "task"."status" <> 'DONE';--> statement-breakpoint
CREATE INDEX "task_project_created_at_idx" ON "task" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "task_project_assigned_created_at_idx" ON "task" USING btree ("project_id","assigned_id","created_at");--> statement-breakpoint
CREATE INDEX "task_project_status_created_at_idx" ON "task" USING btree ("project_id","status","created_at");--> statement-breakpoint
CREATE INDEX "task_project_due_date_not_done_idx" ON "task" USING btree ("project_id","due_date") WHERE "task"."status" <> 'DONE';--> statement-breakpoint
CREATE INDEX "milestone_project_created_at_idx" ON "milestone" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "milestone_org_created_at_idx" ON "milestone" USING btree ("organization_id","created_at");--> statement-breakpoint
CREATE INDEX "milestone_task_task_id_idx" ON "milestone_task" USING btree ("task_id");