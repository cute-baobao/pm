'use client';
import { DottedSeparator } from '@/components/dotted-separator';

import { DatePick } from '@/components/date-pick';
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
import { useProjectId } from '@/features/project/hooks/use-project';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateMilestone } from '../hooks/use-milestone';
import { type CreateMilestoneInput, createMilestoneSchema } from '../schema';
import { TaskSelect } from './task-select';

interface CreateMilestoneFormProps {
  onCancel?: () => void;
}

export const CreateMilestoneForm = ({ onCancel }: CreateMilestoneFormProps) => {
  const projectId = useProjectId();
  const { data: sessionData } = useSession();
  const organizationId = sessionData?.session?.activeOrganizationId || '';
  const router = useRouter();
  const slug = useOrganizationSlug();
  const t = useTranslations('Milestone.CreateForm');
  const form = useForm<CreateMilestoneInput>({
    resolver: zodResolver(createMilestoneSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      targetDate: undefined,
      createdBy: sessionData?.session.userId || '',
      organizationId: organizationId,
      projectId: projectId,
      taskIds: [],
    },
  });

  const createMilestone = useCreateMilestone();

  const onSubmit = (data: CreateMilestoneInput) => {
    createMilestone.mutate(data, {
      onSuccess: (milestone) => {
        router.push(
          `/organization/${slug}/projects/${milestone.projectId}/milestones`,
        );
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

              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('targetDateLabel')}</FormLabel>
                    <FormControl>
                      <DatePick
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('targetDatePlaceholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taskIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('taskIdsLabel')}</FormLabel>
                    <FormControl>
                      <TaskSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t('taskIdsPlaceholder')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                disabled={!form.formState.isValid || createMilestone.isPending}
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
