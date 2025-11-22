'use client';

import { User } from '@/db/schemas';
import { useHydrateAtoms } from 'jotai/utils';
import { userAtom } from '../store/atom';

export function SessionProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  useHydrateAtoms([[userAtom, initialUser]]);
  return <>{children}</>;
}
