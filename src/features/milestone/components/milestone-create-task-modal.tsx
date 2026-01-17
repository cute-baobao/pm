'use client';

import { CreateTaskModal } from '@/features/task/components/create-task-modal';
import { useAddTasksToMilestone } from '../hooks/use-milestone';
import { useMilestoneId } from '../hooks/use-milestone';
import { useProjectId } from '@/features/project/hooks/use-project';

export function MilestoneCreateTaskModal() {
  const milestoneId = useMilestoneId();
  const projectId = useProjectId();
  const { mutate: addTasksToMilestone } = useAddTasksToMilestone(milestoneId);

  const handleTaskSuccess = (task: any) => {
    if (task?.id) {
      addTasksToMilestone({
        milestoneId,
        taskIds: [task.id],
      });
    }
  };

  return <CreateTaskModal onSuccess={handleTaskSuccess} />;
}
