'use client';

import { Card } from '@/components/ui/card';
import { Empty } from '@/components/ui/empty';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useSuspenseTaskChangeLog } from '../hooks/use-task';

interface TaskChangelogProps {
  taskId: string;
}

const fieldLabelMap: Record<string, string> = {
  name: '名称',
  description: '描述',
  status: '状态',
  dueDate: '截止日期',
  assignedId: '分配人',
  projectId: '项目',
};

const statusColorMap: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  TODO: { bg: 'bg-gray-100', text: 'text-gray-700', label: '待办' },
  IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', label: '进行中' },
  IN_REVIEW: { bg: 'bg-purple-100', text: 'text-purple-700', label: '审核中' },
  DONE: { bg: 'bg-green-100', text: 'text-green-700', label: '已完成' },
  BACKLOG: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待办列表' },
};

const formatValue = (fieldName: string, value: string | null): string => {
  if (!value || value === '-') return '-';

  // 处理状态字段
  if (fieldName === 'status') {
    return statusColorMap[value]?.label || value;
  }

  // 处理日期字段
  if (fieldName === 'dueDate') {
    try {
      const date = new Date(value);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return value;
    }
  }

  return value;
};

const getValueBadge = (fieldName: string, value: string | null) => {
  if (!value || value === '-') {
    return <span className="text-gray-500">-</span>;
  }

  if (fieldName === 'status') {
    const statusInfo = statusColorMap[value];
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}
      >
        {statusInfo?.label}
      </span>
    );
  }

  return <span className="text-sm">{formatValue(fieldName, value)}</span>;
};

export const TaskChangelog: React.FC<TaskChangelogProps> = ({ taskId }) => {
  const { data: changelog, isLoading } = useSuspenseTaskChangeLog(taskId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </Card>
    );
  }

  if (!changelog || changelog.length === 0) {
    return (
      <Card>
        <Empty title="暂无变更记录" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="divide-y">
        {changelog.map((log) => (
          <div
            key={log.id}
            className="flex gap-4 border-l-4 border-l-blue-500 p-4 transition-colors hover:bg-gray-50"
          >
            {/* 时间轴标记 */}
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div className="mt-2 h-8 w-0.5 bg-gray-200" />
            </div>

            {/* 主要内容 */}
            <div className="min-w-0 flex-1">
              {/* 标题：谁在什么时间修改了什么 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {log.changedByUser?.name || '系统'}
                  </span>
                  <span className="text-sm text-gray-600">修改了</span>
                  <span className="font-medium text-gray-900">
                    {fieldLabelMap[log.fieldName] || log.fieldName}
                  </span>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-500">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                    locale: zhCN,
                  })}
                </span>
              </div>

              {/* 变更详情 */}
              <div className="mt-2 flex items-center gap-3 text-sm">
                {/* 旧值 */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">从</span>
                  <div className="text-gray-500 line-through">
                    {getValueBadge(log.fieldName, log.oldValue)}
                  </div>
                </div>

                {/* 箭头 */}
                <span className="shrink-0 text-gray-400">→</span>

                {/* 新值 */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">到</span>
                  <div className="font-medium text-green-600">
                    {getValueBadge(log.fieldName, log.newValue)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
