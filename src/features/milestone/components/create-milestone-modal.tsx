'use client';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateMilestoneModal } from '../hooks/use-create-milestone-modal';
import { CreateMilestoneForm } from './create-milestone-form';

export const CreateMilestoneModal = () => {
  const { isOpen, open, close } = useCreateMilestoneModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={open}>
      <CreateMilestoneForm onCancel={close} />
    </ResponsiveModal>
  );
};
