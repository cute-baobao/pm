import { AlertTriangleIcon, Loader2Icon } from 'lucide-react';

interface StateViewProps {
  message?: string;
}

interface LoadingViewProps extends StateViewProps {
  entity?: string;
}

export function LoadingView({ message, entity = 'items' }: LoadingViewProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <Loader2Icon className="text-primary size-6 animate-spin" />
      {!!message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}

interface ErrorViewProps extends StateViewProps {
  entity?: string;
}

export function ErrorView({ message, entity = 'items' }: ErrorViewProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <AlertTriangleIcon className="text-primary size-6" />
      {!!message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}
