'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useProjectId } from '@/features/project/hooks/use-project';
import { useSuspenseTaskWithoutMilestoneSelect } from '@/features/task/hooks/use-task';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type TaskOption = { id: string; name: string };

interface TaskSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  extraOptions?: TaskOption[];
}

export function TaskSelect({
  value,
  onChange,
  placeholder,
  extraOptions,
}: TaskSelectProps) {
  const projectId = useProjectId();
  const [open, setOpen] = useState(false);
  const { data: tasks } = useSuspenseTaskWithoutMilestoneSelect(projectId);
  const t = useTranslations('Milestone.TaskSelect');

  const taskOptions = useMemo<TaskOption[]>(() => {
    const merged = new Map<string, TaskOption>();

    (extraOptions ?? []).forEach((opt) => {
      merged.set(opt.id, opt);
    });

    tasks.forEach((task) => {
      merged.set(task.id, { id: task.id, name: task.name });
    });

    return Array.from(merged.values());
  }, [tasks, extraOptions]);

  const handleUnselect = (taskId: string) => {
    onChange(value.filter((id) => id !== taskId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="hover:bg-background h-auto min-h-10 w-full justify-between"
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((id) => {
                const task = taskOptions.find((t) => t.id === id);
                return (
                  <Badge key={id} variant="secondary" className="mr-1 mb-1">
                    {task?.name}
                    <span
                      role="button"
                      tabIndex={0}
                      className="ring-offset-background focus:ring-ring ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(id);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(id);
                      }}
                    >
                      <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </span>
                  </Badge>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder={t('searchPlaceholder')} />
          <CommandList>
            <CommandEmpty>{t('noTasksFound')}</CommandEmpty>
            <CommandGroup>
              {taskOptions.map((task) => (
                <CommandItem
                  key={task.id}
                  onSelect={() => {
                    onChange(
                      value.includes(task.id)
                        ? value.filter((id) => id !== task.id)
                        : [...value, task.id],
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(task.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {task.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
