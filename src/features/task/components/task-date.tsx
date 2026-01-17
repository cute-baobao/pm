import { TaskStatus } from '@/db/schemas';
import { cn } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { useFormatter } from 'next-intl';

interface TaskDateProps {
  value: Date | string;
  status?: TaskStatus;
  className?: string;
}

export function TaskDate({ value, status, className }: TaskDateProps) {
  const format = useFormatter();
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays = differenceInDays(endDate, today);

  let textColor = 'text-muted-foreground';
  if (status === 'DONE') {
    textColor = 'text-green-500';
  } else if (diffInDays <= 3) {
    textColor = 'text-red-500';
  } else if (diffInDays <= 7) {
    textColor = 'text-yellow-500';
  } else if (diffInDays <= 14) {
    textColor = 'text-orange-500';
  }

  return (
    <div className={textColor}>
      <span className={cn('truncate', className)}>
        {format.dateTime(endDate, { dateStyle: 'long' })}
      </span>
    </div>
  );
}
