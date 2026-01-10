# 权限控制设计文档

## 架构概览

三层权限控制模型：认证 → 应用 → 数据库（RLS）

## 1. tRPC 应用层权限控制

### 当前程序结构

```typescript
protectedProcedure       // ✅ 检查用户认证
  ├─ permissionedProcedure  // ✅ 检查组织成员身份 + 角色
  │  ├─ memberProcedure     // ✅ 要求组织成员
  │  ├─ adminProcedure      // ✅ 要求管理员+
  │  ├─ ownerProcedure      // ✅ 要求所有者
  │  └─ adminOrOwnerProcedure // ✅ 要求管理员或所有者
```

### 建议增强

需要补充的权限检查层：

#### 1. 资源级别权限检查

对于 Task、Project 等资源，需要验证用户是否有权访问：

```typescript
// 新增: 资源所有权检查
export const resourceAccessProcedure = memberProcedure.use(
  async ({ ctx, input, next }) => {
    // input 应包含 resourceId
    const { resourceId } = input as { resourceId: string };
    
    // 验证用户是否有权访问该资源
    // 通过查询资源所属的 organizationId
    // 与用户的 activeOrganizationId 对比
    
    return next();
  }
);
```

#### 2. 跨资源权限验证

```typescript
// 验证用户是否可以在 Project A 中创建 Task
export const projectTaskAccessProcedure = memberProcedure.use(
  async ({ ctx, input, next }) => {
    const { projectId } = input as { projectId: string };
    
    // 验证：
    // 1. 项目属于当前组织
    // 2. 用户是组织成员
    
    return next();
  }
);
```

## 2. 数据库层权限控制（RLS）

### 当前 RLS 策略

- ✅ Member 表有组织级别的 RLS
- ❌ Project 表缺少 RLS
- ❌ Task 表缺少 RLS
- ❌ TaskChangeLog 表缺少 RLS

### 建议的 RLS 策略

#### Project 表
```sql
-- 只能读取当前组织的项目
CREATE POLICY "project_read" ON project
AS PERMISSIVE FOR SELECT
TO public
USING (organization_id = (current_setting('app.current_organization_id', true))::uuid
  AND EXISTS (
    SELECT 1 FROM member
    WHERE member.user_id = current_setting('app.current_user_id', true)
      AND member.organization_id = project.organization_id
  ));

-- 只有 admin 和 owner 可以创建
CREATE POLICY "project_create" ON project
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM member
  WHERE member.user_id = current_setting('app.current_user_id', true)
    AND member.organization_id = project.organization_id
    AND member.role IN ('admin', 'owner')
));

-- 只有 admin 和 owner 可以修改
CREATE POLICY "project_update" ON project
AS PERMISSIVE FOR UPDATE
TO public
USING (EXISTS (
  SELECT 1 FROM member
  WHERE member.user_id = current_setting('app.current_user_id', true)
    AND member.organization_id = project.organization_id
    AND member.role IN ('admin', 'owner')
));

-- 只有 owner 可以删除
CREATE POLICY "project_delete" ON project
AS PERMISSIVE FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM member
  WHERE member.user_id = current_setting('app.current_user_id', true)
    AND member.organization_id = project.organization_id
    AND member.role = 'owner'
));
```

#### Task 表
```sql
-- 所有成员可以读取同组织的任务
CREATE POLICY "task_read" ON task
AS PERMISSIVE FOR SELECT
TO public
USING (organization_id IN (
  SELECT organization_id FROM member
  WHERE user_id = current_setting('app.current_user_id', true)
));

-- 只有 admin 和 owner 可以创建/修改/删除
CREATE POLICY "task_write" ON task
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (EXISTS (
  SELECT 1 FROM member
  WHERE user_id = current_setting('app.current_user_id', true)
    AND organization_id = task.organization_id
    AND role IN ('admin', 'owner')
));
```

#### TaskChangeLog 表
```sql
-- 所有成员可以查看日志
CREATE POLICY "changelog_read" ON task_change_log
AS PERMISSIVE FOR SELECT
TO public
USING (organization_id IN (
  SELECT organization_id FROM member
  WHERE user_id = current_setting('app.current_user_id', true)
));
```

## 3. 应用层和数据库层的协作

### 数据流程

```
客户端请求
  ↓
tRPC Procedure
  ├─ 1. protectedProcedure: 验证用户认证
  ├─ 2. permissionedProcedure: 验证组织成员 + 角色
  ├─ 3. 业务逻辑: 额外的资源级权限检查
  └─ 4. 数据库操作: withUser() 设置上下文
      ↓
  PostgreSQL RLS
  ├─ 检查行级权限
  └─ 只返回用户有权访问的数据

返回结果
```

### 上下文传递

```typescript
// 在每个需要 RLS 的操作中：
export const getProjectTasks = adminProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    const { user } = ctx.auth;
    
    // 1. tRPC 层已检查: 用户是管理员
    
    // 2. 验证项目属于当前组织
    const project = await db.query.project.findFirst({
      where: (p) => eq(p.id, input.projectId),
    });
    
    if (project.organizationId !== ctx.auth.session.activeOrganizationId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    // 3. 执行带用户上下文的查询（RLS 生效）
    return withUser(user.id, async (tx) => {
      return tx.query.task.findMany({
        where: (t) => eq(t.projectId, input.projectId),
      });
    });
  });
```

## 4. 权限检查清单

### tRPC 层（应用层）应该检查

- [ ] 用户认证 (protectedProcedure)
- [ ] 组织成员身份 (permissionedProcedure)
- [ ] 用户角色权限 (memberProcedure/adminProcedure/ownerProcedure)
- [ ] **资源所属组织** ⭐
- [ ] **资源存在性**
- [ ] **业务逻辑权限** (例如：只有分配给任务的人或管理员可以更新)

### 数据库层（RLS）应该检查

- [ ] 用户是否属于该组织 ⭐ （通过 member 表）
- [ ] 用户的角色 ⭐ （通过 member 表的 role 字段）
- [ ] 数据所属的组织
- [ ] 操作类型权限 (SELECT/INSERT/UPDATE/DELETE)

## 5. 实现优先级

**Phase 1 (当前完成)**
- ✅ 基础认证和组织成员检查
- ✅ 角色基权限配置

**Phase 2 (建议立即实现)**
- ⭐ 为 Project、Task、TaskChangeLog 表添加 RLS 策略
- ⭐ 在 tRPC 中添加资源级别的权限验证

**Phase 3 (后续优化)**
- 项目级别的权限 (可选：ProjectMember 角色)
- 细粒度权限 (基于操作类型)
- 审计日志集成

## 6. 代码示例

### 安全的 Task 更新流程

```typescript
// ✅ 完整的权限检查
export const updateTask = adminProcedure
  .input(updateTaskSchema)
  .mutation(async ({ ctx, input }) => {
    const { user, session } = ctx.auth;
    const { taskId, ...updates } = input;
    
    // 1. tRPC 层: 已验证用户是 admin
    
    // 2. 验证任务属于当前组织
    const task = await db.query.task.findFirst({
      where: (t) => eq(t.id, taskId),
    });
    
    if (!task || task.organizationId !== session.activeOrganizationId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Task not found or access denied',
      });
    }
    
    // 3. 执行带 RLS 的更新（数据库层再次验证）
    return withUser(user.id, async (tx) => {
      const [updated] = await tx
        .update(task)
        .set(updates)
        .where(eq(task.id, taskId))
        .returning();
      
      return updated;
    });
  });
```

## 总结

**关键原则:**
1. **多层防护**: tRPC 应用层 + 数据库 RLS 层
2. **默认拒绝**: 显式授予权限，而不是隐式允许
3. **最小权限**: 用户只能访问必要的资源
4. **审计**: 记录权限相关的操作（已有 TaskChangeLog）
5. **一致性**: tRPC 和 RLS 规则保持一致
