'use client';
import { UserButton } from '@/features/auth/components/user-button';
import { SidebarTrigger } from './ui/sidebar';
export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex w-full max-w-screen-2xl items-center mx-auto">
        <SidebarTrigger />
        <UserButton className="ml-auto" />
      </div>
    </header>
  );
}
