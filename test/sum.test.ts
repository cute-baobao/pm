import { auth } from '@/lib/auth';
import { sum } from '@/lib/utils';
import { expect, test } from 'vitest';

test('adds 1 + 2 to equal 3', async () => {
  const a = await auth.api.signInEmail({
    body: {
      email: 'bao@mail.com',
      password: 'Zhizhi99.',
    },
  });
  const session = await auth.api.getSession({
    headers: new Headers(),
  });
  console.log(session);
  expect(sum(1, 2)).toBe(3);
});
