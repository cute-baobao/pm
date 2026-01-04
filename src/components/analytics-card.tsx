import { cn } from '@/lib/utils';
import { MoveDownLeftIcon, MoveUpRightIcon } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: 'up' | 'down';
  increaseValue: number;
}

export function AnalyticsCard({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) {
  const iconColor = variant === 'up' ? 'text-emerald-500' : 'text-red-500';
  const increaseValueColor =
    variant === 'up' ? 'text-emerald-500' : 'text-red-500';
  const Icon = variant === 'up' ? MoveUpRightIcon : MoveDownLeftIcon;

  return (
    <Card className="w-full min-w-[200px] border-none shadow-none">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 overflow-hidden font-medium">
            <span className="truncate text-base">{title}</span>
          </CardDescription>

          <div className="flex items-center gap-x-1">
            <Icon className={cn(iconColor, 'size-4')} />
            <span
              className={cn(
                increaseValueColor,
                'truncate text-base font-medium',
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
