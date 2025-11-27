'use client';
import { DottedSeparator } from '@/components/dotted-separator';
import type React from 'react';

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
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateProject } from '../hooks/use-project';
import { type CreateProjectData, createProjectSchema } from '../schema';

interface CreateProjectFormProps {
  organizationId: string;
  onCancel?: () => void;
}

export const CreateProjectForm = ({
  organizationId,
  onCancel,
}: CreateProjectFormProps) => {
  const router = useRouter();
  const slug = useOrganizationSlug();
  const t = useTranslations('Project.CreateForm');
  const form = useForm<CreateProjectData>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      image: '',
      description: '',
      organizationId: organizationId,
    },
  });

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

  const createProject = useCreateProject();

  const onSubmit = (data: CreateProjectData) => {
    createProject.mutate(data, {
      onSuccess: (project) => {
        router.push(`/organization/${slug}/projects/${project.name}`);
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-bold">{t('title')}</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent>
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
                        <Input {...field} placeholder={t('namePlaceholder')} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="grid gap-2">
                <FormLabel htmlFor="image">{t('imageLabel')}</FormLabel>
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
                      <FormLabel>{t('descriptionLabel')} (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          className="max-h-[500px] overflow-auto"
                          {...field}
                          placeholder={t('descriptionPlaceholder')}
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
                disabled={!form.formState.isValid || createProject.isPending}
                size="lg"
              >
                {t('createButton')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
