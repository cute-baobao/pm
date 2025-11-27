import { CreateProjectForm } from '@/features/project/components/create-project-form';
import { requireOrganizationAccess } from '@/lib/utils/auth-action';

interface CreateProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CreateProjectPage({
  params,
}: CreateProjectPageProps) {
  const { slug } = await params;
  const session = await requireOrganizationAccess(slug);
  return (
    <div className="flex w-full items-center justify-center">
      <CreateProjectForm
        organizationId={session.session.activeOrganizationId!}
      />
    </div>
  );
}
