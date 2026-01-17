'use client';

import { useOrganizationId } from '@/features/organization/hooks/use-organization';
import { TaskViewSwitcher } from '@/features/task/components/task-view-switcher';

export function MyTasksClient() {
  const organizationId = useOrganizationId();

  return <TaskViewSwitcher organizationId={organizationId} />;
}
