'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { milestoneStatusValues } from '@/db/schemas';
import { useEditMilestoneModal } from '../hooks/use-edit-milestone-modal';
import { EditMilestoneForm } from './edit-milestone-form';

type MilestoneTaskRow = { task: { id: string; name: string } };

type MilestoneForEdit = {
  id: string;
  name: string;
  description: string | null;
  targetDate: Date | null;
  status: (typeof milestoneStatusValues)[number];
  tasks?: MilestoneTaskRow[];
};

interface EditMilestoneModalProps {
  milestone: MilestoneForEdit;
}

export function EditMilestoneModal({ milestone }: EditMilestoneModalProps) {
  const { isOpen, open, close } = useEditMilestoneModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={open}>
      <EditMilestoneForm milestone={milestone} onCancel={close} />
    </ResponsiveModal>
  );
}
