import { ResponsiveModal } from '@/components/responsive-modal';
import { Button, type ButtonVariantProps } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const useConfirm = (
  title: string,
  message: string,
  variant?: ButtonVariantProps,
): [React.FC<{ children?: React.ReactNode }>, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const t = useTranslations('Confirm');

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = ({ children }: { children?: React.ReactNode }) => (
    <ResponsiveModal open={!!promise} onOpenChange={handleClose}>
      <Card className="h-full w-full border-none shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {children && <div className="bg-muted/50 rounded-lg p-4">{children}</div>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={handleCancel} variant="outline" size="default" className="w-full sm:w-auto">
              {t('cancel')}
            </Button>
            <Button onClick={handleConfirm} variant={variant} size="default" className="w-full sm:w-auto">
              {t('confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
