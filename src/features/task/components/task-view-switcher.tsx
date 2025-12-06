import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useSuspenseTasks } from '../hooks/use-task';

interface TaskViewSwitcherProps {
  organizationId: string;
  projectId: string;
  onNewTask?: () => void;
}

export function TaskViewSwitcher({
  organizationId,
  onNewTask,
}: TaskViewSwitcherProps) {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });

  const { data: tasks, isLoading: isTaskLoading } = useSuspenseTasks({
    organizationId,
  });

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
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={onNewTask} className="w-full lg:w-auto" size="sm">
            <PlusIcon className="mr-2 size-4" />
            New Task
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        Data filter
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            {JSON.stringify(tasks)}
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Kanban Board View
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Calendar View
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
}
