'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { useConfirm } from '@/lib/hooks/use-confirm';
import { useTranslations } from 'next-intl';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { useDeleteTask } from '../hooks/use-task';

interface TaskActionProps {
  id: string;
  projectId: string;
  children?: React.ReactNode;
}

export function TaskAction({ id, projectId, children }: TaskActionProps) {
  const slug = useOrganizationSlug();
  const router = useRouter();
  const t = useTranslations('Task.Actions');
  const [ConfirmDialog, confirm] = useConfirm(
    t('deleteConfirmTitle'),
    t('deleteConfirmMessage'),
    'destructive',
  );

  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const { open } = useEditTaskModal();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteTask({ taskId: id });
  };

  const onOpenProject = () => {
    router.push(`/organization/${slug}/projects/${projectId}`);
  };

  const onOpenTask = () => {
    router.push(`/organization/${slug}/projects/${projectId}/task/${id}`);
  };

  const onEditTask = () => {
    open(id);
  };

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
            {t('taskDetails')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
            {t('openProject')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onEditTask}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <PencilIcon className="mr-2 size-4 stroke-2" />
            {t('edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeleting}
            className="p-[10px] font-medium text-amber-700 focus-within:text-amber-700/80"
          >
            <TrashIcon className="mr-2 size-4 stroke-2" />
            {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
