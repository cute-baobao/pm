import db from '@/db';
import { user } from '@/db/schemas';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export const accountPrepar = async () => {
  const owner = await auth.api.signUpEmail({
    body: {
      email: 'owner@mail.com',
      password: 'Zhizhi99.',
      name: 'Owner',
    },
  });

  const admin = await auth.api.signUpEmail({
    body: {
      email: 'admin@mail.com',
      password: 'Zhizhi99.',
      name: 'Admin',
    },
  });

  const member = await auth.api.signUpEmail({
    body: {
      email: 'member@mail.com',
      password: 'Zhizhi99.',
      name: 'Member',
    },
  });

  return { owner, admin, member };
};

export const accountCleanup = async (emails: string[]) => {
  return await Promise.all(
    emails.map((email) =>
      db
        .delete(user)
        .where(eq(user.email, email))
        .returning()
        .then((res) => res[0]),
    ),
  );
};
