CREATE INDEX IF NOT EXISTS "task_org_created_at_idx" ON "task" USING btree ("organization_id", "created_at");
CREATE INDEX IF NOT EXISTS "task_org_assigned_created_at_idx" ON "task" USING btree ("organization_id", "assigned_id", "created_at");
CREATE INDEX IF NOT EXISTS "task_org_status_created_at_idx" ON "task" USING btree ("organization_id", "status", "created_at");
CREATE INDEX IF NOT EXISTS "task_org_due_date_not_done_idx" ON "task" USING btree ("organization_id", "due_date") WHERE "status" <> 'DONE';
