/**
 * Task Changelog UI 使用指南
 * 
 * 提供两个组件来展示任务的变更历史：
 * 
 * 1. TaskChangelog - 简洁的列表式展示
 * 2. TaskChangelogTimeline - 时间线式展示（推荐）
 */

// === 在你的页面中使用 ===

// 方案 1：时间线样式（推荐）
import { TaskChangelogTimeline } from '@/features/task/components/task-changelog-timeline';

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  return (
    <div className="space-y-6">
      {/* 其他内容 */}
      
      {/* 变更历史 */}
      <TaskChangelogTimeline taskId={params.taskId} />
    </div>
  );
}

// 方案 2：简洁列表样式
import { TaskChangelog } from '@/features/task/components/task-changelog';

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  return (
    <div className="space-y-6">
      {/* 其他内容 */}
      
      {/* 变更历史 */}
      <TaskChangelog taskId={params.taskId} />
    </div>
  );
}

// === 功能说明 ===

/**
 * ✅ 自动显示以下信息：
 * - 谁做的修改（changedByUser.name）
 * - 什么时候修改（相对时间，如 "2 小时前"）
 * - 修改了什么字段（name、status、dueDate 等，支持中文标签）
 * - 旧值和新值对比
 * 
 * ✅ 智能字段展示：
 * - 状态字段（status）：显示为彩色 Badge
 * - 日期字段（dueDate）：格式化为 YYYY-MM-DD HH:mm
 * - 其他字段：正常文本显示
 * 
 * ✅ 支持的字段：
 * - name（名称）
 * - description（描述）
 * - status（状态）
 * - dueDate（截止日期）
 * - assignedId（分配人）
 * - projectId（项目）
 */

// === 如果需要自定义字段标签，修改这里 ===

// 在组件文件中找到 fieldLabelMap：
const fieldLabelMap: Record<string, string> = {
  name: '名称',
  description: '描述',
  status: '状态',
  dueDate: '截止日期',
  assignedId: '分配人',
  projectId: '项目',
  // 添加新字段：
  // customField: '自定义字段名',
};

// === 如果需要自定义状态颜色，修改这里 ===

const statusMap: Record<string, { label: string; color: string }> = {
  TODO: { label: '待办', color: 'bg-slate-100 text-slate-800' },
  IN_PROGRESS: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
  IN_REVIEW: { label: '审核中', color: 'bg-purple-100 text-purple-800' },
  DONE: { label: '已完成', color: 'bg-green-100 text-green-800' },
  BACKLOG: { label: '待办列表', color: 'bg-yellow-100 text-yellow-800' },
};
