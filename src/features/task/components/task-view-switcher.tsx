import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { PlusIcon } from 'lucide-react';

interface TaskViewSwitcherProps {
  onNewTask?: () => void;
}

export function TaskViewSwitcher({ onNewTask }: TaskViewSwitcherProps) {
  return (
    <Tabs className="w-full flex-1 rounded-lg border">
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
            Data Table View
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
