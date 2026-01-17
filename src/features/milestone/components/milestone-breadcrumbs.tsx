'use client';

import { Button } from '@/components/ui/button';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { ProjectAvatar } from '@/features/project/components/project-avatar';
import { useCreateTaskModal } from '@/features/task/hooks/use-create-task-modal';
import { useConfirm } from '@/lib/hooks/use-confirm';
import {
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditMilestoneModal } from '../hooks/use-edit-milestone-modal';
import { useDeleteMilestone, useUpdateMilestone } from '../hooks/use-milestone';

type ProjectLite = {
  id: string;
  name: string;
  image: string | null;
};

type MilestoneLite = {
  id: string;
  projectId: string;
  name: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
};

interface MilestoneBreadcrumbsProps {
  project: ProjectLite;
  milestone: MilestoneLite;
}

export function MilestoneBreadcrumbs({
  project,
  milestone,
}: MilestoneBreadcrumbsProps) {
  const slug = useOrganizationSlug();
  const router = useRouter();
  const t = useTranslations('Milestone');
  const tDetail = useTranslations('Milestone.Detail');
  const { open: openEditModal } = useEditMilestoneModal();
  const { open: openCreateTaskModal } = useCreateTaskModal();

  const { mutate: deleteMilestone, isPending: isDeleting } =
    useDeleteMilestone();
  const { mutate: updateMilestone, isPending: isUpdating } =
    useUpdateMilestone();

  const [ConfirmDialog, confirm] = useConfirm(
    tDetail('deleteConfirmTitle'),
    tDetail('deleteConfirmMessage'),
    'destructive',
  );

  const isClosed = milestone.status === 'COMPLETED';

  const handleToggleClosed = () => {
    updateMilestone({
      milestoneId: milestone.id,
      status: isClosed ? 'IN_PROGRESS' : 'COMPLETED',
    });
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMilestone(milestone.id, {
      onSuccess: () => {
        router.push(
          `/organization/${slug}/projects/${milestone.projectId}/milestones`,
        );
      },
    });
  };

  return (
    <>
      <ConfirmDialog />
      <div className="flex items-center gap-x-2">
        <ProjectAvatar
          className="size-6"
          name={project.name}
          image={project.image ?? undefined}
          fallbackClassName="text-[10px]"
        />
        <Link href={`/organization/${slug}/projects/${project.id}`}>
          <p className="text-muted-foreground text-sm font-semibold transition hover:opacity-75 lg:text-lg">
            {project.name}
          </p>
        </Link>
        <ChevronRightIcon className="text-muted-foreground size-4 lg:size-5" />
        <Link
          href={`/organization/${slug}/projects/${milestone.projectId}/milestones`}
        >
          <p className="text-muted-foreground text-sm font-semibold transition hover:opacity-75 lg:text-lg">
            {t('List.title')}
          </p>
        </Link>
        <ChevronRightIcon className="text-muted-foreground size-4 lg:size-5" />
        <p className="truncate text-sm font-semibold lg:text-lg">
          {milestone.name}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditModal(true)}
          >
            <PencilIcon className="size-4 lg:mr-2" />
            <span>{tDetail('edit')}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleToggleClosed}
            disabled={isUpdating}
          >
            {isClosed ? tDetail('reopen') : tDetail('close')}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <TrashIcon className="size-4 lg:mr-2" />
            <span>{tDetail('delete')}</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => openCreateTaskModal()}
          >
            <PlusIcon className="size-4 lg:mr-2" />
            <span>{tDetail('createTask')}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
