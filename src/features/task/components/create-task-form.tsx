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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { taskStatusValues } from '@/db/schemas';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { useOrganizationSlug } from '@/features/organization/hooks/use-organization';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateTask } from '../hooks/use-task';
import { type CreateTaskData, createTaskSchema } from '../schema';

type Options = { name: string; id: string; imageUrl: string | null };

interface CreateTaskFormProps {
  organizationId: string;
  projectId: string;
  projectOptions?: Options[];
  memberOptions?: Options[];
  onCancel?: () => void;
}

export const CreateTaskForm = ({
  memberOptions,
  organizationId,
  projectId,
  onCancel,
}: CreateTaskFormProps) => {
  const router = useRouter();
  const slug = useOrganizationSlug();
  const t = useTranslations('Task.CreateForm');
  const tStatus = useTranslations('Task.Status');
  const form = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      organizationId: organizationId,
      projectId: projectId,
      dueDate: undefined,
    },
  });

  const createTask = useCreateTask();

  const onSubmit = (data: CreateTaskData) => {
    createTask.mutate(data, {
      onSuccess: (task) => {
        router.push(`/organization/${slug}/projects/${projectId}`);
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
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('descriptionLabel')}</FormLabel>
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

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('dueDateLabel')}</FormLabel>
                      <FormControl>
                        <DatePick {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="assignedId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('assignedLabel')}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('assignedPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {memberOptions?.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  className="size-6"
                                  name={member.name}
                                  image={member.imageUrl}
                                />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('statusLabel')}</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('statusPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {taskStatusValues?.map((status) => (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-x-2">
                                {tStatus(status)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                disabled={!form.formState.isValid || createTask.isPending}
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
