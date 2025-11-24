'use client';
import { DottedSeparator } from '@/components/dotted-separator';
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
import { MoreVerticalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { useSuspenseOrganizationMembers } from '../hooks/use-organization-member';
import { MemberAvatar } from './member-avatar';

export const MemberList = () => {
  const t = useTranslations('OrganizationMember.MemberList');
  const { data: members } = useSuspenseOrganizationMembers();
  // const { mutate: deleteMember, isPending: isDeletingMember } =
  //   useDeleteMember();

  const [ConfirmDialog, confirm] = useConfirm(
    t('removeConfirmTitle'),
    t('removeConfirmMessage'),
    'destructive',
  );

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    // deleteMember({ param: { memberId } });
  };
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center space-y-0 gap-x-4">
        <CardTitle className="text-xl font-bold">{t('title')}</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members &&
          members.map(({ user, id }, index) => (
            <Fragment key={id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  className="size-10"
                  fallbackClassName="text-lg"
                  name={user.name}
                  image={user.image}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-auto" variant="secondary" size="icon">
                      <MoreVerticalIcon className="text-muted-foreground size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => {}}
                      disabled={false}
                    >
                      {t('setAdmin')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => {}}
                      disabled={false}
                    >
                      {t('setMember')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-amber-700"
                      onClick={() => handleDeleteMember(id.toString())}
                      // disabled={isDeletingMember}
                    >
                      {t('removeMember', { name: user.name })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < members.length - 1 && <Separator className="my-2.5" />}
            </Fragment>
          ))}
      </CardContent>
    </Card>
  );
};
