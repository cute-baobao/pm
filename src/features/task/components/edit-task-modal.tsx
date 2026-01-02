'use client';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { EditTaskFormWrapper } from './edit-task-form-wrapper';

interface EditTaskModalProps {}

export const EditTaskModal = ({}: EditTaskModalProps) => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && (
        <EditTaskFormWrapper taskId={taskId}/>
      )}
    </ResponsiveModal>
  );
};
