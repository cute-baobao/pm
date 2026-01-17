'use client';

import { parseAsBoolean, useQueryStates } from 'nuqs';

export const useCreateMilestoneModal = () => {
  const [{ createMilestone: isOpen }, setIsOpen] = useQueryStates({
    createMilestone: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  });

  // 包一层，避免把 Promise 往外漏
  const open = (value: boolean) => {
    void setIsOpen({
      createMilestone: value,
    });
  };
  const close = () => {
    void setIsOpen({
      createMilestone: false,
    });
  };

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
