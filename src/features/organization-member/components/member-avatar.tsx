import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
    <>
      <Avatar
        className={cn(
          'size-10 rounded-md transition hover:opacity-75',
          className,
        )}
      >
        <AvatarImage src={image ? image : undefined} alt="User Avatar" />
        <AvatarFallback
          className={cn(
            'flex items-center justify-center bg-neutral-200 font-medium text-neutral-500',
            fallbackClassName,
          )}
        >
          {name.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    </>
  );
};
