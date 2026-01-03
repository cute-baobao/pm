import { Button } from '@/components/ui/button';
import { Project, Task } from '@/db/schemas';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { ProjectAvatar } from '@/features/project/components/project-avatar';
import { useConfirm } from '@/lib/hooks/use-confirm';
import { ChevronRightIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteTask } from '../hooks/use-task';

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const slug = useOrganizationSlug();

  const { mutate, isPending } = useDeleteTask();
  const router = useRouter();

  const [ConfrimDialog, confirm] = useConfirm(
    'Delete task',
    'This action cannot be undone.',
    'destructive',
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      {
        taskId: task.id,
      },
      {
        onSuccess: () => {
          router.push(`/organization/${slug}/projects/${project.id}`);
        },
      },
    );
  };
  return (
    <>
      <ConfrimDialog />
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
        <p className="text-sm font-semibold lg:text-lg">{task.name}</p>
        <Button
          onClick={handleDeleteTask}
          className="ml-auto"
          variant="destructive"
          size="sm"
          disabled={isPending}
        >
          <TrashIcon className="size-4 lg:mr-2" />
          <span>Delete Task</span>
        </Button>
      </div>
    </>
  );
}
