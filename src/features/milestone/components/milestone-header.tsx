'use client';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2Icon,
  CircleDotIcon,
} from 'lucide-react';
import { MilestoneBreadcrumbs } from './milestone-breadcrumbs';
import { MilestoneDescription } from './milestone-description';

type MilestoneDetail = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  targetDate: Date | null;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  createdAt: Date;
  updatedAt: Date;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  project: {
    id: string;
    name: string;
    image: string | null;
  };
};

function StatusBadge({ status }: { status: MilestoneDetail['status'] }) {
  const t = useTranslations('Milestone.Detail');

  if (status === 'COMPLETED') {
    return (
      <Badge variant="secondary" className="gap-1">
        <CheckCircle2Icon className="size-3.5" />
        {t('closed')}
      </Badge>
    );
  }

  return (
    <Badge className="bg-green-600 hover:bg-green-600/90 gap-1">
      <CircleDotIcon className="size-3.5" />
      {t('open')}
    </Badge>
  );
}

export function MilestoneHeader({ milestone }: { milestone: MilestoneDetail }) {
  const t = useTranslations('Milestone');
  const tDetail = useTranslations('Milestone.Detail');

  const dueText = milestone.targetDate
    ? format(milestone.targetDate, 'PPP')
    : tDetail('noDueDate');

  return (
    <div className="flex flex-col gap-4">
      <MilestoneBreadcrumbs
        project={milestone.project}
        milestone={{
          id: milestone.id,
          projectId: milestone.projectId,
          name: milestone.name,
          status: milestone.status,
        }}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={milestone.status} />
            <p className="text-muted-foreground text-sm">
              {tDetail('dueBy', { date: dueText })}
              <span className="mx-2">·</span>
              {tDetail('lastUpdated', {
                date: formatDistanceToNow(milestone.updatedAt, {
                  addSuffix: true,
                }),
              })}
            </p>
          </div>

          <div className="text-muted-foreground text-sm tabular-nums">
            <span className="text-foreground font-medium">
              {milestone.percentage || 0}%
            </span>{' '}
            {tDetail('complete')}
          </div>
        </div>

        <Progress value={milestone.percentage || 0} className="h-1.5" />
      </div>

      <MilestoneDescription
        milestoneId={milestone.id}
        description={milestone.description}
      />
    </div>
  );
}
