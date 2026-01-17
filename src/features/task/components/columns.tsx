'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project, Task, User } from '@/db/schemas';
import { MemberAvatar } from '@/features/organization-member/components/member-avatar';
import { ProjectAvatar } from '@/features/project/components/project-avatar';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVerticalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TaskAction } from './task-action';
import { TaskDate } from './task-date';

export const columns: ColumnDef<
  Task & { project: Project; assignedUser: User }
>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: 'project',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.image ?? undefined}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'assignedUser',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignedUser;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            name={assignee.name}
            image={assignee.image ?? undefined}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate status={row.original.status} value={dueDate} />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const tStatus = useTranslations('Task.Status');
      return <Badge variant={status}>{tStatus(status)}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id;
      const projectId = row.original.projectId;
      return (
        <TaskAction id={id} projectId={projectId}>
          <Button variant="ghost">
            <MoreVerticalIcon className="size-4" />
          </Button>
        </TaskAction>
      );
    },
  },
];
