'use client';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { CreateTaskFormWrapper } from './create-task-form-wrapper';

interface CreateTaskModalProps {
  organizationId: string;
}

export const CreateTaskModal = ({ organizationId }: CreateTaskModalProps) => {
  const { isOpen, taskStatus, close } = useCreateTaskModal();

  return (
    <ResponsiveModal open={!!isOpen} onOpenChange={close}>
      <CreateTaskFormWrapper
        organizationId={organizationId}
        taskStatus={taskStatus ?? undefined}
      />
    </ResponsiveModal>
  );
};
