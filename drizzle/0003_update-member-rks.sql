ALTER POLICY "delete_access" ON "member" TO public USING (EXISTS (
  SELECT 1 FROM "member" AS m
  WHERE m."organization_id" = "member"."organization_id"
    AND m."user_id" = current_setting('app.current_user_id', true)
    AND m."role" IN ('owner', 'admin')
) OR "member"."user_id" = current_setting('app.current_user_id', true));