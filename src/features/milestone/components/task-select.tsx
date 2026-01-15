'use client';

import * as React from 'react';
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
import { cn } from '@/lib/utils';

// Mock tasks
const MOCK_TASKS = [
  { id: 'task-1', name: '设计 UI 界面' },
  { id: 'task-2', name: '开发后端 API' },
  { id: 'task-3', name: '编写测试用例' },
  { id: 'task-4', name: '部署到生产环境' },
  { id: 'task-5', name: '修复已知 Bug' },
];

interface TaskSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function TaskSelect({ value, onChange, placeholder }: TaskSelectProps) {
  const [open, setOpen] = React.useState(false);

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
          className="w-full justify-between h-auto min-h-10 hover:bg-background"
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((id) => {
                const task = MOCK_TASKS.find((t) => t.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnselect(id);
                    }}
                  >
                    {task?.name}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(id);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnselect(id);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
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
          <CommandInput placeholder="搜索任务..." />
          <CommandList>
            <CommandEmpty>未找到任务。</CommandEmpty>
            <CommandGroup>
              {MOCK_TASKS.map((task) => (
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
