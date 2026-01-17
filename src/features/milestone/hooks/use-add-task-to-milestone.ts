'use client';

import { useQueryState, useQueryStates } from 'nuqs';

export const useAddTaskToMilestoneState = () => {
  const [milestoneId, setMilestoneId] = useQueryState(
    'addTaskToMilestoneId',
    { history: 'replace' },
  );
  const [newTaskId, setNewTaskId] = useQueryState(
    'newTaskId',
    { history: 'replace' },
  );

  const setMilestoneForTaskAdd = (id: string) => {
    void setMilestoneId(id);
  };

  const setCreatedTaskId = (id: string) => {
    void setNewTaskId(id);
  };

  const clearState = () => {
    void Promise.all([setMilestoneId(null), setNewTaskId(null)]);
  };

  return {
    milestoneId,
    newTaskId,
    setMilestoneForTaskAdd,
    setCreatedTaskId,
    clearState,
  };
};
