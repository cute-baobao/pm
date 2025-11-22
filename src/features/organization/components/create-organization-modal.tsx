'use client';
import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateOrganizationModal } from '../hooks/use-create-organization-modal';
import { CreateOrganizationForm } from './create-organization-form';

export const CreateOrganizationModal = () => {
  const { isOpen, setIsOpen, close } = useCreateOrganizationModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateOrganizationForm onCancel={close} />
    </ResponsiveModal>
  );
};
