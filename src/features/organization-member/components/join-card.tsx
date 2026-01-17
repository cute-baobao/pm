'use client';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { userAtom } from '@/features/auth/store/atom';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useJoinOrganizationViaInvitation } from '../hooks/use-organization-member';

interface JoinCardProps {
  token: string;
}

export function JoinCard({ token }: JoinCardProps) {
  const [user] = useAtom(userAtom);
  const joinOrganization = useJoinOrganizationViaInvitation();
  const router = useRouter();
  const t = useTranslations('OrganizationMember.JoinCard');

  const handleJoin = async () => {
    if (!token || !user) {
      return;
    }
    joinOrganization.mutate(
      {
        token,
        userId: user.id,
        email: user.email,
      },
      {
        onSuccess: (data) => {
          router.push(`/organization/${data.slug}`);
        },
      },
    );
  };

  const handleCancel = () => {
    router.push('/organization');
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent>
        <div className="flex flex-col items-center justify-end gap-4 lg:flex-row">
          <Button
            disabled={joinOrganization.isPending}
            onClick={handleCancel}
            variant="secondary"
            className="w-full lg:w-fit"
          >
            {t('cancelButton')}
          </Button>
          <Button
            disabled={joinOrganization.isPending}
            onClick={handleJoin}
            className="w-full lg:w-fit"
          >
            {t('joinButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
