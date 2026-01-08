'use client';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { CreateTaskFormWrapper } from './create-task-form-wrapper';

interface CreateTaskModalProps {}

export const CreateTaskModal = ({}: CreateTaskModalProps) => {
  const { isOpen, taskStatus, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={!!isOpen} onOpenChange={close}>
      <CreateTaskFormWrapper
        taskStatus={taskStatus ?? undefined}
      />
    </ResponsiveModal>
  );
};
