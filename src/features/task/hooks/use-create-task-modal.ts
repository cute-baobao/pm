'use client';

import { TaskStatus, taskStatusValues } from '@/db/schemas';
import { parseAsBoolean, parseAsStringEnum, useQueryStates } from 'nuqs';

export const useCreateTaskModal = () => {
  const [{ createTask: isOpen, taskStatus: taskStatus }, setIsOpen] =
    useQueryStates({
      createTask: parseAsBoolean.withDefault(false).withOptions({
        clearOnDefault: true,
      }),
      taskStatus: parseAsStringEnum(taskStatusValues).withOptions({
        clearOnDefault: true,
      }),
    });

  // 包一层，避免把 Promise 往外漏
  const open = (status?: TaskStatus) => {
    void setIsOpen({
      createTask: true,
      taskStatus: status,
    });
  };
  const close = () => {
    void setIsOpen({ 
      createTask: false,
      taskStatus: undefined,
    });
  };

  return {
    isOpen,
    taskStatus,
    open,
    close,
    setIsOpen,
  };
};
