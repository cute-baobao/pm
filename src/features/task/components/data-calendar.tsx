import { enUS, zhCN } from 'date-fns/locale';
import { TaskEnhanced } from './kanban-card';

import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './data-calendar.css';
import { EventCard } from './event-card';
interface DataCalendarProps {
  data: TaskEnhanced[];
}

const locales = {
  en: enUS,
  zh: zhCN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
}

function CustomToolbar({ date, onNavigate }: CustomToolbarProps) {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-full lg:justify-start">
      <Button
        onClick={() => onNavigate('PREV')}
        size="icon"
        className="flex items-center"
        variant="secondary"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div
        onClick={() => onNavigate('TODAY')}
        className="border-input hover:bg-muted flex h-8 w-full cursor-pointer items-center justify-center rounded-md border px-3 py-2"
      >
        <CalendarIcon className="mr-2 size-4" />
        <p>{format(date, 'MMMM yyyy')}</p>
      </div>
      <Button
        onClick={() => onNavigate('NEXT')}
        size="icon"
        className="flex items-center"
        variant="secondary"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}

export function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValue] = useState(
    data.length > 0 ? data[0].dueDate : new Date(),
  );

  const events = data.map((task) => ({
    start: task.createdAt,
    end: task.dueDate,
    title: task.name,
    project: task.project,
    assignee: task.assignedUser,
    id: task.id,
    status: task.status,
  }));

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') {
      setValue(subMonths(value, 1));
    } else if (action === 'NEXT') {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={['month']}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, 'EEE', culture) ?? '',
      }}
      components={{
        eventWrapper: ({ event }) => <EventCard data={event} />,
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
}
