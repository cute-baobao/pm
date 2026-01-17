'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TaskStatus } from '@/db/schemas';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { useSuspenseOrganizationMembers } from '@/features/organization-member/hooks/use-organization-member';
import { useOrganizationId } from '@/features/organization/hooks/use-organization';
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  FolderOpen,
  User,
} from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useSuspenseTaskChangeLog, useTaskId } from '../hooks/use-task';

const fieldIconMap: Record<string, React.ElementType> = {
  status: CheckCircle2,
  dueDate: Calendar,
  assignedId: User,
  projectId: FolderOpen,
  name: FileText,
  description: FileText,
};

export function TaskChangelogTimeline() {
  const t = useTranslations('Task.ChangeLog');
  const tLog = useTranslations('Task.ChangeLog.log');
  const tStatus = useTranslations('Task.Status');
  const format = useFormatter();

  const taskId = useTaskId();
  const organizationId = useOrganizationId();
  const { data: changelog, isLoading: isLoadingLogs } =
    useSuspenseTaskChangeLog(taskId);
  const { data: members, isLoading: isLoadingMembers } =
    useSuspenseOrganizationMembers(organizationId);

  const isLoading = isLoadingLogs || isLoadingMembers;

  // Helper to find member by ID
  const getMember = (id: string | null) => {
    if (!id || !members) return null;
    // The members data structure might vary, adjust if needed
    // Assuming members is an array of objects with user property or id
    return members.find((m) => m.userId === id || m.id === id)?.user;
  };

  if (isLoading) {
    return (
      <Card className="gap-y-4 py-4 shadow-none">
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <DottedSeparator className="px-6" />
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted h-12 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!changelog || changelog.length === 0) {
    return (
      <Card className="gap-y-4 py-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
        </CardHeader>
        <DottedSeparator className="px-6" />
        <div className="text-muted-foreground p-6 text-center">
          <Activity className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p>{t('empty')}</p>
        </div>
      </Card>
    );
  }

  const renderValue = (
    fieldName: string,
    value: string | null,
    isOld: boolean = false,
  ) => {
    if (!value) {
      return (
        <span className="text-muted-foreground text-xs italic">
          {isOld ? '' : 'None'}
        </span>
      );
    }

    let content: React.ReactNode = value;

    if (fieldName === 'status') {
      content = (
        <Badge variant={value as TaskStatus}>{tStatus(value as any)}</Badge>
      );
    } else if (fieldName === 'dueDate') {
      try {
        const date = new Date(value);
        const formatted = format.dateTime(date, { dateStyle: 'medium' });
        content = (
          <span
            className={
              isOld ? 'text-muted-foreground line-through' : 'text-foreground'
            }
          >
            {formatted}
          </span>
        );
      } catch {
        content = <span>{value}</span>;
      }
    } else if (fieldName === 'assignedId') {
      const member = getMember(value);
      if (member) {
        content = (
          <div
            className={`flex items-center gap-1.5 ${
              isOld ? 'opacity-50 grayscale' : ''
            }`}
          >
            <MemberAvatar
              name={member.name || 'User'}
              image={member.image}
              className="h-5 w-5"
            />
            <span
              className={`text-sm font-medium ${isOld ? 'line-through' : ''}`}
            >
              {member.name}
            </span>
          </div>
        );
      } else {
        content = (
          <span
            className={`font-mono text-xs ${
              isOld ? 'text-muted-foreground line-through' : 'text-foreground'
            }`}
          >
            {value.slice(0, 8)}...
          </span>
        );
      }
    } else if (fieldName === 'projectId') {
      content = (
        <span
          className={`font-mono text-xs ${
            isOld ? 'text-muted-foreground line-through' : 'text-foreground'
          }`}
        >
          {value.slice(0, 8)}...
        </span>
      );
    } else {
      // Text fields (name, description)
      const isLong = value.length > 20;

      if (isLong) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`max-w-[180px] cursor-help truncate font-medium ${
                    isOld
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {value}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-pretty">
                <p>{value}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      } else {
        content = (
          <span
            className={
              isOld
                ? 'text-muted-foreground font-medium line-through'
                : 'text-foreground font-medium'
            }
          >
            {value}
          </span>
        );
      }
    }

    return content;
  };

  return (
    <Card className="w-full gap-y-4 py-4 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('title')}</CardTitle>
      </CardHeader>
      <DottedSeparator className="px-6" />
      <CardContent className="relative space-y-6">
        {/* Timeline Line */}
        <div className="bg-border absolute top-5 bottom-5 left-11 w-px" />

        {changelog.map((log) => {
          const isSystem = !log.changedByUser;
          const user = log.changedByUser;
          const Icon = fieldIconMap[log.fieldName] || Activity;

          let actionText = '';
          switch (log.fieldName) {
            case 'status':
              actionText = tLog('status');
              break;
            case 'assignedId':
              actionText = tLog('assignedId');
              break;
            case 'dueDate':
              actionText = tLog('dueDate');
              break;
            case 'projectId':
              actionText = tLog('projectId');
              break;
            case 'name':
              actionText = tLog('name');
              break;
            case 'description':
              actionText = tLog('description');
              break;
            default:
              actionText = tLog('default', { field: log.fieldName });
          }

          return (
            <div key={log.id} className="group relative flex gap-4">
              {/* Icon Node */}
              <div className="relative z-10 flex shrink-0 items-center justify-center">
                <div className="bg-background border-muted ring-background group-hover:border-primary/50 flex h-10 w-10 items-center justify-center rounded-full border-2 ring-4 transition-colors">
                  <Icon className="text-muted-foreground group-hover:text-primary h-5 w-5 transition-colors" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1 pt-1">
                {/* Header: User & Time */}
                <div className="text-foreground flex flex-wrap items-center gap-2 text-sm">
                  <div className="flex items-center gap-2 font-semibold">
                    {!isSystem && (
                      <MemberAvatar
                        name={user?.name || 'User'}
                        image={user?.image}
                        className="h-5 w-5 hover:opacity-100"
                        fallbackClassName="text-[10px]"
                      />
                    )}
                    <span>
                      {isSystem ? 'System' : user?.name || t('unknownUser')}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{actionText}</span>
                  <span className="text-muted-foreground text-xs">
                    {format.relativeTime(new Date(log.createdAt), new Date())}
                  </span>
                </div>

                {/* Body: Diff Box */}
                {/* Only show diff box if there are values to show */}
                <div className="mt-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    {log.oldValue && (
                      <>
                        <div className="max-w-[45%] shrink-0">
                          {renderValue(log.fieldName, log.oldValue, true)}
                        </div>
                        <ArrowRight className="text-muted-foreground/50 h-3.5 w-3.5 shrink-0 px-0.5" />
                      </>
                    )}

                    <div className="max-w-[45%] shrink-0">
                      {renderValue(log.fieldName, log.newValue, false)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
