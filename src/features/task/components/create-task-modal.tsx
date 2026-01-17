'use client';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { CreateTaskFormWrapper } from './create-task-form-wrapper';

interface CreateTaskModalProps {
  onSuccess?: (task: any) => void;
}

export const CreateTaskModal = ({
  onSuccess,
}: CreateTaskModalProps) => {
  const { isOpen, taskStatus, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={!!isOpen} onOpenChange={close}>
      <CreateTaskFormWrapper
        taskStatus={taskStatus ?? undefined}
        onCancel={close}
        onSuccess={(task) => {
          close();
          onSuccess?.(task);
        }}
      />
    </ResponsiveModal>
  );
};
