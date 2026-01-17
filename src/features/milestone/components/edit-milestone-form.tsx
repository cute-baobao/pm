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
import { milestoneStatusValues } from '@/db/schemas';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useUpdateMilestone } from '../hooks/use-milestone';
import { type UpdateMilestoneInput, updateMilestoneSchema } from '../schema';
import { TaskSelect } from './task-select';

const editMilestoneFormSchema = updateMilestoneSchema.extend({
  name: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
});

type EditMilestoneFormValues = z.infer<typeof editMilestoneFormSchema>;

type MilestoneTaskRow = { task: { id: string; name: string } };

type MilestoneForEdit = {
  id: string;
  name: string;
  description: string | null;
  targetDate: Date | null;
  status: (typeof milestoneStatusValues)[number];
  tasks?: MilestoneTaskRow[];
};

interface EditMilestoneFormProps {
  milestone: MilestoneForEdit;
  onCancel?: () => void;
}

export function EditMilestoneForm({ milestone, onCancel }: EditMilestoneFormProps) {
  const t = useTranslations('Milestone.EditForm');
  const tStatus = useTranslations('Milestone.Status');
  const { mutate: updateMilestone, isPending } = useUpdateMilestone();

  const selectedTaskIds = (milestone.tasks ?? []).map((mt) => mt.task.id);
  const selectedTaskOptions = (milestone.tasks ?? []).map((mt) => ({
    id: mt.task.id,
    name: mt.task.name,
  }));

  const form = useForm<EditMilestoneFormValues>({
    resolver: zodResolver(editMilestoneFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      milestoneId: milestone.id,
      name: milestone.name,
      description: milestone.description ?? '',
      targetDate: milestone.targetDate ? new Date(milestone.targetDate) : undefined,
      status: milestone.status,
      taskIds: selectedTaskIds,
    },
  });

  const onSubmit = (data: EditMilestoneFormValues) => {
    updateMilestone(
      {
        milestoneId: data.milestoneId,
        name: data.name,
        description: data.description?.trim() ? data.description : undefined,
        targetDate: data.targetDate,
        status: data.status,
        taskIds: data.taskIds,
      } satisfies UpdateMilestoneInput,
      {
        onSuccess: () => {
          onCancel?.();
        },
      },
    );
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('nameLabel')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('namePlaceholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('statusLabel')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('statusPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {milestoneStatusValues.map((s) => (
                          <SelectItem key={s} value={s}>
                            {tStatus(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
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
                        extraOptions={selectedTaskOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
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
                )}
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
                disabled={!form.formState.isValid || isPending}
                size="lg"
              >
                {t('updateButton')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
