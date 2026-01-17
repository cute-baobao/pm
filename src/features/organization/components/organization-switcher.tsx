'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { OrganizationAvatar } from './organization-avatar';

import { useSession } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, CirclePlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCreateOrganizationModal } from '../hooks/use-create-organization-modal';
import {
  useOrganizationSlug,
  useSuspenseOrganizations,
} from '../hooks/use-organization';
import { setActiveOrganization } from '../server/service';

export const OrganizationSwitcher = () => {
  const t = useTranslations('Organization.Switcher');
  const { data: organizations } = useSuspenseOrganizations();
  const router = useRouter();
  const slug = useOrganizationSlug();
  const { open } = useCreateOrganizationModal();
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const activeOrganization = organizations.find((org) => org.slug === slug);

  const handleOnValueChange = async (value: { slug: string; id: string }) => {
    // 设置当前激活的组织 防止报错
    await setActiveOrganization(session?.session.token || '', value.id);
    router.push(`/organization/${value.slug}`);
    // 失效所有查询缓存
    queryClient.clear();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {activeOrganization && (
              <OrganizationAvatar
                name={activeOrganization.name}
                image={activeOrganization.logo || undefined}
                className="size-8"
              />
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Projects</span>
            <span className="text-muted-foreground truncate text-xs">
              {activeOrganization?.name}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4 opacity-50" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) rounded-lg"
        align="end"
        side={isMobile ? 'bottom' : 'right'}
        sideOffset={4}
      >
        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.slug}
            onClick={() =>
              handleOnValueChange({
                slug: organization.slug,
                id: organization.id,
              })
            }
            className="cursor-pointer gap-2 p-2"
          >
            <OrganizationAvatar
              name={organization.name}
              image={organization.logo || undefined}
              className="size-6"
            />
            <span className="truncate font-medium">{organization.name}</span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer gap-2 p-2" onClick={open}>
          <CirclePlusIcon className="text-primary size-4" />

          <div className="text-muted-foreground font-medium">
            {t('createOrganization')}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
