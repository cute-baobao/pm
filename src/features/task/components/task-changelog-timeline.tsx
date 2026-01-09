'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty } from '@/components/ui/empty';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  FileText,
  CheckCircle2,
  Calendar,
  User,
  FolderOpen,
  Zap,
} from 'lucide-react';
import { useSuspenseTaskChangeLog, useTaskId } from '../hooks/use-task';

interface TaskChangelogTimelineProps {
  taskId: string;
}

const fieldIconMap: Record<string, React.ReactNode> = {
  name: <FileText className="h-4 w-4" />,
  description: <FileText className="h-4 w-4" />,
  status: <CheckCircle2 className="h-4 w-4" />,
  dueDate: <Calendar className="h-4 w-4" />,
  assignedId: <User className="h-4 w-4" />,
  projectId: <FolderOpen className="h-4 w-4" />,
};

const fieldLabelMap: Record<string, string> = {
  name: '名称',
  description: '描述',
  status: '状态',
  dueDate: '截止日期',
  assignedId: '分配人',
  projectId: '项目',
};

const statusMap: Record<string, { label: string; color: string }> = {
  TODO: { label: '待办', color: 'bg-slate-100 text-slate-800' },
  IN_PROGRESS: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
  IN_REVIEW: { label: '审核中', color: 'bg-purple-100 text-purple-800' },
  DONE: { label: '已完成', color: 'bg-green-100 text-green-800' },
  BACKLOG: { label: '待办列表', color: 'bg-yellow-100 text-yellow-800' },
};

const formatValue = (
  fieldName: string,
  value: string | null,
): React.ReactNode => {
  if (!value || value === '-') return '-';

  if (fieldName === 'status' && statusMap[value]) {
    return (
      <Badge variant="outline" className={statusMap[value].color}>
        {statusMap[value].label}
      </Badge>
    );
  }

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

  return <span className="font-medium">{value}</span>;
};

const getChangelogMessage = (
  fieldName: string,
  oldValue: string | null,
  newValue: string | null,
): string => {
  const fieldLabel = fieldLabelMap[fieldName] || fieldName;

  // 对于某些字段的特殊处理
  if (fieldName === 'name') {
    return `更改了${fieldLabel}`;
  }
  if (fieldName === 'description') {
    return `更新了${fieldLabel}`;
  }
  if (fieldName === 'status') {
    return `将状态从 ${oldValue || '无'} 更改为 ${newValue || '无'}`;
  }
  if (fieldName === 'dueDate') {
    return `设置${fieldLabel}为 ${newValue ? formatValue(fieldName, newValue) : '无'}`;
  }
  if (fieldName === 'assignedId') {
    return `将任务分配给了用户`;
  }
  if (fieldName === 'projectId') {
    return `将任务移动到了项目`;
  }

  return `修改了${fieldLabel}`;
};

export function TaskChangelogTimeline() {
  const taskId = useTaskId();
  const { data: changelog, isLoading } = useSuspenseTaskChangeLog(taskId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>变更历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!changelog || changelog.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>变更历史</CardTitle>
        </CardHeader>
        <CardContent>
          <Empty title="暂无变更记录" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>变更历史</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {changelog.map((log) => (
            <div
              key={log.id}
              className="flex gap-3 py-3 hover:bg-gray-50 px-2 rounded-md transition-colors"
            >
              {/* 左侧图标 */}
              <div className="relative flex items-start pt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  {fieldIconMap[log.fieldName] || <Zap className="h-4 w-4" />}
                </div>
              </div>

              {/* 右侧内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">
                    {log.changedByUser?.name || '系统'}
                  </span>
                  <span className="text-gray-700">
                    {getChangelogMessage(
                      log.fieldName,
                      log.oldValue,
                      log.newValue,
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                      locale: zhCN,
                    })}
                  </span>
                </div>

                {/* 如果有特别的值变化信息，显示为内联标签 */}
                {log.fieldName === 'status' && (
                  <div className="mt-1 flex gap-2 items-center text-sm">
                    <span className="text-gray-500">
                      <span className="line-through opacity-60">
                        {formatValue(log.fieldName, log.oldValue)}
                      </span>
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-700">
                      {formatValue(log.fieldName, log.newValue)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
