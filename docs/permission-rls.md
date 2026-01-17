# 权限控制方案（tRPC + Postgres RLS）

## 目标
- 业务层：在 tRPC 的 `procedure` 中进行角色/成员校验，提供清晰的错误与控制流。
- 数据层：Postgres RLS 做兜底，避免遗漏或绕过业务校验导致的越权访问。

## 当前现状（与代码对齐）
- tRPC 已有分层 procedure：`protectedProcedure`、`permissionedProcedure`、`memberProcedure`、`adminProcedure`、`ownerProcedure`、`adminOrOwnerProcedure`，位于 [src/trpc/init.ts](src/trpc/init.ts)。
- 角色权限枚举来自 `PERMISSION`，位于 [src/lib/configs/permission.ts](src/lib/configs/permission.ts)。
- 数据库侧已有 RLS 工具与用户上下文注入：
  - `withUser` 会在事务内执行 `set_config('app.current_user_id', userId, true)`，位于 [src/db/index.ts](src/db/index.ts)。
  - `currentUserId`、`isOrgMember`、`isOrgOwnerOrAdmin` 等 RLS SQL 片段位于 [src/db/rls-utils.ts](src/db/rls-utils.ts)。
- 目前 RLS 只对 `organization` 和 `member` 两张表生效（见 drizzle schema）。

## 总体方案
1. **tRPC 层负责“业务语义”**：用 procedure 组合完成“是否登录”“是否有组织成员身份”“是否是 admin/owner”等判断。
2. **数据库层负责“访问边界”**：所有关键表开启 RLS 并配置策略，至少保证“用户只能访问其组织内数据”。
3. **强制通过 `withUser` 执行所有 DB 操作**：让 RLS 拥有 `app.current_user_id`，避免绕过。

## tRPC 侧设计建议
- 建议保持现有流程：
  - `protectedProcedure` 获取 session，产出 `ctx.auth`。
  - `permissionedProcedure` 确保 `activeOrganizationId` 存在并验证 membership，给 `ctx.auth.user` 写入 `role`。
  - 业务 router 使用最小权限 procedure（`memberProcedure`、`adminProcedure` 等）。
- 约束：**任何数据库操作必须包在 `withUser(ctx.auth.user.id, ...)` 内**。
  - 如需避免遗漏，可以在数据访问层或 repo 层统一封装（例如 `dbWithUser(ctx)`），禁止直接使用 `db`。

## Postgres RLS 侧设计建议
### 1) 需要开启 RLS 的表
建议对以下表启用 RLS：
- 组织内业务数据：`project`、`task`、`milestone`、`milestone_task`、`task_change_log`
- 成员/邀请：`member`、`invitation`（`member` 已启用）
- 组织：`organization`（已启用）

### 2) 策略建议（示例矩阵）
> 目标：至少保证“只能访问自己组织内的数据”。下面为推荐最小策略，可按业务细化。

| 表 | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| project | `isOrgMember(organization_id)` | `isOrgMember(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` |
| task | `isOrgMember(organization_id)` | `isOrgMember(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` 或 `assigned_id = currentUserId` | `isOrgOwnerOrAdmin(organization_id)` |
| milestone | `isOrgMember(organization_id)` | `isOrgMember(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` |
| milestone_task | 依赖 task / milestone 的组织 ID（建议存组织 ID 或用子查询） | 同上 | `isOrgOwnerOrAdmin` | `isOrgOwnerOrAdmin` |
| task_change_log | `isOrgMember(organization_id)` | `isOrgMember(organization_id)` | 通常不允许更新 | 通常不允许删除 |
| invitation | `isOrgOwnerOrAdmin(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` | `isOrgOwnerOrAdmin(organization_id)` |

### 3) Drizzle schema 配置建议
在对应的 schema 中使用 `pgPolicy` + `ENABLE ROW LEVEL SECURITY`：
- `using` 用于 SELECT/UPDATE/DELETE 的判断
- `withCheck` 用于 INSERT/UPDATE 的写入合法性
- 复用 [src/db/rls-utils.ts](src/db/rls-utils.ts) 中的 `currentUserId`、`isOrgMember`、`isOrgOwnerOrAdmin`

### 4) 特殊场景处理建议
- `task` 的 UPDATE：可允许 assignee 更新自身相关字段（如 `status`），其余字段仅 admin/owner 允许。
- `milestone_task`：建议补充 `organization_id` 字段，避免复杂子查询带来的性能损耗。
- `task_change_log`：建议仅允许 INSERT，UPDATE/DELETE 拒绝。

## 关键流程（推荐规范）
1. 请求进入 tRPC → `protectedProcedure` 校验登录。
2. `permissionedProcedure` 校验 `activeOrganizationId` 与 membership。
3. 在具体 router 内通过 `withUser(ctx.auth.user.id, ...)` 执行 DB 操作。
4. RLS 在数据库侧确保最终的数据访问边界。

## 迁移与落地步骤（建议顺序）
1. 在 schema 中为 `project`、`task`、`milestone`、`milestone_task`、`task_change_log`、`invitation` 添加 RLS 策略与 `ENABLE ROW LEVEL SECURITY`。
2. 为 `milestone_task` 增加 `organization_id`（如果同意优化查询），并补齐 migration。
3. 统一封装 DB 访问，强制使用 `withUser`。
4. 回归测试：用不同角色账户验证 API 行为与 SQL 访问边界。

## 测试建议清单
- 未登录访问：tRPC 直接返回 `UNAUTHORIZED`。
- 已登录但无 `activeOrganizationId`：返回 `FORBIDDEN`。
- 只有 member 身份：只能 SELECT；尝试 UPDATE/DELETE 被拒。
- admin/owner：可执行更新与删除。
- 绕过 tRPC 直接访问数据库时：RLS 仍能阻止越权。

## 风险与注意事项
- **必须确保所有 DB 访问都设置了 `app.current_user_id`**；否则 RLS 会把用户视为匿名。
- RLS 策略越复杂越影响性能，建议让表结构包含 `organization_id` 以简化判断。
- `adminProcedure`、`ownerProcedure` 只保证业务层控制，不能替代 RLS。

---
如需我补充具体策略代码（Drizzle schema 与 SQL migration），告诉我需要覆盖的表与业务限制即可。