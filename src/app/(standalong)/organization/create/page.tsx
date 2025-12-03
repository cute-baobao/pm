import { CreateOrganizationForm } from '@/features/organization/components/create-organization-form';
import { requireAuth } from '@/lib/utils/auth-action';

export default async function CreateOrganizationPage() {
  await requireAuth();
  return (
    <div className="w-full lg:max-w-xl">
      <CreateOrganizationForm />
    </div>
  );
}
