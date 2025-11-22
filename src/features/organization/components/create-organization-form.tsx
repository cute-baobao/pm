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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateOrganization } from '../hooks/use-organization';
import {
  type CreateOrganizationData,
  createOrganizationSchema,
} from '../schema';

interface CreateOrganizationFormProps {
  onCancel?: () => void;
}

export const CreateOrganizationForm = ({
  onCancel,
}: CreateOrganizationFormProps) => {
  const router = useRouter();
  const t = useTranslations('Organization.CreateForm');
  const form = useForm<CreateOrganizationData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      slug: 'abc',
      logo: '',
      metadata: '',
    },
  });

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

  const createOrganization = useCreateOrganization();

  const onSubmit = (data: CreateOrganizationData) => {
    data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    console.log('Create organization data:', data);
    createOrganization.mutate(data);
  };

  const handleJoinWorkspace = () => {
    router.push('/workspaces/join');
  };

  return (
    <Card className="h-full w-full gap-0 border-none shadow-none">
      <CardHeader className="flex items-center justify-between p-7">
        <CardTitle className="text-xl font-bold">{t('title')}</CardTitle>
        <Button variant="secondary" onClick={handleJoinWorkspace} size="sm">
          {t('joinButton')}
        </Button>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
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
                disabled={
                  !form.formState.isValid || createOrganization.isPending
                }
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
