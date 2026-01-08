"use client";
import { Card, CardContent } from '@/components/ui/card';
import { useSuspenseOrganizationMembers } from '@/features/organization-member/hooks/use-organization-member';
import { useGetProject, useProjectId } from '@/features/project/hooks/use-project';
import { useSession } from '@/lib/auth-client';
import { LoaderIcon } from 'lucide-react';
import { CreateTaskForm } from './create-task-form';
import { TaskStatus } from '@/db/schemas';

interface CreateTaskFormWrapperProps {
  taskStatus?: TaskStatus;
}

export const CreateTaskFormWrapper = ({
  taskStatus,
}: CreateTaskFormWrapperProps) => {
  const { data: sessionData } = useSession();
  const organizationId = sessionData?.session?.activeOrganizationId || '';
  const projectId = useProjectId();
  const { data: projects, isLoading: projectsLoading } =
    useGetProject(organizationId);
  const { data: members, isLoading: membersLoading } =
    useSuspenseOrganizationMembers(organizationId);

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

  const isLoading = projectsLoading || membersLoading;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <LoaderIcon className="text-muted-foreground size-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      projectId={projectId}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      taskStatus={taskStatus}
    />
  );
};
