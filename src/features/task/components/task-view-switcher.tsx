'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';
import { useBulkUpdateTasks, useSuspenseTasks } from '../hooks/use-task';
import { UpdateTaskData } from '../schema';
import { columns } from './columns';
import { DataCalendar } from './data-calendar';
import { DataFilters } from './data-filters';
import { DataKanban } from './data-kanban';
import { DataTable } from './data-table';

interface TaskViewSwitcherProps {
  organizationId: string;
  onNewTask?: () => void;
  hideProjectFilter?: boolean;
}

export function TaskViewSwitcher({
  organizationId,
  onNewTask,
  hideProjectFilter = false,
}: TaskViewSwitcherProps) {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });
  const t = useTranslations('Task.Views');

  const { data: tasks, isLoading: isTaskLoading } =
    useSuspenseTasks(organizationId);

  const { mutate: bulkUpdateTask } = useBulkUpdateTasks();

  const onChange = (data: UpdateTaskData[]) => {
    bulkUpdateTask(data);
  };

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              {t('table')}
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              {t('kanban')}
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              {t('calendar')}
            </TabsTrigger>
          </TabsList>
          {onNewTask && (
            <Button onClick={onNewTask} className="w-full lg:w-auto" size="sm">
              <PlusIcon className="mr-2 size-4" />
              {t('newTask')}
            </Button>
          )}
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters
          organizationId={organizationId}
          hideProjectFilter={hideProjectFilter}
        />
        <DottedSeparator className="my-4" />
        {isTaskLoading ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader className="text-muted-foreground size-5 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban onChange={onChange} data={tasks || []} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataCalendar data={tasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
