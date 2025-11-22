'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-client';
import { cn, protocol, rootDomain } from '@/lib/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { userAtom } from '../store/atom';

const UserAvatar = ({
  avatarFallback,
  image,
}: {
  avatarFallback: string;
  image?: string;
}) => {
  return (
    <Avatar className="size-10 border border-neutral-300 transition hover:opacity-75">
      <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
        {image ? (
          <Image
            src={image}
            width={40}
            height={40}
            alt="User Avatar"
            objectFit="cover"
          />
        ) : (
          avatarFallback
        )}
      </AvatarFallback>
    </Avatar>
  );
};

const UserButton = ({ className }: { className?: string }) => {
  const t = useTranslations('Auth.UserButton');
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const setUserAtom = useSetAtom(userAtom);
  if (!user) return null;
  const { email, name } = user;
  const avatarFallback = name.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setUserAtom(null);
          router.push(`${protocol}://${rootDomain}/login`);
        },
      },
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cn('relative outline-none', className)}>
        <UserAvatar avatarFallback={avatarFallback} image={user.image || ''} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <UserAvatar avatarFallback={avatarFallback} image={user.image || ''} />
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">{name}</p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex h-10 cursor-pointer items-center justify-center font-medium"
        >
          <LogOut className="mr-2 size-4" />
          {t('logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserButton };
