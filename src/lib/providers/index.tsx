import { TRPCReactProvider } from '@/trpc/client';
import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider as JotaiProvider } from "jotai"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TRPCReactProvider>
        <NextIntlClientProvider>
          <JotaiProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </JotaiProvider>
        </NextIntlClientProvider>
      </TRPCReactProvider>
    </>
  );
}
