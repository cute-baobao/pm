import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useUpdateTask } from '../hooks/use-task';
import { TaskEnhanced } from './kanban-card';

interface TaskDescriptionProps {
  task: TaskEnhanced;
}

export function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);

  const { mutate, isPending } = useUpdateTask();

  const onSave = () => {
    mutate(
      {
        id: task.id,
        description: value,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          size="sm"
          variant="secondary"
        >
          {isEditing ? (
            <>
              <XIcon className="ml-2 size-4" />
              Cancel
            </>
          ) : (
            <>
              <PencilIcon className="mr-2 size-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value || ''}
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
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">No description set.</span>
          )}
        </div>
      )}
    </div>
  );
}
