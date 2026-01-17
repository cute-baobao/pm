'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { ErrorView, LoadingView } from '@/components/entity-component';
import { EditMilestoneModal } from '@/features/milestone/components/edit-milestone-modal';
import { MilestoneCreateTaskModal } from '@/features/milestone/components/milestone-create-task-modal';
import { MilestoneHeader } from '@/features/milestone/components/milestone-header';
import { MilestoneTasks } from '@/features/milestone/components/milestone-tasks';
import {
  useMilestoneId,
  useSuspenseMilestoneById,
} from '@/features/milestone/hooks/use-milestone';
import { useTranslations } from 'next-intl';

export function MilestoneLoading() {
  const t = useTranslations('Milestone.View');
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingView messageNode={t('loading')} />
    </div>
  );
}

export function MilestoneError() {
  const t = useTranslations('Milestone.View');
  return <ErrorView message={t('error')} entity="Milestone" />;
}

export function MilestoneClient() {
  const milestoneId = useMilestoneId();
  const t = useTranslations('Milestone.View');
  const { data: milestone } = useSuspenseMilestoneById(milestoneId);

  if (!milestone) return <div>{t('notFound')}</div>;

  return (
    <div className="flex flex-col">
      <EditMilestoneModal milestone={milestone as any} />
      <MilestoneCreateTaskModal />
      <MilestoneHeader milestone={milestone as any} />
      <DottedSeparator className="my-6" />
      <MilestoneTasks milestone={milestone as any} />
    </div>
  );
}
