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
import { userAtom } from '@/features/auth/store/atom';
import { useConfirm } from '@/lib/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { ArrowLeftIcon, ImageIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { notFound, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSession } from '@/lib/auth-client';
import {
  useDeleteProject,
  useSuspenseProject,
  useUpdateProject,
} from '../hooks/use-project';
import { UpdateProjectData, updateProjectSchema } from '../schema';

interface EditProjectForm {
  role: OrganizationRole;
  projectId: string;
  slug: string;
  onCancel?: () => void;
}

export const EditProjectForm = ({
  role,
  projectId,
  slug,
  onCancel,
}: EditProjectForm) => {
  const { data: sessionData } = useSession();
  const organizationId = sessionData?.session?.activeOrganizationId || '';
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const { data: initialValue } = useSuspenseProject({
    organizationId,
    projectId,
  });
  const t = useTranslations('Organization.EditForm');
  const form = useForm<UpdateProjectData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValue,
      image: initialValue?.image || '',
      description: initialValue?.description || '',
    },
  });

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [DeleteDialog, confirmDelete] = useConfirm(
    t('deleteConfirmTitle'),
    t('deleteConfirmMessage'),
    'destructive',
  );

  // const [ExitDialog, confirmExit] = useConfirm(
  //   t('exitConfirmTitle'),
  //   t('exitConfirmMessage'),
  //   'destructive',
  // );

  const imagePreview = useWatch({
    control: form.control,
    name: 'image',
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

  const onSubmit = (data: UpdateProjectData) => {
    updateProject.mutate(data, {
      onSuccess: (data) => {
        form.reset();
        router.push(`/organization/${slug}/projects/${data.id}`);
      },
    });
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteProject.mutate(
      { projectId: initialValue!.id },
      {
        onSuccess: () => {
          router.push(`/organization/${slug}/projects`);
        },
      },
    );
  };

  const disable = useMemo(
    () => updateProject.isPending || deleteProject.isPending,
    [updateProject.isPending, deleteProject.isPending],
  );

  if (!initialValue) {
    throw notFound();
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <DeleteDialog />
      {/* <ExitDialog /> */}
      <Card className="h-full w-full gap-0 shadow-none">
        <CardHeader className="flex flex-row items-center space-y-0 gap-x-4 px-7 py-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/organization/${slug}/projects/${initialValue.id}`,
                    )
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
                        alt="Project image"
                      />
                      <AvatarFallback className="bg-muted">
                        <ImageIcon className="text-muted-foreground size-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex w-full items-center gap-2">
                      <FormField
                        name="image"
                        control={form.control}
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                {...fieldProps}
                                id="image"
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
                            form.setValue('image', '');
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('metadataLabel')}</FormLabel>
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
                <Button type="submit" disabled={disable} size="lg">
                  {t('updateButton')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-full w-full gap-0 shadow-none">
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
              disabled={disable}
            >
              {t('deleteButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="h-full w-full gap-0 border-none shadow-none">
        <CardContent className="px-7 py-4">
          <div className="flex flex-col">
            <h3 className="font-bold">{t('exitTitle')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('exitDescription')}
            </p>
            <Button
              onClick={handleExit}
              className="mt-6 ml-auto w-fit"
              variant="destructive"
              size="sm"
              disabled={disable}
            >
              {t('exitButton')}
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};
