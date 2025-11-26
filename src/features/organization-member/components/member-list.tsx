'use client';
import { DottedSeparator } from '@/components/dotted-separator';
import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

import { useConfirm } from '@/lib/hooks/use-confirm';
import { Crown, MoreVerticalIcon, ShieldCheck, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import type { OrganizationRole } from '@/db/schemas';
import { userAtom } from '@/features/auth/store/atom';
import { useAtom } from 'jotai';
import {
  useDeleteOrganizationMember,
  useSuspenseOrganizationMembers,
  useUpdateOrganizationMemberRole,
} from '../hooks/use-organization-member';
import { MemberAvatar } from './member-avatar';

// role badge config
const roleConfig: Record<
  OrganizationRole,
  { icon: React.ElementType; className: string }
> = {
  owner: {
    icon: Crown,
    className:
      'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
  },
  admin: {
    icon: ShieldCheck,
    className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
  },
  member: {
    icon: User,
    className:
      'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
  },
};

interface MemberListProps {
  organizationId: string;
  role?: OrganizationRole;
}

export const MemberList = ({ role, organizationId }: MemberListProps) => {
  const [user] = useAtom(userAtom);
  const t = useTranslations('OrganizationMember.MemberList');
  const tRoles = useTranslations('OrganizationMember.Roles');
  const { data: members } = useSuspenseOrganizationMembers(organizationId);
  const updateMemberRole = useUpdateOrganizationMemberRole();
  const deleteMember = useDeleteOrganizationMember();

  const [ConfirmDialog, confirm] = useConfirm(
    t('removeConfirmTitle'),
    t('removeConfirmMessage'),
    'destructive',
  );

  const handleUpdateMemberRole = async (
    role: OrganizationRole,
    memberId: string,
  ) => {
    updateMemberRole.mutate({
      memberId,
      operatorId: user!.id,
      role,
      organizationId,
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember.mutate({
      memberId,
      operatorId: user!.id,
      organizationId,
    });
  };

  return (
    <Card className="mx-auto w-full max-w-4xl ">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center space-y-0 gap-x-4">
        <CardTitle className="text-xl font-bold">{t('title')}</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 py-4">
        {members &&
          members.map(({ user, id, role: memberRole }, index) => {
            const roleInfo = roleConfig[memberRole];
            const RoleIcon = roleInfo.icon;

            return (
              <Fragment key={id}>
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    name={user.name}
                    image={user.image}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{user.name}</p>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${roleInfo.className}`}
                      >
                        <RoleIcon className="size-3" />
                        {tRoles(memberRole)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant="secondary"
                        size="icon"
                      >
                        <MoreVerticalIcon className="text-muted-foreground size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => {
                          handleUpdateMemberRole('admin', id);
                        }}
                        disabled={
                          updateMemberRole.isPending ||
                          memberRole === 'admin' ||
                          memberRole === 'owner' ||
                          role === 'member'
                        }
                      >
                        {t('setAdmin')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() => {
                          handleUpdateMemberRole('member', id);
                        }}
                        disabled={
                          updateMemberRole.isPending ||
                          memberRole === 'member' ||
                          memberRole === 'owner' ||
                          role === 'member' ||
                          (role === 'admin' && memberRole === 'admin')
                        }
                      >
                        {t('setMember')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => handleDeleteMember(id)}
                        disabled={
                          memberRole === 'owner' ||
                          role === 'member' ||
                          (role === 'admin' && memberRole === 'admin') ||
                          deleteMember.isPending
                        }
                      >
                        {t('removeMember', { name: user.name })}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {index < members.length - 1 && <Separator className="my-2.5" />}
              </Fragment>
            );
          })}
      </CardContent>
    </Card>
  );
};
