import { Loader } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader className="text-primary size-12 animate-spin" />
    </div>
  );
}
