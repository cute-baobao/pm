"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirm } from '@/lib/hooks/use-confirm';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useDeleteTask } from '../hooks/use-task';
import { useRouter } from 'next/navigation';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

interface TaskActionProps {
  id: string;
  projectId: string;
  children?: React.ReactNode;
}

export function TaskAction({ id, projectId, children }: TaskActionProps) {
  const slug = useOrganizationSlug()
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Task',
    'This action cannot be undone',
    'destructive',
  );

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const { open } = useEditTaskModal()

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteTask({ taskId: id });
  };

  const onOpenProject = () => {
    router.push(`/organization/${slug}/projects/${projectId}`);
  }

  const onOpenTask = () => {
    router.push(`/organization/${slug}/tasks/${id}`);
  }

  const onEditTask = () => {
    open(id)
  }

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onEditTask}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <PencilIcon className="mr-2 size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeleting}
            className="p-[10px] font-medium text-amber-700 focus-within:text-amber-700/80"
          >
            <TrashIcon className="mr-2 size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
