import { TRPCReactProvider } from '@/trpc/client';
import { NextIntlClientProvider } from 'next-intl';
import { Provider as JotaiProvider } from "jotai"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TRPCReactProvider>
        <NextIntlClientProvider>
          <JotaiProvider>
            {children}
          </JotaiProvider>
        </NextIntlClientProvider>
      </TRPCReactProvider>
    </>
  );
}
