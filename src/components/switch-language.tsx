'use client';

import { LanguagesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageSwitch } from '@/lib/hooks/use-locale-switch';
import { cn } from '@/lib/utils';

export function SwitchLanguage({ className }: { className?: string }) {
  const { availableLocales, currentLocale, switchLanguage } =
    useLanguageSwitch();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className={cn(className)} asChild>
          <Button variant="ghost" aria-label="Switch Language" size="icon-sm">
            <LanguagesIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            {availableLocales.map((locale) => (
              <DropdownMenuItem
                key={locale.code}
                onSelect={() => switchLanguage(locale.code)}
                disabled={locale.code === currentLocale}
                className={cn(locale.code === currentLocale && 'bg-accent text-primary')}
              >
                {locale.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
