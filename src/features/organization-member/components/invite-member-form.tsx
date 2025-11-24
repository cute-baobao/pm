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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrganizationRole, organizationRoleValues } from '@/db/schemas';
import { useConfirm } from '@/lib/hooks/use-confirm';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyIcon, LinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOrganizationSlug } from '../../organization/hooks/use-organization';
import { InviteMemberData, inviteMemberSchema } from '../schema';

interface InviteMemberFormProps {
  organizationId: string;
  role?: OrganizationRole;
}

const CopyInviteLink = ({ inviteLink }: { inviteLink: string }) => {
  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-x-2">
        <Input disabled value={inviteLink} />
        <Button onClick={handleCopy} variant="secondary" className="size-9">
          <CopyIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export function InviteMemberForm({
  organizationId,
  role = 'member',
}: InviteMemberFormProps) {
  const t = useTranslations('OrganizationMember.InviteMemberForm');
  const slug = useOrganizationSlug();
  const inviteButton = useRef<HTMLButtonElement>(null);
  const [inviteLink, setInviteLink] = useState<string>('');
  const form = useForm<InviteMemberData>({
    resolver: zodResolver(inviteMemberSchema),
    disabled: role === 'member',
    defaultValues: {
      organizationId,
      email: '',
      role: 'member',
    },
  });

  const [GenerateConfirm, confirm] = useConfirm(
    t('generateConfirmTitle'),
    t('generateConfirmMessage'),
  );

  const onSubmit = (data: InviteMemberData) => {};

  return (
    <div className="mx-auto w-full max-w-4xl">
      <GenerateConfirm>
        {inviteLink && <CopyInviteLink inviteLink={inviteLink} />}{' '}
      </GenerateConfirm>
      <Card className="w-full gap-0 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-x-4 px-7 py-4">
          <div>
            <CardTitle className="text-xl font-bold">{t('title')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('description')}
            </CardDescription>
          </div>
          <Button
            onClick={() => inviteButton.current?.click()}
            disabled={!form.formState.isValid}
            size="sm"
            variant="secondary"
          >
            <LinkIcon className="mr-2 size-4" />
            {t('inviteLinkButton')}
          </Button>
        </CardHeader>
        <DottedSeparator className="px-7 py-2" />
        <CardContent className="px-7 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>{t('emailLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            className="p-1 py-5"
                            {...field}
                            placeholder={t('emailPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormLabel>{t('roleLabel')}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="neutral-200 w-full p-1 py-5 font-medium">
                              <SelectValue placeholder={t('rolePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(organizationRoleValues)
                                ?.filter((role) => role !== 'owner')
                                .map((role) => (
                                  <SelectItem key={role} value={role}>
                                    <div className="flex items-center justify-start gap-3 font-medium">
                                      <span className="truncate">{role}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <button type="submit" ref={inviteButton} className="hidden" />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
