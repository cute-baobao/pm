'use client';

// import { useHasActiveSubscription } from "@/features/subsctiptions/hooks/use-subscription";
import { signOut } from '@/lib/auth-client';
import { protocol, rootDomain } from '@/lib/utils';
import {
  CircleGaugeIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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
  const t = useTranslations('AppSidebar');
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
            <SidebarMenuButton size="lg" asChild className="md:h-12">
              <Link prefetch href={'/'}>
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/icons/logo.svg"
                    alt="Projects"
                    width={20}
                    height={20}
                    className="brightness-0 invert filter"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold">Projects</span>
                  <span className="text-muted-foreground text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title} title={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const fullUrl = `${protocol}://${params.subdomain}.${rootDomain}${item.url}`;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={
                          item.url === '/'
                            ? pathname === '/'
                            : pathname.startsWith(item.url)
                        }
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
          {/* {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Upgrade to Pro"}
                className="h-10 gap-x-4 px-4"
                onClick={() => authClient.checkout({ slug: "pro" })}
              >
                <StarIcon className="size-4" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )} */}
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Billing Portal"}
              className="h-10 gap-x-4 px-4"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="size-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('settings')}
              className="h-10 gap-x-4 px-4"
              //   onClick={() => authClient.customer.portal()}
            >
              <SettingsIcon className="size-4" />
              <span>{t('settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('signOut')}
              className="h-10 gap-x-4 px-4"
              onClick={() =>
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push('/login');
                    },
                  },
                })
              }
            >
              <LogOutIcon className="size-4" />
              <span>{t('signOut')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
