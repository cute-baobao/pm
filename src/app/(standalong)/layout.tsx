import { UserButton } from '@/features/auth/components/user-button';
import Image from 'next/image';
import Link from 'next/link';

interface StandlongLayoutProps {
  children: React.ReactNode;
}
export default function StandlongLayout({ children }: StandlongLayoutProps) {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <Image
              src="/icons/logo.svg"
              alt="ProjectLogo"
              width={40}
              height={40}
              priority
            />
            <span className="align-text-bottom text-2xl font-bold">
              Projects
            </span>
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-1 flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
