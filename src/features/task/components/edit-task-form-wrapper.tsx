'use client';
import { Card, CardContent } from '@/components/ui/card';
import { useSuspenseOrganizationMembers } from '@/features/organization-member/hooks/use-organization-member';
import { useGetProject } from '@/features/project/hooks/use-project';
import { useSession } from '@/lib/auth-client';
import { LoaderIcon } from 'lucide-react';
import { useGetTask } from '../hooks/use-task';
import { EditTaskForm } from './edit-task-form';

interface EditTaskFormWrapperProps {
  taskId: string;
}

export const EditTaskFormWrapper = ({ taskId }: EditTaskFormWrapperProps) => {
  const { data: sessionData } = useSession();
  const organizationId = sessionData?.session?.activeOrganizationId || '';
  const { data: projects, isLoading: projectsLoading } =
    useGetProject(organizationId);
  const { data: members, isLoading: membersLoading } =
    useSuspenseOrganizationMembers(organizationId);

  const { data: task, isLoading: taskLoading } = useGetTask(taskId);

  const projectOptions = projects?.map((project) => ({
    name: project.name,
    id: project.id,
    imageUrl: project.image,
  }));

  const memberOptions = members.map((member) => ({
    name: member.user.name,
    id: member.user.id,
    imageUrl: member.user.image,
  }));

  const isLoading = projectsLoading || membersLoading || taskLoading;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <LoaderIcon className="text-muted-foreground size-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <EditTaskForm
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      initialValue={task}
    />
  );
};
