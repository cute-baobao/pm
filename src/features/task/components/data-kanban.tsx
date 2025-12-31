import { TaskStatus, taskStatusValues } from '@/db/schemas';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { UpdateTaskData } from '../schema';
import { KanbanCard, TaskEnhanced } from './kanban-card';
import { KanbanColumnHeader } from './kanban-column-header';

interface DataKanbanProps {
  data: TaskEnhanced[];
  onChange: (data: UpdateTaskData[]) => void;
}

type TasksState = {
  [key in TaskStatus]: TaskEnhanced[];
};

export function DataKanban({ data, onChange }: DataKanbanProps) {
  const tStatus = useTranslations('Task.Status');
  const boards = taskStatusValues;

  const [tasks, setTasks] = useState<TasksState>({
    [taskStatusValues[0]]: [],
    [taskStatusValues[1]]: [],
    [taskStatusValues[2]]: [],
    [taskStatusValues[3]]: [],
    [taskStatusValues[4]]: [],
  });

  const onDragEnd = useCallback((reuslt: DropResult) => {
    if (!reuslt.destination) return;

    const { source, destination } = reuslt;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;

    let updatePayload: UpdateTaskData[] = [];

    setTasks((preTasks) => {
      const newTasks = { ...preTasks };

      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      if (!movedTask) {
        console.error('Moved task not found');
        return preTasks;
      }

      const updatedMovedTask =
        sourceStatus !== destStatus
          ? { ...movedTask, status: destStatus }
          : movedTask;
      newTasks[sourceStatus] = sourceColumn;

      const destColumn = [...newTasks[destStatus]];
      destColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destStatus] = destColumn;

      updatePayload.push({
        id: updatedMovedTask.id,
        status: destStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      newTasks[destStatus].forEach((task, index) => {
        if (task && task.id !== updatedMovedTask.id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatePayload.push({
              id: task.id,
              position: newPosition,
              status: destStatus,
            });
          }
        }
      });

      if (sourceStatus !== destStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatePayload.push({
                id: task.id,
                position: newPosition,
                status: sourceStatus,
              });
            }
          }
        });
      }
      return newTasks;
    });

    if (updatePayload.length > 0) {
      onChange(updatePayload);
    }
  }, []);

  useEffect(() => {
    const newTasks: TasksState = {
      [taskStatusValues[0]]: [],
      [taskStatusValues[1]]: [],
      [taskStatusValues[2]]: [],
      [taskStatusValues[3]]: [],
      [taskStatusValues[4]]: [],
    };

    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((key) => {
      newTasks[key as TaskStatus].sort((a, b) => a.position - b.position);
    });
    setTasks(newTasks);
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="bg-muted mx-2 min-w-[200px] flex-1 rounded-md p-1.5"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
