import { CreateMilestoneForm } from '@/features/milestone/components/create-milestone';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';

interface CreateMilestonePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CreateMilestonePage({
  params,
}: CreateMilestonePageProps) {
  const { slug } = await params;
  const session = await requireOrganizationAccess(slug);
  return (
    <div className="flex w-full items-center justify-center">
      <CreateMilestoneForm />
    </div>
  );
}
