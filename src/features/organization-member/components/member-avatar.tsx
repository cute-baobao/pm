import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MemberAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar className={cn('size-8 rounded-md', className)}>
      <AvatarFallback
        className={cn(
          'flex items-center justify-center overflow-hidden bg-neutral-200 font-medium text-neutral-500',
          fallbackClassName,
        )}
      >
        {image ? (
          <Image src={image} fill alt={name} />
        ) : (
          name.charAt(0).toUpperCase() || 'U'
        )}
      </AvatarFallback>
    </Avatar>
  );
};
