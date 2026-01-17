'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskStatus } from '@/db/schemas';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { useProjectId } from '@/features/project/hooks/use-project';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type TaskRow = {
  id: string;
  name: string;
  status: TaskStatus;
  createdAt: Date;
};

type MilestoneDetailForTasks = {
  tasks: Array<{ task: TaskRow }>;
};

function TaskListItem({
  task,
  variant,
}: {
  task: TaskRow;
  variant: 'open' | 'closed';
}) {
  const slug = useOrganizationSlug();
  const projectId = useProjectId();
  const tStatus = useTranslations('Task.Status');

  return (
    <li className="flex items-start gap-3 border-b px-4 py-3 last:border-b-0">
      <Checkbox aria-label={task.name} className="mt-1" />
      <div className="mt-0.5">
        <Badge variant={task.status}>{tStatus(task.status)}</Badge>
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/organization/${slug}/projects/${projectId}/task/${task.id}`}
          className="text-sm font-medium hover:underline"
        >
          {task.name}
        </Link>
        <div className="text-muted-foreground mt-1 text-xs">
          {formatDistanceToNow(task.createdAt, { addSuffix: true })}
        </div>
      </div>
    </li>
  );
}

export function MilestoneTasks({
  milestone,
}: {
  milestone: MilestoneDetailForTasks;
}) {
  const t = useTranslations('Milestone.Detail');
  const [tab, setTab] = useState<'open' | 'closed'>('open');

  const tasks = useMemo(
    () => milestone.tasks.map((mt) => mt.task),
    [milestone.tasks],
  );

  const openTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'DONE'),
    [tasks],
  );

  const closedTasks = useMemo(
    () => tasks.filter((task) => task.status === 'DONE'),
    [tasks],
  );

  return (
    <Card className="gap-y-4 py-4 shadow-none">
      <CardContent className="p-0">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <div className="flex items-center justify-between px-4 pt-3">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger
                value="open"
                className={cn('px-3', tab === 'open' && 'bg-neutral-200')}
              >
                {t('open')}
                <span className="text-foreground ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-xs tabular-nums">
                  {openTasks.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className={cn('px-3', tab === 'closed' && 'bg-neutral-200')}
              >
                {t('closed')}
                <span className="text-foreground ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-xs tabular-nums">
                  {closedTasks.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="open" className="mt-3">
            <ul className="border-t">
              {openTasks.map((task) => (
                <TaskListItem key={task.id} task={task} variant="open" />
              ))}
              {openTasks.length === 0 && (
                <li className="text-muted-foreground px-4 py-10 text-center text-sm">
                  {t('noOpenTasks')}
                </li>
              )}
            </ul>
          </TabsContent>

          <TabsContent value="closed" className="mt-3">
            <ul className="border-t">
              {closedTasks.map((task) => (
                <TaskListItem key={task.id} task={task} variant="closed" />
              ))}
              {closedTasks.length === 0 && (
                <li className="text-muted-foreground px-4 py-10 text-center text-sm">
                  {t('noClosedTasks')}
                </li>
              )}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
