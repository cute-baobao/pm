import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  return {
    test: {
      // run tests in single thread to avoid concurrency issues in integration tests
      threads: false,
      globals: true,
      env: {
        NEXT_PUBLIC_ROOT_DOMAIN: 'localhost:3000',
        NODE_ENV: 'test' as const,
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/postgres',
        BETTER_AUTH_SECRET: 'xapdv9OfyP7v0080KstuRi8xVUddMhai',
        BETTER_AUTH_URL: 'http://localhost:3000',
        RESEND_API_KEY: 're_iB5ntSQD_32MLwB18ntD8hsTQ23SpvGxS',
      },
      testTimeout: 30000,
      hookTimeout: 30000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
