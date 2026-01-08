import { DatePick } from '@/components/date-pick';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskStatus, taskStatusValues } from '@/db/schemas';
import { useSuspenseOrganizationMembers } from '@/features/organization-member/hooks/use-organization-member';
import { useGetProject } from '@/features/project/hooks/use-project';
import { FolderIcon, ListCheck, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTaskFilters } from '../hooks/use-task-filters';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
  organizationId: string;
}

export function DataFilters({
  hideProjectFilter,
  organizationId,
}: DataFiltersProps) {
  const tStatus = useTranslations('Task.Status');
  const { data: members } = useSuspenseOrganizationMembers(organizationId);
  const [{ status, assignedId, dueDate, projectId }, setFilters] =
    useTaskFilters();
  const { data: projects } = useGetProject(organizationId);

  const memberOptions = members.map((member) => ({
    label: member.user.name || member.user.email,
    value: member.user.id,
  }));

  const projectOptions = projects?.map((project) => ({
    label: project.name,
    value: project.id,
  }));

  const onStatusChange = (value: string) => {
    if (value === 'all') {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onAssignedIdChange = (value: string) => {
    if (value === 'all') {
      setFilters({ assignedId: null });
    } else {
      setFilters({ assignedId: value });
    }
  };

  const onProjectIdChange = (value: string) => {
    if (value === 'all') {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value });
    }
  };

  const onDueDateChange = (date: Date | undefined) => {
    if (date === undefined) {
      setFilters({ dueDate: null });
    } else {
      setFilters({ dueDate: date.toISOString() });
    }
  };

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        onValueChange={onStatusChange}
        defaultValue={(status as string) || 'all'}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListCheck className="mr-2 size-4 h-4 w-4" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {taskStatusValues.map((status) => (
            <SelectItem key={status} value={status}>
              {tStatus(status)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          onValueChange={onProjectIdChange}
          defaultValue={(projectId as string) || 'all'}
        >
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <FolderIcon className="mr-2 size-4 h-4 w-4" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        onValueChange={onAssignedIdChange}
        defaultValue={(assignedId as string) || 'all'}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="mr-2 size-4 h-4 w-4" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {memberOptions.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePick
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={onDueDateChange}
      />
    </div>
  );
}
