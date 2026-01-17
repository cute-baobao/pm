import { auth } from '@/lib/auth';
import { describe, expect, it } from 'vitest';

describe('Better Auth', () => {
  it('should sign in and get session successfully', async () => {
    // 1. 登录
    // 使用 asResponse: true 来获取包含 set-cookie 的原生 Response
    const signinResponse = await auth.api.signInEmail({
      body: {
        email: 'bao@mail.com',
        password: 'Zhizhi99.',
      },
      asResponse: true,
    });

    expect(signinResponse.status).toBe(200);

    // 2. 通过传入登录返回的 headers（包含 cookie）来获取 session
    const session = await auth.api.getSession({
      headers: signinResponse.headers,
    });

    console.log('Session result:', session);
    expect(session).not.toBeNull();
  });
});
