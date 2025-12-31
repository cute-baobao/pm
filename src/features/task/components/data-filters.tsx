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
import { useGetProjectId } from '@/features/project/hooks/use-get-projectId';
import { ListCheck, UserIcon } from 'lucide-react';
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
  const projectId = useGetProjectId();
  const tStatus = useTranslations('Task.Status');
  const { data: members } = useSuspenseOrganizationMembers(organizationId);
  const [{ status, assignedId, search, dueDate }, setFilters] =
    useTaskFilters();

  const memberOptions = members.map((member) => ({
    label: member.user.name || member.user.email,
    value: member.user.id,
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
