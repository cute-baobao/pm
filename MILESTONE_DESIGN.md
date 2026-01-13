# 里程碑（Milestone）功能设计文档

## 概述
里程碑功能允许项目管理者创建阶段性目标，每个里程碑可以关联多个任务，用于追踪项目进度和组织工作。

## 数据库架构

### 1. 里程碑表 (milestone)

```sql
CREATE TABLE milestone (
  id UUID PRIMARY KEY DEFAULT random_uuid(),
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP,
  status milestone_status NOT NULL DEFAULT 'PLANNED',
  created_by TEXT REFERENCES user(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**字段说明：**
- `id`: 唯一标识符
- `project_id`: 所属项目 ID
- `organization_id`: 所属组织 ID
- `name`: 里程碑名称（必填）
- `description`: 里程碑描述（可选）
- `target_date`: 目标完成日期（可选）
- `status`: 里程碑状态（PLANNED/IN_PROGRESS/COMPLETED/ON_HOLD）
- `created_by`: 创建者用户 ID
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 2. 里程碑-任务关联表 (milestone_task)

```sql
CREATE TABLE milestone_task (
  milestone_id UUID NOT NULL REFERENCES milestone(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES task(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (milestone_id, task_id)
);
```

**设计说明：**
- 使用复合主键 (milestone_id, task_id) 确保唯一性
- 采用联接表（junction table）实现多对多关系
- 一个里程碑可以关联多个任务
- 一个任务可以属于多个里程碑

### 3. 里程碑状态枚举

```typescript
export const milestoneStatus = pgEnum('milestone_status', [
  'PLANNED',      // 计划中
  'IN_PROGRESS',  // 进行中
  'COMPLETED',    // 已完成
  'ON_HOLD',      // 暂停中
]);
```

## 数据模型关系

```
Organization (1)
    ↓
    ├─→ Project (1)
    │       ↓
    │       ├─→ Milestone (n)
    │       │       ↓
    │       │   milestone_task (关联表)
    │       │       ↓
    │       └─→ Task (n)
    │
    └─→ User (创建者)
```

## 关键操作说明

### 创建里程碑
```typescript
// 1. 创建里程碑记录
INSERT INTO milestone (project_id, organization_id, name, description, target_date, status, created_by)
VALUES (?, ?, ?, ?, ?, 'PLANNED', ?);

// 2. 关联任务（可批量）
INSERT INTO milestone_task (milestone_id, task_id)
VALUES (?, ?), (?, ?), ...;
```

### 查询里程碑及其任务
```typescript
// 获取项目的所有里程碑及关联的任务
SELECT 
  m.*,
  json_agg(
    json_build_object(
      'id', t.id,
      'name', t.name,
      'status', t.status,
      'assignedId', t.assigned_id
    )
  ) as tasks
FROM milestone m
LEFT JOIN milestone_task mt ON m.id = mt.milestone_id
LEFT JOIN task t ON mt.task_id = t.id
WHERE m.project_id = ?
GROUP BY m.id;
```

### 更新里程碑状态
```typescript
// 更新里程碑状态为完成
UPDATE milestone
SET status = 'COMPLETED', updated_at = NOW()
WHERE id = ?;
```

### 添加/移除任务
```typescript
// 添加任务到里程碑
INSERT INTO milestone_task (milestone_id, task_id)
VALUES (?, ?)
ON CONFLICT DO NOTHING;

// 移除任务从里程碑
DELETE FROM milestone_task
WHERE milestone_id = ? AND task_id = ?;
```

### 删除里程碑
```typescript
-- 由于 ON DELETE CASCADE，删除里程碑会自动删除关联的 milestone_task 记录
DELETE FROM milestone WHERE id = ?;
```

## 权限控制

基于现有的权限架构，里程碑操作权限如下：

- **查看里程碑**: 组织成员可查看
- **创建里程碑**: 项目管理员以上权限
- **编辑里程碑**: 项目管理员或创建者
- **删除里程碑**: 项目管理员或组织管理员
- **管理任务关联**: 项目管理员以上权限

## TypeScript 类型定义

```typescript
export type Milestone = {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  description?: string;
  targetDate?: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MilestoneTask = {
  milestoneId: string;
  taskId: string;
  createdAt: Date;
};

// 扩展类型（包含关联的任务）
export type MilestoneWithTasks = Milestone & {
  tasks: Task[];
};
```

## 索引建议

为了优化查询性能，建议添加以下索引：

```sql
-- 按项目查询里程碑
CREATE INDEX idx_milestone_project_id ON milestone(project_id);

-- 按组织查询里程碑
CREATE INDEX idx_milestone_organization_id ON milestone(organization_id);

-- 按状态查询里程碑
CREATE INDEX idx_milestone_status ON milestone(status);

-- 查询任务关联的里程碑
CREATE INDEX idx_milestone_task_task_id ON milestone_task(task_id);
```

## 迁移步骤

1. **创建 Drizzle 迁移文件**
   - 运行 `drizzle-kit generate` 生成迁移文件
   - 迁移将自动创建 `milestone` 表和 `milestone_task` 表

2. **应用迁移**
   ```bash
   npm run db:migrate
   ```

3. **更新数据库引用**
   - schema 已在 `src/db/schemas/milestone-schema.ts` 中定义
   - 导出已在 `src/db/schemas/index.ts` 中配置

## 后续开发建议

### 短期（必需）
1. 创建 Drizzle 迁移文件并应用
2. 实现 tRPC 过程：
   - `createMilestone` - 创建里程碑
   - `getMilestones` - 获取项目的里程碑列表
   - `updateMilestone` - 更新里程碑信息
   - `deleteMilestone` - 删除里程碑
   - `addTaskToMilestone` - 添加任务
   - `removeTaskFromMilestone` - 移除任务

3. 创建 UI 组件：
   - 里程碑列表视图
   - 里程碑详情页面
   - 里程碑创建/编辑表单
   - 任务关联管理界面

### 中期（建议）
1. 添加里程碑进度追踪：
   - 自动计算完成百分比
   - 预计完成日期推算
   - 进度趋势图表

2. 添加里程碑活动日志
3. 实现里程碑提醒功能
4. 支持里程碑模板

### 长期（可选）
1. 里程碑对标（Benchmark）
2. 依赖关系管理（里程碑间的先后依赖）
3. 资源分配和负载均衡
4. 甘特图展示

