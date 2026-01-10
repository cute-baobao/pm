'use client';

import { useTranslations } from 'next-intl';
import { AnalyticsCard } from './analytics-card';
import { DottedSeparator } from './dotted-separator';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface AnalyticsProps {
  data?: {
    projectCount?: number;
    projectDifference?: number;
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    incompletedTaskCount?: number;
    incompletedTaskDifference?: number;
    completeTaskCount: number;
    completeTaskDifference: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  };
}

export function Analytics({ data }: AnalyticsProps) {
  const t = useTranslations('Task.Analytics');

  if (!data) return null;

  const cards = [
    {
      title: t('totalTasks'),
      value: data.taskCount,
      variant: data.taskDifference >= 0 ? 'up' : 'down',
      increaseValue: Math.abs(data.taskDifference),
    },
    {
      title: t('assignedTasks'),
      value: data.assignedTaskCount,
      variant: data.assignedTaskDifference >= 0 ? 'up' : 'down',
      increaseValue: Math.abs(data.assignedTaskDifference),
    },
    {
      title: t('completedTasks'),
      value: data.completeTaskCount,
      variant: data.completeTaskDifference >= 0 ? 'up' : 'down',
      increaseValue: Math.abs(data.completeTaskDifference),
    },
    {
      title: t('incompletedTasks'),
      value: data.incompletedTaskCount ?? 0,
      variant: (data.incompletedTaskCount ?? 0) >= 0 ? 'up' : 'down',
      increaseValue: Math.abs(data.incompletedTaskDifference ?? 0),
    },
    {
      title: t('overdueTasks'),
      value: data.overdueTaskCount,
      variant: data.overdueTaskDifference >= 0 ? 'up' : 'down',
      increaseValue: Math.abs(data.overdueTaskDifference),
    },
  ];

  return (
    <ScrollArea className="w-full shrink-0 rounded-lg border whitespace-nowrap">
      <div className="flex w-full flex-row">
        {cards.map(({ title, value, variant, increaseValue }, index) => (
          <div className="flex flex-1 items-center" key={title}>
            <AnalyticsCard
              key={title}
              title={title}
              value={value}
              variant={variant as 'up' | 'down'}
              increaseValue={increaseValue}
            />
            {index < cards.length - 1 && (
              <DottedSeparator className="py-4" direction="vertical" />
            )}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
