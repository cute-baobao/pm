'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useUpdateMilestone } from '../hooks/use-milestone';

interface MilestoneDescriptionProps {
  milestoneId: string;
  description: string | null;
}

export function MilestoneDescription({
  milestoneId,
  description,
}: MilestoneDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(description ?? '');
  const t = useTranslations('Milestone.Description');

  const { mutate, isPending } = useUpdateMilestone();

  const onSave = () => {
    mutate(
      {
        milestoneId,
        description: value.trim() ? value : undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const onCancel = () => {
    setIsEditing(false);
    setValue(description ?? '');
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{t('label')}</p>
        <Button
          onClick={() => {
            if (isEditing) {
              onCancel();
            } else {
              setIsEditing(true);
            }
          }}
          size="sm"
          variant="secondary"
        >
          {isEditing ? (
            <>
              <XIcon className="ml-2 size-4" />
              {t('cancel')}
            </>
          ) : (
            <>
              <PencilIcon className="mr-2 size-4" />
              {t('edit')}
            </>
          )}
        </Button>
      </div>

      <DottedSeparator className="my-4" />

      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder={t('placeholder')}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
            rows={4}
          />
          <Button
            className="ml-auto w-fit"
            size="sm"
            onClick={onSave}
            disabled={isPending}
          >
            {isPending ? t('saving') : t('saveChanges')}
          </Button>
        </div>
      ) : (
        <div>
          {description ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {description}
            </p>
          ) : (
            <span className="text-muted-foreground">{t('noDescription')}</span>
          )}
        </div>
      )}
    </div>
  );
}
