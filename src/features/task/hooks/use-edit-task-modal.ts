'use client';

import { parseAsString, useQueryState } from 'nuqs';

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState('edit-task', parseAsString);

  // 包一层，避免把 Promise 往外漏
  const open = (id: string) => {
    void setTaskId(id);
  };
  const close = () => {
    void setTaskId(null);
  };

  return {
    taskId,
    open,
    close,
    setTaskId,
  };
};
