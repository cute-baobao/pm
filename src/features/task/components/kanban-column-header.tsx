import { Button } from '@/components/ui/button';
import { TaskStatus, taskStatusValues } from '@/db/schemas';
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [taskStatusValues[0]]: (
    <CircleDashedIcon className="size-[18px] text-pink-500" />
  ),
  [taskStatusValues[1]]: <CircleIcon className="size-[18px] text-red-500" />,
  [taskStatusValues[2]]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-500" />
  ),
  [taskStatusValues[3]]: (
    <CircleDotIcon className="size-[18px] text-blue-500" />
  ),
  [taskStatusValues[4]]: (
    <CircleCheckIcon className="size-[18px] text-emerald-500" />
  ),
};

export function KanbanColumnHeader({
  board,
  taskCount,
}: KanbanColumnHeaderProps) {
  const icon = statusIconMap[board as TaskStatus];
  const tStatus = useTranslations('Task.Status');

  const { open } = useCreateTaskModal();

  const onClickNewTask = () => {
    open(board as TaskStatus);
  };

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-xs font-medium">{tStatus(board)}</h2>
        <div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </div>
        <Button
          onClick={onClickNewTask}
          variant="ghost"
          size="icon"
          className="size-5"
        >
          <PlusIcon className="size-4 text-neutral-500" />
        </Button>
      </div>
    </div>
  );
}
