'use client';

import { parseAsBoolean, useQueryState } from 'nuqs';

export const useEditMilestoneModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'edit-milestone',
    parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true,
    }),
  );

  // 包一层，避免把 Promise 往外漏
  const open = (value: boolean) => {
    void setIsOpen(value);
  };

  const close = () => {
    void setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
