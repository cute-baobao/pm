import { TRPCReactProvider } from '@/trpc/client';
import { NextIntlClientProvider } from 'next-intl';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TRPCReactProvider>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </TRPCReactProvider>
    </>
  );
}
