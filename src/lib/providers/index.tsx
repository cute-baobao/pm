import { TRPCReactProvider } from '@/trpc/client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TRPCReactProvider>
        <NextIntlClientProvider>
          <JotaiProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <NuqsAdapter>{children}</NuqsAdapter>
          </JotaiProvider>
        </NextIntlClientProvider>
      </TRPCReactProvider>
    </>
  );
}
