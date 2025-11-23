'use client';
import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OrganizationRole } from '@/db/schemas';
import { useConfirm } from '@/lib/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { hasPermission } from '@/lib/utils/has-permission';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, ImageIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  useDeleteOrganization,
  useSuspenseOrganization,
  useUpdateOrganization,
} from '../hooks/use-organization';
import { UpdateOrganizationData, updateOrganizationSchema } from '../schema';

interface EditOrganizationForm {
  slug: string;
  role: OrganizationRole;
  onCancel?: () => void;
}

export const EditOrganizationForm = ({
  slug,
  role,
  onCancel,
}: EditOrganizationForm) => {
  const router = useRouter();
  const { data: initialValue } = useSuspenseOrganization(slug);
  const t = useTranslations('Organization.EditForm');
  const canEdit = useMemo(() => {
    return hasPermission(role, 'update');
  }, [role]);
  const canDelete = useMemo(() => {
    return hasPermission(role, 'delete');
  }, [role]);
  const form = useForm<UpdateOrganizationData>({
    resolver: zodResolver(updateOrganizationSchema),
    disabled: !canEdit,
    defaultValues: {
      ...initialValue,
      logo: initialValue.logo ? initialValue.logo : '',
      metadata: initialValue.metadata ? initialValue.metadata : '',
    },
  });

  const updateOrganization = useUpdateOrganization();

  const imagePreview = useWatch({
    control: form.control,
    name: 'logo',
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fieldChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: UpdateOrganizationData) => {
    data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    updateOrganization.mutate(data, {
      onSuccess: (data) => {
        form.reset();
        router.push(`/organization/${data.slug}`);
      },
    });
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    t('deleteConfirmTitle'),
    t('deleteConfirmMessage'),
    'destructive',
  );

  const deleteOrganization = useDeleteOrganization();

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteOrganization.mutate(
      { id: initialValue.id },
      {
        onSuccess: () => {
          router.push('/');
        },
      },
    );
  };

  const disable = useMemo(
    () => updateOrganization.isPending || deleteOrganization.isPending,
    [updateOrganization.isPending, deleteOrganization.isPending],
  );

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />
      <Card className="h-full w-full gap-0 border-none shadow-none">
        <CardHeader className="flex flex-row items-center space-y-0 gap-x-4 px-7 py-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/organization/${initialValue.slug}`)
            }
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            {t('backButton')}
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValue.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="px-7 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('nameLabel')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('namePlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="grid gap-2">
                  <FormLabel htmlFor="image">{t('logoLabel')}</FormLabel>
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage
                        src={imagePreview || '/placeholder.svg'}
                        alt="Organization logo"
                      />
                      <AvatarFallback className="bg-muted">
                        <ImageIcon className="text-muted-foreground size-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex w-full items-center gap-2">
                      <FormField
                        name="logo"
                        control={form.control}
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                {...fieldProps}
                                id="logo"
                                type="file"
                                accept="image/*"
                                className="w-full"
                                onChange={(event) => {
                                  handleImageChange(event, onChange);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {imagePreview && (
                        <X
                          className={cn('cursor-pointer')}
                          onClick={() => {
                            form.setValue('logo', '');
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="metadata"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('metadataLabel')} (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            className="max-h-[500px] overflow-auto"
                            {...field}
                            placeholder={t('metadataPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex flex-wrap items-center justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={onCancel}
                  className={cn(!onCancel && 'invisible')}
                >
                  {t('cancelButton')}
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || disable}
                  size="lg"
                >
                  {t('updateButton')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-full w-full gap-0 border-none shadow-none">
        <CardContent className="px-7 py-4">
          <div className="flex flex-col">
            <h3 className="font-bold">{t('dangerZone')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('dangerZoneDescription')}
            </p>
            <Button
              onClick={handleDelete}
              className="mt-6 ml-auto w-fit"
              variant="destructive"
              size="sm"
              disabled={disable || !canDelete}
            >
              {t('deleteButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
