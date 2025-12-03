import { User } from '@/db/schemas';
import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);