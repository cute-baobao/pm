import { ColumnBaseConfig, ColumnDataType, sql } from 'drizzle-orm';
import { ExtraConfigColumn } from 'drizzle-orm/pg-core';

type StringColumn = ExtraConfigColumn<ColumnBaseConfig<ColumnDataType, string>>;

// current user id from the session
export const currentUserId = sql`current_setting('app.current_user_id', true)`;

// check if the current user is a member of the given organization
export const isOrgMember = (orgId: StringColumn) => sql`EXISTS (
  SELECT 1 FROM "member" AS m
  WHERE m."organization_id" = ${orgId}
    AND m."user_id" = ${currentUserId}
)`;

export const isOrgOwnerOrAdmin = (orgId: StringColumn) => sql`EXISTS (
  SELECT 1 FROM "member" AS m
  WHERE m."organization_id" = ${orgId}
    AND m."user_id" = ${currentUserId}
    AND m."role" IN ('owner', 'admin')
)`;
