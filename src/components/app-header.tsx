'use client';
import { Breadcrumbs } from './breadcrumbs';
import { SwitchLanguage } from './switch-language';
import { SidebarTrigger } from './ui/sidebar';
export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex w-full items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Breadcrumbs />
        </div>
        <SwitchLanguage className="ml-auto" />
      </div>
    </header>
  );
}
