'use client';

// import { useHasActiveSubscription } from "@/features/subsctiptions/hooks/use-subscription";
import { NavUser } from '@/features/auth/components/nav-user';
import { OrganizationSwitcher } from '@/features/organization/components/organization-switcher';
import {
  CircleGaugeIcon,
  FolderOpenDotIcon,
  HomeIcon,
  UsersIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
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
} from './ui/sidebar';

export function AppSidebar() {
  const t = useTranslations('Navigation');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const menuItems = [
    {
      title: 'Sidebar',
      items: [
        {
          title: t('home'),
          icon: HomeIcon,
          url: '',
        },
        {
          title: t('dashboard'),
          icon: CircleGaugeIcon,
          url: '/dashboard',
        },
        {
          title: t('projects'),
          icon: FolderOpenDotIcon,
          url: '/projects',
        },
        {
          title: t('members'),
          icon: UsersIcon,
          url: '/members',
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
                  const fullUrl = `/organization/${params.slug}${item.url}`;
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
          <NavUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
