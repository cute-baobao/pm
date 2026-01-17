'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavUser } from '@/features/auth/components/nav-user';
import { OrganizationSwitcher } from '@/features/organization/components/organization-switcher';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import {
  FolderOpenDotIcon,
  HomeIcon,
  MilestoneIcon,
  SettingsIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export function ProjectSidebar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const params = useParams();
  const slug = useOrganizationSlug();

  const menuItems = [
    {
      title: 'Sidebar',
      items: [
        {
          title: t('home'),
          icon: HomeIcon,
          url: `/organization/${slug}`,
        },
        {
          title: t('project'),
          icon: FolderOpenDotIcon,
          url: '',
        },
        {
          title: t('milestones'),
          icon: MilestoneIcon,
          url: '/milestones',
        },
      ],
    },
  ];

  //   const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-1">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title} title={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const fullUrl = `/organization/${params.slug}/projects/${params.projectId}${item.url}`;
                  const isActive =
                    item.url === ''
                      ? pathname === fullUrl
                      : pathname === fullUrl ||
                        pathname.startsWith(`${fullUrl}/`);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        asChild
                        className="h-10 gap-x-4 px-4"
                      >
                        <Link href={fullUrl} prefetch>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('settings')}
              asChild
              isActive={pathname.startsWith(
                `/organization/${params.slug}/projects/${params.projectId}/edit`,
              )}
              className="h-10 gap-x-4 px-4"
            >
              <Link
                href={`/organization/${params.slug}/projects/${params.projectId}/edit`}
                prefetch
              >
                <SettingsIcon className="size-4" />
                <span>{t('settings')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <NavUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
